import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// Browser-native speech: Web Speech API for both directions. No audio leaves the browser
// through this site's servers (Chrome's recognizer does use Google's speech service).

// ---------------------------------------------------------------- text → speech

type SpeakerState = { status: "idle" | "speaking" | "paused"; owner: string | null };

/** Turns Markdown into something pleasant to hear. */
export function toSpeakable(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " (code shown on screen) ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "the link on screen")
    .replace(/[*_#>]+/g, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const lang = (navigator.language || "en-US").toLowerCase();
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = english.length ? english : voices;
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|premium|enhanced/i.test(v.name) ? 8 : 0) +
    (/google|samantha|ava|allison|daniel|serena|aria|jenny|guy/i.test(v.name) ? 4 : 0) +
    (v.lang.toLowerCase() === lang ? 2 : 0) +
    (v.localService ? 1 : 0);
  return [...pool].sort((a, b) => score(b) - score(a))[0] ?? null;
}

class Speaker {
  readonly supported = typeof window !== "undefined" && "speechSynthesis" in window;
  private state: SpeakerState = { status: "idle", owner: null };
  private listeners = new Set<() => void>();
  private pending = ""; // streamed text not yet spoken (incomplete sentence)
  private queued = 0;
  private streaming = false;
  private idleCallbacks: (() => void)[] = [];
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (!this.supported) return;
    const load = () => (this.voice = pickVoice());
    load();
    window.speechSynthesis.addEventListener?.("voiceschanged", load);
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  getState = () => this.state;

  private set(next: SpeakerState) {
    this.state = next;
    this.listeners.forEach((fn) => fn());
  }

  private utter(text: string) {
    const clean = toSpeakable(text);
    if (!clean) return;
    const u = new SpeechSynthesisUtterance(clean);
    if (this.voice) u.voice = this.voice;
    u.rate = 1.02;
    u.onend = u.onerror = () => {
      this.queued = Math.max(0, this.queued - 1);
      this.maybeIdle();
    };
    this.queued++;
    window.speechSynthesis.speak(u);
    if (this.state.status === "idle") this.set({ ...this.state, status: "speaking" });
  }

  private maybeIdle() {
    if (this.queued > 0 || this.streaming) return;
    this.set({ status: "idle", owner: null });
    const callbacks = this.idleCallbacks;
    this.idleCallbacks = [];
    callbacks.forEach((fn) => fn());
  }

  /** Speak a whole message (e.g. "Listen" on a past reply). Stops anything already playing. */
  speak(owner: string, text: string, onIdle?: () => void) {
    if (!this.supported) return;
    this.cancel();
    this.set({ status: "speaking", owner });
    if (onIdle) this.idleCallbacks.push(onIdle);
    // Chrome cuts off utterances longer than ~15s, so speak sentence by sentence.
    for (const sentence of splitSentences(text)) this.utter(sentence);
    this.maybeIdle();
  }

  /** Start speaking a reply as it streams in. */
  begin(owner: string) {
    if (!this.supported) return;
    this.cancel();
    this.streaming = true;
    this.pending = "";
    this.set({ status: "speaking", owner });
  }

  push(delta: string) {
    if (!this.streaming) return;
    this.pending += delta;
    const parts = splitSentences(this.pending, false);
    this.pending = parts.pop() ?? "";
    parts.forEach((s) => this.utter(s));
  }

  end(onIdle?: () => void) {
    if (onIdle) this.idleCallbacks.push(onIdle);
    if (!this.streaming) return this.maybeIdle();
    this.streaming = false;
    if (this.pending.trim()) this.utter(this.pending);
    this.pending = "";
    this.maybeIdle();
  }

  pause() {
    if (this.state.status !== "speaking") return;
    window.speechSynthesis.pause();
    this.set({ ...this.state, status: "paused" });
  }

  resume() {
    if (this.state.status !== "paused") return;
    window.speechSynthesis.resume();
    this.set({ ...this.state, status: "speaking" });
  }

  cancel() {
    if (!this.supported) return;
    this.streaming = false;
    this.pending = "";
    this.queued = 0;
    this.idleCallbacks = [];
    window.speechSynthesis.cancel();
    // Safari keeps a paused synth paused after cancel().
    window.speechSynthesis.resume();
    if (this.state.status !== "idle") this.set({ status: "idle", owner: null });
  }
}

/**
 * Splits text into sentences. With `final` false, the last element is the unfinished remainder.
 * Short fragments are merged so the voice doesn't stutter between tiny utterances.
 */
function splitSentences(text: string, final = true) {
  const out: string[] = [];
  // Sentence ends: punctuation followed by whitespace (so "78.4%" and "v1.2" stay intact), or a line break.
  const boundary = /[.!?]+["')\]]*(?=\s)|\n+/g;
  let start = 0;
  let current = "";
  let m: RegExpExecArray | null;
  while ((m = boundary.exec(text))) {
    const end = m.index + m[0].length;
    current += text.slice(start, end);
    start = end;
    if (current.trim().length > 40) {
      out.push(current.trim());
      current = "";
    }
  }
  const rest = current + text.slice(start);
  if (final) {
    if (rest.trim()) out.push(rest.trim());
  } else {
    out.push(rest);
  }
  return out;
}

export const speaker = new Speaker();

export function useSpeaker() {
  return useSyncExternalStore(speaker.subscribe, speaker.getState, speaker.getState);
}

// ---------------------------------------------------------------- speech → text

type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as (new () => RecognitionLike) | null;
}

export const recognitionSupported = () => getRecognitionCtor() !== null;

const RECOGNITION_ERRORS: Record<string, string> = {
  "not-allowed": "Microphone access was blocked. Allow it in your browser's site settings, or type instead.",
  "service-not-allowed": "Speech recognition isn't allowed in this browser. You can type instead.",
  "audio-capture": "No microphone was found.",
  network: "Speech recognition needs a network connection. Try again or type instead.",
  "no-speech": "I didn't catch anything. Tap the mic and try again.",
};

export function useSpeechRecognition(onFinal: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<RecognitionLike | null>(null);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  const stop = useCallback(() => recRef.current?.stop(), []);
  const abort = useCallback(() => {
    const rec = recRef.current;
    recRef.current = null;
    if (rec) {
      rec.onend = rec.onresult = rec.onerror = null;
      rec.abort();
    }
    setListening(false);
    setInterim("");
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError("Voice input isn't supported in this browser. Try Chrome, Edge, or Safari, or type instead.");
      return;
    }
    abort();
    const rec = new Ctor();
    rec.lang = navigator.language || "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    let finalText = "";
    rec.onresult = (e) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else live += result[0].transcript;
      }
      setInterim((finalText + " " + live).trim());
    };
    rec.onerror = (e) => {
      if (e.error !== "aborted") setError(RECOGNITION_ERRORS[e.error] ?? "Voice input stopped unexpectedly. Try again.");
    };
    rec.onend = () => {
      recRef.current = null;
      setListening(false);
      setInterim("");
      if (finalText.trim()) onFinalRef.current(finalText.trim());
    };
    recRef.current = rec;
    setError(null);
    setInterim("");
    try {
      rec.start();
      setListening(true);
    } catch {
      setError("Couldn't start the microphone. Try again.");
    }
  }, [abort]);

  useEffect(() => abort, [abort]);

  return { listening, interim, error, setError, start, stop, abort };
}

// ---------------------------------------------------------------- mic level (visualizer only)

/** Writes the microphone's loudness (0–1) to `onLevel` while active. Best effort: silently no-ops if denied. */
export function useMicLevel(active: boolean, onLevel: (level: number) => void) {
  const onLevelRef = useRef(onLevel);
  onLevelRef.current = onLevel;

  useEffect(() => {
    if (!active || !navigator.mediaDevices?.getUserMedia) return;
    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    let ctx: AudioContext | null = null;

    navigator.mediaDevices
      .getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      .then((s) => {
        if (cancelled) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        ctx.createMediaStreamSource(s).connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (const v of data) sum += ((v - 128) / 128) ** 2;
          onLevelRef.current(Math.min(1, Math.sqrt(sum / data.length) * 4));
          raf = requestAnimationFrame(tick);
        };
        tick();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      void ctx?.close();
      onLevelRef.current(0);
    };
  }, [active]);
}
