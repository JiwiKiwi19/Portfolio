import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  AlertCircle,
  ArrowUp,
  ArrowUpRight,
  AudioLines,
  Check,
  Copy,
  Loader2,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Square,
  Volume2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AiAvatar from "./AiAvatar";
import Markdown from "./Markdown";
import ToolCardView from "./ToolCards";
import VoiceMode from "./VoiceMode";
import { recognitionSupported, speaker, useSpeaker, useSpeechRecognition } from "./speech";
import { useChat } from "./useChat";
import type { ChatMessage } from "./types";

const STARTERS = [
  { label: "Tell me about Jiwon", prompt: "Tell me about Jiwon." },
  { label: "Explore his projects", prompt: "Walk me through Jiwon's projects. Which one is the most interesting?" },
  { label: "What's he working on now?", prompt: "What is Jiwon currently working on?" },
  { label: "Explain ROCsim simply", prompt: "Explain ROCsim like I'm new to GPU programming." },
  { label: "Let's talk about AI", prompt: "What's happening in AI today?" },
  { label: "Weather in Seoul", prompt: "What's the weather like in Seoul right now, where Jiwon is interning?" },
];

const iconButton =
  "inline-flex h-9 items-center justify-center gap-2 px-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary disabled:pointer-events-none disabled:opacity-40";

function ToolChips({ message }: { message: ChatMessage }) {
  if (!message.tools?.length) return null;
  return (
    <ul className="mb-3 flex flex-wrap gap-2">
      {message.tools.map((tool) => (
        <li
          key={tool.id}
          className={cn(
            "inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[11px]",
            tool.state === "error" ? "border-destructive/40 text-destructive" : "border-border text-muted-foreground",
          )}
        >
          {tool.state === "start" && <Loader2 className="h-3 w-3 animate-spin text-primary" aria-hidden />}
          {tool.state === "done" && <span className="lit" aria-hidden />}
          {tool.state === "error" && <AlertCircle className="h-3 w-3" aria-hidden />}
          {tool.state === "error" ? `${tool.label} — unavailable` : tool.state === "start" ? `${tool.label}…` : tool.label}
        </li>
      ))}
    </ul>
  );
}

function MessageActions({ message, onRetry }: { message: ChatMessage; onRetry: () => void }) {
  const speech = useSpeaker();
  const [copied, setCopied] = useState(false);
  const mine = speech.owner === message.id;
  const canSpeak = speaker.supported && message.content.trim() && message.status !== "streaming";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; nothing useful to tell the visitor.
    }
  };

  if (message.status === "streaming") return null;
  return (
    <div className="-ml-2.5 mt-2 flex flex-wrap items-center">
      {canSpeak && !mine && (
        <button type="button" className={iconButton} onClick={() => speaker.speak(message.id, message.content)}>
          <Volume2 className="h-3.5 w-3.5" aria-hidden /> Listen
        </button>
      )}
      {mine && (
        <>
          <button
            type="button"
            className={cn(iconButton, "text-primary")}
            onClick={() => (speech.status === "paused" ? speaker.resume() : speaker.pause())}
          >
            {speech.status === "paused" ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
            {speech.status === "paused" ? "Resume" : "Pause"}
          </button>
          <button type="button" className={iconButton} onClick={() => speaker.cancel()}>
            <Square className="h-3 w-3" aria-hidden /> Stop
          </button>
        </>
      )}
      {message.content.trim() && (
        <button type="button" className={iconButton} onClick={copy} aria-label={copied ? "Copied" : "Copy reply"}>
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </button>
      )}
      {(message.status === "error" || message.status === "stopped") && (
        <button type="button" className={iconButton} onClick={onRetry}>
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> {message.status === "error" ? "Try again" : "Regenerate"}
        </button>
      )}
    </div>
  );
}

