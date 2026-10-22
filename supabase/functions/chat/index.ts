// J.AI — the portfolio's AI assistant.
//
// POST { messages: [{ role: "user" | "assistant", content: string }], voice?: boolean }
// → application/x-ndjson stream, one JSON event per line:
//   { t: "text", v }                       streamed answer text
//   { t: "tool", id, name, label, state }  live-data lookup started / done / error
//   { t: "card", id, card }                weather / news / GitHub data rendered by the UI
//   { t: "done" } | { t: "error", code, message }
//
// Secrets: CHAT_API_KEY (required), CHAT_BASE_URL, CHAT_MODEL, ALLOWED_ORIGINS, GITHUB_TOKEN (optional).
// Conversations are not stored or logged; the browser sends the visible history on each turn.
//
// Talks to any OpenAI-compatible chat completions API. The default is Google Gemini's free tier;
// point CHAT_BASE_URL and CHAT_MODEL at another provider (e.g. Groq) to switch without code changes.

import { buildSystemPrompt, VOICE_MODE_NOTE } from "./profile.ts";
import { TOOLS, ToolError, type ToolName } from "./tools.ts";

const BASE_URL = (Deno.env.get("CHAT_BASE_URL") || "https://generativelanguage.googleapis.com/v1beta/openai").replace(/\/+$/, "");
// Google's alias for its newest Flash model, so the default doesn't go stale when a version is retired.
const MODEL = Deno.env.get("CHAT_MODEL") || "gemini-flash-latest";
// Conversational replies don't need deep reasoning; low effort keeps answers quick.
const REASONING_EFFORT = "low";
// A hard cap for a public endpoint: generous for chat answers, bounded for cost.
const MAX_TOKENS = 4096;
const MAX_TOOL_ROUNDS = 4;

const LIMITS = {
  messages: 40, // history is trimmed to the most recent turns beyond this
  userChars: 2000,
  assistantChars: 8000,
  perMinute: 8,
  perHour: 60,
};

const SYSTEM_PROMPT = buildSystemPrompt();

const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": allowedOrigins.length ? (origin ?? "") : "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(status: number, body: unknown, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

// ---------------------------------------------------------------- abuse protection
// Best effort: per-isolate memory, so limits reset when the function cold-starts.
// The provider's own quota (or spend limit) is the hard ceiling.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3600_000);
  const lastMinute = recent.filter((t) => now - t < 60_000).length;
  if (lastMinute >= LIMITS.perMinute || recent.length >= LIMITS.perHour) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.delete(hits.keys().next().value!);
  return false;
}

type ChatTurn = { role: "user" | "assistant"; content: string };

function validate(body: unknown): { turns: ChatTurn[]; voice: boolean } | string {
  if (!body || typeof body !== "object") return "Body must be a JSON object.";
  const { messages, voice } = body as { messages?: unknown; voice?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) return "messages must be a non-empty array.";

  const turns: ChatTurn[] = [];
  for (const m of messages.slice(-LIMITS.messages)) {
    if (!m || typeof m !== "object") return "Invalid message.";
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return "Invalid message.";
    const text = content.trim();
    if (!text) continue;
    const max = role === "user" ? LIMITS.userChars : LIMITS.assistantChars;
    if (text.length > max) return `Messages are limited to ${max} characters.`;
    // Merge consecutive same-role turns (e.g. a retried user message) so roles alternate.
    const prev = turns[turns.length - 1];
    if (prev?.role === role) prev.content += `\n\n${text}`;
    else turns.push({ role, content: text });
  }
  while (turns[0]?.role === "assistant") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return "The last message must be from the user.";
  return { turns, voice: voice === true };
}

// ---------------------------------------------------------------- handler

