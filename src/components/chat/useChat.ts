import { useCallback, useEffect, useRef, useState } from "react";
import { ChatError, streamChat } from "./api";
import type { ChatMessage } from "./types";

type SendOptions = {
  voice?: boolean;
  /** Each streamed text fragment (voice mode speaks sentences as they arrive). */
  onDelta?: (text: string) => void;
  /** Called once the reply settles, with whether it completed normally. */
  onSettled?: (ok: boolean) => void;
};

let counter = 0;
const nextId = () => `m${Date.now().toString(36)}${(counter++).toString(36)}`;

// Conversation state lives only in memory: nothing is persisted in the browser or on the server.
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => () => abortRef.current?.abort(), []);

  const patch = useCallback((id: string, update: (m: ChatMessage) => ChatMessage) => {
    setMessages((list) => list.map((m) => (m.id === id ? update(m) : m)));
  }, []);

  const run = useCallback(
    async (history: ChatMessage[], options: SendOptions = {}) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const reply: ChatMessage = { id: nextId(), role: "assistant", content: "", status: "streaming" };
      setMessages([...history, reply]);
      setBusy(true);

      // Failed replies aren't sent back as context.
      const turns = history
        .filter((m) => m.status !== "error" && m.content.trim())
        .map((m) => ({ role: m.role, content: m.content }));

      let ok = false;
      try {
        await streamChat(turns, {
          voice: options.voice,
          signal: controller.signal,
          onEvent: (event) => {
            if (event.t === "text") {
              options.onDelta?.(event.v);
              patch(reply.id, (m) => ({ ...m, content: m.content + event.v }));
            } else if (event.t === "tool") {
              patch(reply.id, (m) => {
                const tools = (m.tools ?? []).filter((t) => t.id !== event.id);
                return { ...m, tools: [...tools, { id: event.id, name: event.name, label: event.label, state: event.state }] };
              });
            } else if (event.t === "card") {
              patch(reply.id, (m) => ({ ...m, cards: [...(m.cards ?? []), { id: event.id, card: event.card }] }));
            }
          },
        });
        ok = true;
        patch(reply.id, (m) => ({ ...m, status: "done" }));
      } catch (err) {
        if (controller.signal.aborted) {
          patch(reply.id, (m) => ({ ...m, status: "stopped" }));
        } else {
          const message = err instanceof ChatError ? err.message : "Something went wrong. Try again.";
          patch(reply.id, (m) => ({ ...m, status: "error", error: message }));
        }
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
          setBusy(false);
        }
        options.onSettled?.(ok);
      }
    },
    [patch],
  );

  const send = useCallback(
    (text: string, options?: SendOptions) => {
      const content = text.trim().slice(0, 2000);
      if (!content) return;
      const history = messagesRef.current.filter((m) => m.status !== "error");
      void run([...history, { id: nextId(), role: "user", content }], options);
    },
    [run],
  );

  /** Re-asks the last question, replacing a failed or stopped reply. */
  const retry = useCallback(
    (options?: SendOptions) => {
      const list = messagesRef.current;
      const lastUser = list.map((m) => m.role).lastIndexOf("user");
      if (lastUser < 0) return;
      void run(list.slice(0, lastUser + 1), options);
    },
    [run],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
  }, []);

  return { messages, busy, send, retry, stop, reset };
}

export type ChatController = ReturnType<typeof useChat>;
