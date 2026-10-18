import { useEffect, useRef, useState } from "react";

// The SVG is drawn horizontally (handle left, barrel right) at half the viewBox
// scale, so the end of the barrel (viewBox 196,32) lands at (98px, 16px).
const TIP_X = 98;
const TIP_Y = 16;
// Tilt the bat so the barrel points up-left like a regular arrow cursor,
// with the handle trailing down-right.
const TILT = -135;

const BatCursor = () => {
  // Only show the bat for a real mouse, and only once it has moved
  // (touch devices never fire hover-style pointer moves, so it would sit mid-screen).
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSwinging, setIsSwinging] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHasFinePointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!hasFinePointer) return;

    let swingTimer: number | undefined;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      lastPos.current = { x: event.clientX, y: event.clientY };
      // Write straight to the DOM so the bat never lags or skips the final position.
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
      setIsActive(true);
    };
    const hide = () => setIsActive(false);
    const swing = () => {
      setIsSwinging(true);
      window.clearTimeout(swingTimer);
      swingTimer = window.setTimeout(() => setIsSwinging(false), 300);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    window.addEventListener("mousedown", swing);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      window.clearTimeout(swingTimer);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("mousedown", swing);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, [hasFinePointer]);

  // Hide the native cursor everywhere (links, buttons, inputs included) while the bat is shown.
  useEffect(() => {
    if (!hasFinePointer || !isActive) return;
    document.documentElement.classList.add("bat-cursor-active");
    return () => document.documentElement.classList.remove("bat-cursor-active");
  }, [hasFinePointer, isActive]);

  if (!hasFinePointer || !isActive) return null;

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
      style={{
        transform: `translate3d(${lastPos.current.x}px, ${lastPos.current.y}px, 0)`,
      }}
    >
      {/* Rotation and swing both pivot on the barrel tip, which sits exactly on the pointer. */}
      <div style={{ transform: `rotate(${TILT}deg)`, transformOrigin: "0 0" }}>
        <div
          className={isSwinging ? "bat-swing" : ""}
          style={{ transformOrigin: "0 0" }}
        >
          <svg
            width="100"
            height="34"
            viewBox="0 0 200 64"
            fill="none"
            className="drop-shadow-md"
            style={{
              display: "block",
              transform: `translate(${-TIP_X}px, ${-TIP_Y}px)`,
            }}
          >
            <defs>
              <linearGradient id="batWood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d8a86a" />
                <stop offset="45%" stopColor="#b67a3a" />
                <stop offset="100%" stopColor="#7a4a1c" />
              </linearGradient>
              <linearGradient id="grip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#000" />
              </linearGradient>
              <linearGradient id="batShine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffe7be" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffe7be" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Bat Main Body */}
            <path
              d="M 8 32 C 8 22, 22 22, 22 32 C 22 42, 8 42, 8 32 Z M 22 30 L 50 29 C 70 28, 95 26, 130 22 C 160 19, 180 16, 192 22 C 196 25, 196 39, 192 42 C 180 48, 160 45, 130 42 C 95 38, 70 36, 50 35 L 22 34 Z"
              fill="url(#batWood)"
              stroke="#3b2410"
              strokeWidth="1.2"
            />

            {/* Shine Detail */}
            <path
              d="M 55 27 C 90 23, 140 19, 188 22"
              stroke="url(#batShine)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Grip Detail */}
            <rect
              x="22"
              y="28"
              width="22"
              height="8"
              fill="url(#grip)"
              rx="1"
            />
          </svg>
        </div>
      </div>

      <style>{`
        html.bat-cursor-active,
        html.bat-cursor-active * {
          cursor: none !important;
        }
        @keyframes bat-swing {
          0%   { transform: rotate(0deg); }
          30%  { transform: rotate(-30deg) scale(1.1); }
          100% { transform: rotate(0deg); }
        }
        .bat-swing {
          animation: bat-swing 0.3s cubic-bezier(0.2, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default BatCursor;