// Gemini's schema support is narrower than JSON Schema; additionalProperties is dropped
// (each tool's zod schema still rejects unknown fields).
const toolDefinitions = Object.values(TOOLS).map(({ definition: { name, description, input_schema } }) => {
  const { additionalProperties: _, ...parameters } = input_schema;
  return { type: "function" as const, function: { name, description, parameters } };
});

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" }, origin);
  if (allowedOrigins.length && (!origin || !allowedOrigins.includes(origin))) {
    return json(403, { error: "forbidden_origin" }, origin);
  }

  const apiKey = Deno.env.get("CHAT_API_KEY");
  if (!apiKey) {
    return json(503, { error: "not_configured", message: "The assistant isn't configured yet." }, origin);
  }

  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";
  if (rateLimited(ip)) {
    return json(429, { error: "rate_limited", message: "You're sending messages quickly. Try again in a minute." }, origin);
  }

  let parsed: ReturnType<typeof validate>;
  try {
    parsed = validate(await req.json());
  } catch {
    parsed = "Body must be valid JSON.";
  }
  if (typeof parsed === "string") return json(400, { error: "bad_request", message: parsed }, origin);
  const { turns, voice } = parsed;

  // Aborted when the visitor stops generation or leaves (the stream's cancel()).
  const abort = new AbortController();

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        if (abort.signal.aborted) return;
        try {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        } catch {
          abort.abort();
        }
      };

      try {
        await runConversation(apiKey, turns, voice, send, abort.signal);
        send({ t: "done" });
      } catch (err) {
        if (!abort.signal.aborted) {
          const { code, message } = describeError(err);
          console.error("chat error:", code, err instanceof Error ? err.message : String(err));
          send({ t: "error", code, message });
        }
      } finally {
        try {
          controller.close();
        } catch {
          // already closed by the client
        }
      }
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(body, {
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
});


// ---------------------------------------------------------------- provider (OpenAI-compatible)

type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
  // Gemini attaches a thought signature here; it must be sent back with the call or the next turn fails.
  extra_content?: unknown;
};

type ApiMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

type StreamChunk = {
  choices?: {
    delta?: {
      content?: string | null;
      tool_calls?: { index?: number; id?: string; function?: { name?: string; arguments?: string }; extra_content?: unknown }[];
    };
    finish_reason?: string | null;
  }[];
};

class ProviderError extends Error {
  constructor(
    public status: number,
    detail: string,
  ) {
    super(`provider ${status}: ${detail.slice(0, 300)}`);
  }
}

// Yields each `data:` payload of a server-sent event stream.
async function* sseData(body: ReadableStream<Uint8Array>) {
  const reader = body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    let newline: number;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      yield data;
    }
  }
}

async function runConversation(
  apiKey: string,
  turns: ChatTurn[],
  voice: boolean,
  send: (e: Record<string, unknown>) => void,
  signal: AbortSignal,
) {
  const now = new Date();
  const context = [
    `Current date and time: ${now.toUTCString()} (UTC). In Toronto it is ${now.toLocaleString("en-CA", {
      timeZone: "America/Toronto",
      dateStyle: "full",
      timeStyle: "short",
    })}.`,
    voice ? VOICE_MODE_NOTE : "",
  ].filter(Boolean).join("\n\n");

  const messages: ApiMessage[] = [
    { role: "system", content: `${SYSTEM_PROMPT}\n\n${context}` },
    ...turns.map((t) => ({ role: t.role, content: t.content })),
  ];

  let wroteText = false;

  for (let round = 0; round < MAX_TOOL_ROUNDS + 1; round++) {
    const lastRound = round === MAX_TOOL_ROUNDS;
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        reasoning_effort: REASONING_EFFORT,
        stream: true,
        tools: toolDefinitions,
        // Out of tool rounds: let the model answer with what it has.
        tool_choice: lastRound ? "none" : "auto",
        messages,
      }),
      signal,
    });
    if (!res.ok || !res.body) throw new ProviderError(res.status, await res.text().catch(() => ""));

    let text = "";
    let finishReason: string | null = null;
    const calls: ToolCall[] = [];

    for await (const data of sseData(res.body)) {
      const chunk = JSON.parse(data) as StreamChunk;
      const choice = chunk.choices?.[0];
      if (!choice) continue;
      finishReason = choice.finish_reason ?? finishReason;

      const delta = choice.delta?.content;
      if (delta) {
        // A new paragraph between the text before a lookup and the answer after it.
        if (wroteText && !text) send({ t: "text", v: "\n\n" });
        text += delta;
        send({ t: "text", v: delta });
      }

      // OpenAI streams a call in indexed fragments; Gemini sends each call whole, sometimes without an index.
      for (const part of choice.delta?.tool_calls ?? []) {
        const i = part.index ?? calls.length;
        const call = (calls[i] ??= { id: "", type: "function", function: { name: "", arguments: "" } });
        if (part.id) call.id = part.id;
        if (part.function?.name) call.function.name = part.function.name;
        if (part.function?.arguments) call.function.arguments += part.function.arguments;
        if (part.extra_content) call.extra_content = part.extra_content;
      }
    }
    if (text.trim()) wroteText = true;

    const toolCalls = calls.filter(Boolean).map((c, i) => ({ ...c, id: c.id || `call_${round}_${i}` }));
    // A tool input cut off at max_tokens can still look valid; never run it.
    if (finishReason === "length" && toolCalls.length) throw new Error("tool input truncated");
    // Gemini reports "stop" even when it called tools, so the calls decide whether to continue.
    if (toolCalls.length === 0) return;

    messages.push({ role: "assistant", content: text || null, tool_calls: toolCalls });
    messages.push(...(await Promise.all(toolCalls.map((call) => runTool(call, send)))));
  }
}

