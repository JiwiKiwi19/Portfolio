import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const RAYS = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);

// Sun ⇄ moon toggle. The theme switches immediately; the morph, pop, and glow
// burst run on top of it (see .theme-icon / .toggle-* in index.css).
const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [burst, setBurst] = useState(0);
  const transitionTimer = useRef<number>();
  const maskId = `moon-bite-${useId().replace(/:/g, "")}`;

  // The pre-paint script in index.html already set the class, so fall back to it
  // until next-themes resolves — keeps the label correct on first render.
  const isDark =
    resolvedTheme !== undefined
      ? resolvedTheme === "dark"
      : typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

  const toggle = () => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      root.classList.add("theme-transition");
      window.clearTimeout(transitionTimer.current);
      transitionTimer.current = window.setTimeout(() => root.classList.remove("theme-transition"), 500);
    }
    setTheme(isDark ? "light" : "dark");
    setBurst((n) => n + 1);
  };

  const label = isDark ? "Switch to day mode" : "Switch to night mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      data-theme-anim
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-secondary",
        className,
      )}
    >
      {burst > 0 && (
        <span
          key={`burst-${burst}`}
          aria-hidden
          data-theme-anim
          className={cn(
            "toggle-burst pointer-events-none absolute inset-0 rounded-full",
            isDark
              ? "bg-[radial-gradient(circle,hsl(48_90%_88%/0.55),transparent_70%)]"
              : "bg-[radial-gradient(circle,hsl(var(--city-amber)/0.55),transparent_70%)]",
          )}
        />
      )}
      <span key={`pop-${burst}`} data-theme-anim className={cn("inline-flex", burst > 0 && "toggle-pop")}>
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden="true"
          className="theme-icon overflow-visible"
          data-theme-anim
          style={{
            filter: isDark
              ? "drop-shadow(0 0 5px hsl(48 90% 80% / 0.45))"
              : "drop-shadow(0 0 5px hsl(38 95% 55% / 0.45))",
          }}
        >
          <defs>
            <mask id={maskId}>
              <rect x="-6" y="-6" width="36" height="36" fill="white" />
              <circle className="icon-bite" cx="17" cy="7" r="7" fill="black" data-theme-anim />
            </mask>
          </defs>
          <g className="icon-rays" fill="none" strokeWidth="2" strokeLinecap="round" data-theme-anim>
            {RAYS.map((angle) => (
              <line
                key={angle}
                x1={12 + Math.cos(angle) * 8.6}
                y1={12 + Math.sin(angle) * 8.6}
                x2={12 + Math.cos(angle) * 10.8}
                y2={12 + Math.sin(angle) * 10.8}
              />
            ))}
          </g>
          <circle className="icon-core" cx="12" cy="12" r="9" mask={`url(#${maskId})`} data-theme-anim />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;
