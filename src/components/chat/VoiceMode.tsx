import { useEffect, useRef, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, ArrowUp, Keyboard, Mic, Pause, Play, Square, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import AiAvatar from "./AiAvatar";
import { recognitionSupported, speaker, toSpeakable, useMicLevel, useSpeaker, useSpeechRecognition } from "./speech";
import type { ChatController } from "./useChat";

interface VoiceModeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: ChatController;
}

const control =
  "inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-35";

// Immersive voice conversation. Speech recognition and synthesis are the browser's own
// (Web Speech API); replies stream from the same chat backend and are spoken sentence by sentence.
// The conversation is shared with the text chat, so leaving voice mode keeps the transcript.
const VoiceMode = ({ open, onOpenChange, chat }: VoiceModeProps) => {
  const speech = useSpeaker();
  const [muted, setMuted] = useState(false);
  const [heard, setHeard] = useState("");
  const [typed, setTyped] = useState("");
  const orbRef = useRef<HTMLDivElement>(null);
  const session = useRef(0); // bumps on open/close so late callbacks from an old session are ignored
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const canListen = recognitionSupported();

  const rec = useSpeechRecognition((text) => ask(text));

  useMicLevel(open && rec.listening, (level) => orbRef.current?.style.setProperty("--level", level.toFixed(3)));

  function listen() {
    speaker.cancel();
    if (canListen) rec.start();
  }

  function ask(text: string) {
    const id = session.current;
    const owner = `voice-${Date.now()}`;
    let speaking = false;
    setHeard(text);
    speaker.cancel();
    chat.send(text, {
      voice: true,
      onDelta: (delta) => {
        if (id !== session.current || mutedRef.current) return;
        if (!speaking) {
          speaker.begin(owner);
          speaking = true;
        }
        speaker.push(delta);
      },
      onSettled: (ok) => {
        if (id !== session.current) return;
        // Hands-free: once the reply has been spoken, listen for the next question.
        const next = () => id === session.current && ok && !mutedRef.current && canListen && rec.start();
        if (speaking) speaker.end(next);
        else next();
      },
    });
  }

  useEffect(() => {
    session.current++;
    if (open) {
      setHeard("");
      rec.setError(null);
      // Opening is a click, so the browser may show its microphone prompt now.
      if (canListen) rec.start();
    } else {
      rec.abort();
      speaker.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const busy = chat.busy;
  const phase = rec.listening
    ? "listening"
    : speech.status !== "idle" && speech.owner?.startsWith("voice-")
      ? "speaking"
      : busy
        ? "thinking"
        : "idle";

  // Only replies from this voice session are shown here (heard is reset on open).
  const lastReply = heard ? [...chat.messages].reverse().find((m) => m.role === "assistant") : undefined;
  const activeTool = lastReply?.tools?.find((t) => t.state === "start");
  const replyText = lastReply ? toSpeakable(lastReply.content) : "";
  const hasCards = Boolean(lastReply?.cards?.length);

  const status = {
    listening: "Listening…",
    thinking: activeTool ? `${activeTool.label}…` : "Thinking…",
    speaking: speech.status === "paused" ? "Paused" : "Speaking",
    idle: canListen ? "Tap the mic to talk" : "Type below to talk",
  }[phase];

  const onMic = () => {
    if (rec.listening) return rec.stop();
    if (busy) chat.stop();
    listen();
  };

  const onType = (e: FormEvent) => {
    e.preventDefault();
    if (!typed.trim() || busy) return;
    ask(typed.trim());
    setTyped("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="jai-voice-backdrop jai-overlay-in fixed inset-0 z-[80]" />
        <Dialog.Content
          className="fixed inset-0 z-[81] flex flex-col items-center justify-between overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] focus:outline-none"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="flex w-full max-w-3xl items-center justify-between">
            <p className="slug flex items-center gap-2.5">
              <span className="lit" aria-hidden />
              Voice · J.AI
            </p>
            <Dialog.Close
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Exit voice mode"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="jai-stage-in flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 py-8 text-center">
            <div ref={orbRef} data-state={phase} className="jai-orb h-40 w-40 sm:h-48 sm:w-48">
              <span aria-hidden className="jai-orb-ring" />
              <span aria-hidden className="jai-orb-ring r2" />
              <AiAvatar
                size={150}
                state={phase === "speaking" && speech.status === "paused" ? "idle" : phase}
                className="scale-[0.95] sm:scale-110"
              />
            </div>

            <div>
              <Dialog.Title className="font-display text-[clamp(2rem,6vw,3.25rem)] leading-none text-foreground" aria-live="polite">
                {status}
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Voice conversation with Jiwon's AI assistant. Press Escape to return to the text chat.
              </Dialog.Description>
              {phase === "listening" && (
                <div aria-hidden className="jai-wave mt-4 flex h-8 items-center justify-center gap-1">
                  {[10, 18, 26, 18, 30, 22, 14, 24, 12].map((h, i) => (
                    <span key={i} style={{ ["--h" as string]: `${h}px` }} />
                  ))}
                </div>
              )}
            </div>

            <div className="w-full space-y-4" aria-live="polite">
              {(rec.interim || heard) && (
                <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                  <span className="slug mr-2">You</span>
                  {rec.interim || heard}
                </p>
              )}
              {replyText && (
                <p className="mx-auto max-h-40 max-w-xl overflow-y-auto font-display text-2xl leading-snug text-foreground">
                  {replyText}
                  {lastReply?.status === "streaming" && <span className="jai-caret" aria-hidden />}
                </p>
              )}
              {hasCards && (
                <p className="font-mono text-[11px] text-muted-foreground">Live details and sources are in the text chat.</p>
              )}
              {(rec.error || lastReply?.status === "error") && (
                <p className="mx-auto flex max-w-md items-start justify-center gap-2 text-sm text-foreground" role="alert">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
                  {rec.error ?? lastReply?.error}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full max-w-md flex-col items-center gap-4">
            {!canListen && (
              <form onSubmit={onType} className="flex w-full items-center gap-2 border border-input bg-background px-2 py-1.5 focus-within:border-primary">
                <label htmlFor="jai-voice-input" className="sr-only">
                  Message J.AI
                </label>
                <input
                  id="jai-voice-input"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder="Voice input isn't supported here, so type"
                  className="h-9 flex-1 bg-transparent px-1 text-[15px] focus:outline-none"
                />
                <button type="submit" aria-label="Send" className="inline-flex h-9 w-9 items-center justify-center bg-primary text-primary-foreground">
                  <ArrowUp className="h-4 w-4" />
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                className={control}
                onClick={() => {
                  if (!muted) speaker.cancel();
                  setMuted((m) => !m);
                }}
                aria-pressed={muted}
                aria-label={muted ? "Unmute J.AI's voice" : "Mute J.AI's voice"}
                title={muted ? "Unmute voice" : "Mute voice"}
                disabled={!speaker.supported}
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <button
                type="button"
                className={control}
                onClick={() => (speech.status === "paused" ? speaker.resume() : speaker.pause())}
                disabled={phase !== "speaking"}
                aria-label={speech.status === "paused" ? "Resume speaking" : "Pause speaking"}
              >
                {speech.status === "paused" ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </button>

              {canListen && (
                <button
                  type="button"
                  onClick={onMic}
                  aria-label={rec.listening ? "Stop listening" : phase === "idle" ? "Start talking" : "Interrupt and talk"}
                  className={cn(
                    "inline-flex h-16 w-16 items-center justify-center rounded-full transition-all",
                    rec.listening
                      ? "bg-primary text-primary-foreground shadow-[0_0_0_6px_hsl(var(--primary)/0.2),0_0_28px_hsl(var(--primary)/0.5)]"
                      : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
                  )}
                >
                  {rec.listening ? <Square className="h-5 w-5 fill-current" /> : <Mic className="h-6 w-6" />}
                </button>
              )}

              <button
                type="button"
                className={control}
                onClick={() => {
                  chat.stop();
                  speaker.cancel();
                }}
                disabled={phase !== "speaking" && phase !== "thinking"}
                aria-label="Stop the reply"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
              <Dialog.Close className={control} aria-label="Back to text chat" title="Back to text chat">
                <Keyboard className="h-5 w-5" />
              </Dialog.Close>
            </div>
            <p className="font-mono text-[10.5px] text-muted-foreground">
              {canListen ? "Uses your browser's speech recognition · Esc to exit" : "Esc to exit"}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default VoiceMode;