type RegisteredTool = {
  schema: { safeParse(input: unknown): { success: true; data: unknown } | { success: false; error: { issues: { message: string }[] } } };
  status(input: unknown): string;
  run(input: unknown): Promise<{ forModel: unknown; card: unknown }>;
};

async function runTool(call: ToolCall, send: (e: Record<string, unknown>) => void): Promise<ApiMessage> {
  const name = call.function.name;
  const result = (content: string): ApiMessage => ({ role: "tool", tool_call_id: call.id, content });

  // Each tool validates its own input with its zod schema before running.
  const tool = TOOLS[name as ToolName] as unknown as RegisteredTool | undefined;
  if (!tool) return result(`Unknown tool ${name}`);
  let args: unknown;
  try {
    args = JSON.parse(call.function.arguments || "{}");
  } catch {
    return result(JSON.stringify({ INVALID_INPUT: ["arguments were not valid JSON"] }));
  }
  const input = tool.schema.safeParse(args);
  if (!input.success) return result(JSON.stringify({ INVALID_INPUT: input.error.issues.map((i) => i.message) }));

  const label = tool.status(input.data);
  send({ t: "tool", id: call.id, name, label, state: "start" });
  try {
    const { forModel, card } = await tool.run(input.data);
    send({ t: "tool", id: call.id, name, label, state: "done" });
    if (card) send({ t: "card", id: call.id, card });
    return result(JSON.stringify(forModel));
  } catch (err) {
    const reason = err instanceof ToolError ? err.message : "the service did not respond";
    console.error(`tool ${name} failed:`, err instanceof Error ? err.message : String(err));
    send({ t: "tool", id: call.id, name, label, state: "error" });
    return result(`Live data unavailable right now (${reason}). Tell the visitor; do not guess.`);
  }
}

function describeError(err: unknown): { code: string; message: string } {
  if (err instanceof ProviderError) {
    // Gemini answers an invalid key with 400 rather than 401.
    if (err.status === 401 || err.status === 403 || /api key/i.test(err.message)) {
      return { code: "not_configured", message: "The assistant's AI provider isn't configured correctly." };
    }
    if (err.status === 429) {
      return { code: "busy", message: "The assistant is getting a lot of questions right now. Try again shortly." };
    }
    if (err.status === 400) {
      return { code: "bad_request", message: "That conversation couldn't be processed. Try starting a new chat." };
    }
    return { code: "unavailable", message: "The AI service had a hiccup. Try again in a moment." };
  }
  if (err instanceof TypeError) {
    return { code: "unavailable", message: "Couldn't reach the AI service. Try again in a moment." };
  }
  return { code: "internal", message: "Something went wrong on our side. Try again." };
}
