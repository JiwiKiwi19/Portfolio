import type { StreamEvent } from "./types";

// VITE_CHAT_ENDPOINT points at the chat function's own Supabase project (or `supabase functions serve` locally);
// without it, the site's main Supabase project is used.
const CUSTOM_ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT;
const ENDPOINT = CUSTOM_ENDPOINT || `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
// The public anon key — the same one the Supabase client ships to every visitor. Not a secret.
// It belongs to the main project, so it isn't sent to a custom endpoint (deployed with verify_jwt off).
const ANON_KEY = CUSTOM_ENDPOINT ? undefined : import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export class ChatError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

type Turn = { role: "user" | "assistant"; content: string };

export async function streamChat(
  messages: Turn[],
  options: { voice?: boolean; signal: AbortSignal; onEvent: (event: StreamEvent) => void },
) {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(ANON_KEY ? { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } : {}),
      },
      body: JSON.stringify({ messages, voice: options.voice ?? false }),
      signal: options.signal,
    });
  } catch (err) {
    if (options.signal.aborted) throw err;
    throw new ChatError("offline", "Couldn't reach the assistant. Check your connection and try again.");
  }

  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => null);
    if (res.status === 404) throw new ChatError("unavailable", "The assistant isn't deployed yet.");
    throw new ChatError(data?.error ?? "unavailable", data?.message ?? "The assistant is unavailable right now.");
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let finished = false;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    let newline: number;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;
      const event = JSON.parse(line) as StreamEvent;
      if (event.t === "error") throw new ChatError(event.code, event.message);
      if (event.t === "done") finished = true;
      options.onEvent(event);
    }
  }
  if (!finished) throw new ChatError("interrupted", "The response was cut off. Try again.");
}
