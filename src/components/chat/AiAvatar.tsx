import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export type AvatarState = "idle" | "thinking" | "speaking" | "listening";

// J.AI's identity: a night tile from the skyline whose lit windows spell a "J",
// with the CN Tower's aviation beacon in the corner. Deliberately not a face or a photo,
// so it reads as an AI, not as Jiwon. The tile stays dark in both themes; the ring carries the city light.
const WINDOWS: [number, number, boolean][] = [];
const PATTERN = ["111", "001", "101", "011"];
PATTERN.forEach((row, r) =>
  [...row].forEach((on, c) => WINDOWS.push([10 + c * 7.5, 8 + r * 7, on === "1"])),
);

interface AiAvatarProps {
  size?: number;
  state?: AvatarState;
  className?: string;
}

const AiAvatar = forwardRef<HTMLSpanElement, AiAvatarProps>(({ size = 36, state = "idle", className }, ref) => {
  const gradientId = `jai-sky-${useId().replace(/:/g, "")}`;
  return (
    <span ref={ref} data-state={state} className={cn("jai-avatar", className)} aria-hidden>
      <svg viewBox="0 0 40 40" width={size - 4} height={size - 4}>
        <rect width="40" height="40" fill="hsl(var(--jai-tile))" />
        <rect width="40" height="40" fill={`url(#${gradientId})`} opacity="0.5" />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(var(--city-violet))" stopOpacity="0.35" />
            <stop offset="1" stopColor="hsl(var(--city-amber))" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        {WINDOWS.map(([x, y, on], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="5"
            height="5.5"
            className={cn("jai-win", on && "on")}
            style={{ animationDelay: `${(i % 4) * 0.12 + Math.floor(i / 3) * 0.08}s` }}
          />
        ))}
        <circle cx="33.5" cy="6" r="1.7" className="jai-beacon" />
      </svg>
    </span>
  );
});
AiAvatar.displayName = "AiAvatar";

export default AiAvatar;