function AssistantMessage({ message, onRetry }: { message: ChatMessage; onRetry: () => void }) {
  const speech = useSpeaker();
  const streaming = message.status === "streaming";
  const waiting = streaming && !message.content;
  const state = speech.owner === message.id && speech.status === "speaking" ? "speaking" : waiting ? "thinking" : "idle";

  return (
    <li className="jai-message-in flex gap-3 sm:gap-4">
      <AiAvatar size={36} state={state} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="slug mb-1.5 text-foreground/80">J.AI</p>
        <ToolChips message={message} />
        {waiting && !message.tools?.some((t) => t.state === "start") && (
          <p className="flex items-center gap-3 py-1 text-sm text-muted-foreground" role="status">
            <span className="jai-dots inline-flex gap-1" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            Thinking…
          </p>
        )}
        {message.content && (
          <div className="text-[15.5px] leading-relaxed text-foreground/90">
            <Markdown text={message.content} className="space-y-3" />
            {streaming && <span className="jai-caret" aria-hidden />}
          </div>
        )}
        {message.cards?.map(({ id, card }) => (
          <div key={id} className="mt-4">
            <ToolCardView card={card} />
          </div>
        ))}
        {message.status === "stopped" && <p className="mt-2 font-mono text-[11px] text-muted-foreground">Stopped.</p>}
        {message.status === "error" && (
          <p className="mt-2 flex items-start gap-2 border-l-2 border-destructive pl-3 text-sm text-foreground/90" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
            {message.error}
          </p>
        )}
        <MessageActions message={message} onRetry={onRetry} />
      </div>
    </li>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <li className="jai-message-in flex justify-end">
      <div className="max-w-[88%] sm:max-w-[78%]">
        <p className="slug mb-1.5 text-right">You</p>
        <div className="whitespace-pre-wrap break-words border-r-2 border-primary bg-[hsl(var(--jai-user-bg))] px-4 py-2.5 text-[15.5px] leading-relaxed text-[hsl(var(--jai-user-fg))]">
          {message.content}
        </div>
      </div>
    </li>
  );
}

function EmptyState({ onPick, onVoice }: { onPick: (prompt: string) => void; onVoice: () => void }) {
  return (
    <div className="flex h-full flex-col justify-center gap-8 py-6">
      <div className="flex items-start gap-4">
        <AiAvatar size={56} />
        <div>
          <p className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-[1.02] text-foreground">
            Ask me about <em>Jiwon</em>
            <span className="text-primary">,</span> or anything else.
          </p>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            I'm J.AI, Jiwon's AI assistant. I answer from his verified portfolio and résumé, can pull live weather and
            headlines, and you can talk to me out loud.
          </p>
        </div>
      </div>

      <ul className="grid border-t border-border sm:grid-cols-2 sm:gap-x-8">
        {STARTERS.map(({ label, prompt }, i) => (
          <li key={label} className="border-b border-border">
            <button
              type="button"
              onClick={() => onPick(prompt)}
              className="group flex w-full items-center justify-between gap-3 py-3 text-left text-[15px] font-medium text-foreground transition-colors hover:text-primary"
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-primary">{String(i + 1).padStart(2, "0")}</span>
                {label}
              </span>
              <ArrowUpRight
                size={16}
                className="shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onVoice}
        className="group inline-flex w-fit items-center gap-3 text-sm font-medium text-foreground transition-colors hover:text-primary"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/60 transition-colors group-hover:border-primary">
          <AudioLines className="h-4 w-4" aria-hidden />
        </span>
        Prefer to talk? Start a voice conversation
      </button>
    </div>
  );
}

const ChatPanel = () => {
  const chat = useChat();
  const { messages, busy, send, retry, stop, reset } = chat;
  const [draft, setDraft] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottom = useRef(true);
  const draftBeforeDictation = useRef("");

  const dictation = useSpeechRecognition((text) => {
    const base = draftBeforeDictation.current;
    setDraft((base ? `${base} ` : "") + text);
    inputRef.current?.focus();
  });
  const canDictate = recognitionSupported();

  // Follow the conversation unless the visitor has scrolled up to read.
  useLayoutEffect(() => {
    const log = logRef.current;
    if (log && stickToBottom.current) log.scrollTop = log.scrollHeight;
  }, [messages]);

  // Auto-grow the textarea up to a few lines.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft, dictation.interim]);

  useEffect(() => () => speaker.cancel(), []);

  const submit = useCallback(
    (text: string) => {
      if (!text.trim() || busy) return;
      speaker.cancel();
      dictation.abort();
      stickToBottom.current = true;
      send(text);
      setDraft("");
    },
    [busy, send, dictation],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(draft);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit(draft);
    }
  };

  const toggleDictation = () => {
    if (dictation.listening) return dictation.stop();
    draftBeforeDictation.current = draft.trim();
    dictation.start();
  };

  const newChat = () => {
    speaker.cancel();
    reset();
    setDraft("");
    inputRef.current?.focus();
  };

  const avatarState = busy ? "thinking" : dictation.listening ? "listening" : "idle";

  return (
    <div className="relative overflow-hidden border-t-2 border-foreground bg-card/40 shadow-[var(--shadow-card)]">
      <div aria-hidden className="jai-aura pointer-events-none absolute inset-0" />

      {/* Masthead */}
      <div className="relative flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <AiAvatar size={40} state={avatarState} />
          <div className="min-w-0">
            <p className="font-display text-2xl leading-none text-foreground">
              J<span className="text-primary">.</span>AI
            </p>
            <p className="slug mt-1 truncate text-[10px]">Jiwon's AI assistant · not Jiwon himself</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center">
          <button type="button" className={iconButton} onClick={() => setVoiceOpen(true)} aria-label="Open voice mode">
            <AudioLines className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Voice</span>
          </button>
          <button
            type="button"
            className={iconButton}
            onClick={newChat}
            disabled={!messages.length}
            aria-label="Start a new conversation"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">New chat</span>
          </button>
        </div>
      </div>

      {/* Conversation */}
      <div
        ref={logRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        className="relative h-[min(62vh,640px)] min-h-[420px] overflow-y-auto overscroll-contain px-4 sm:px-6"
      >
        {messages.length === 0 ? (
          <EmptyState onPick={submit} onVoice={() => setVoiceOpen(true)} />
        ) : (
          <ol role="log" aria-live="polite" aria-label="Conversation with J.AI" className="space-y-7 py-6">
            {messages.map((m) =>
              m.role === "user" ? (
                <UserMessage key={m.id} message={m} />
              ) : (
                <AssistantMessage key={m.id} message={m} onRetry={() => retry()} />
              ),
            )}
          </ol>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={onSubmit} className="relative border-t border-border bg-background/70 px-4 py-3 backdrop-blur sm:px-6">
        {dictation.error && (
          <p className="mb-2 flex items-center justify-between gap-2 text-xs text-muted-foreground" role="alert">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" aria-hidden />
              {dictation.error}
            </span>
            <button type="button" onClick={() => dictation.setError(null)} aria-label="Dismiss" className="hover:text-primary">
              <X className="h-3.5 w-3.5" />
            </button>
          </p>
        )}
        <div
          className={cn(
            "flex items-end gap-2 border bg-background px-2 py-1.5 transition-colors focus-within:border-primary",
            dictation.listening ? "border-primary" : "border-input",
          )}
        >
          {canDictate && (
            <button
              type="button"
              onClick={toggleDictation}
              aria-label={dictation.listening ? "Stop dictation" : "Dictate a message"}
              aria-pressed={dictation.listening}
              className={cn(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center transition-colors",
                dictation.listening ? "text-primary" : "text-muted-foreground hover:text-primary",
              )}
            >
              {dictation.listening ? (
                <span className="jai-dots inline-flex gap-0.5" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                <Mic className="h-[18px] w-[18px]" aria-hidden />
              )}
            </button>
          )}
          <label htmlFor="jai-input" className="sr-only">
            Message J.AI
          </label>
          <textarea
            id="jai-input"
            ref={inputRef}
            rows={1}
            value={dictation.listening && dictation.interim ? `${draftBeforeDictation.current} ${dictation.interim}`.trim() : draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            readOnly={dictation.listening}
            maxLength={2000}
            placeholder={dictation.listening ? "Listening…" : "Ask about Jiwon, or anything…"}
            className="max-h-40 min-h-[36px] flex-1 resize-none bg-transparent px-1 py-[7px] text-[15px] leading-snug text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {busy ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop generating"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-foreground/70 text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Square className="h-3.5 w-3.5 fill-current" aria-hidden />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground transition-opacity disabled:opacity-35"
            >
              <ArrowUp className="h-[18px] w-[18px]" aria-hidden />
            </button>
          )}
        </div>
        <p className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono text-[10.5px] text-muted-foreground">
          <span className="hidden sm:inline">Enter to send · Shift + Enter for a new line</span>
          <span>AI answers can be wrong. Chats aren't saved.</span>
        </p>
      </form>

      <VoiceMode open={voiceOpen} onOpenChange={setVoiceOpen} chat={chat} />
    </div>
  );
};

export default ChatPanel;
