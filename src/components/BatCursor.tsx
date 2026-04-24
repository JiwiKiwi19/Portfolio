import React, { useEffect, useState, useRef, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

const BatCursor = () => {
  const [curPosition, setCurPosition] = useState<Position>({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : -100,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : -100,
  });
  const [rotation, setRotation] = useState(0);
  const [isSwinging, setIsSwinging] = useState(false);

  const lastClientPos = useRef<Position>(curPosition);
  const lastUpdateTime = useRef<number>(0);

  const updateTarget = useCallback((event: MouseEvent | PointerEvent) => {
    const now = performance.now();

    // High-frequency updates for "locked" feel (approx 120fps)
    if (now - lastUpdateTime.current < 8) return;
    lastUpdateTime.current = now;

    const x = event.clientX;
    const y = event.clientY;

    // Calculate movement direction
    const dx = x - lastClientPos.current.x;
    const dy = y - lastClientPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      // +90 offset because the SVG is drawn horizontally (handle left, barrel right)
      // This makes the barrel "point" in the direction of movement
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      setRotation(angle + 90);
    }

    setCurPosition({ x, y });
    lastClientPos.current = { x, y };
  }, []);

  const handleClick = useCallback(() => {
    setIsSwinging(true);
    // Standard swing duration
    setTimeout(() => setIsSwinging(false), 300);
  }, []);

  useEffect(() => {
    // Note: Native cursor is NOT hidden here as per your request
    window.addEventListener("pointermove", updateTarget, { passive: true });
    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("pointermove", updateTarget);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [updateTarget, handleClick]);

  return (
    <div
      className="fixed pointer-events-none z-[9999] top-0 left-0 will-change-transform"
      style={{
        // Use translate3d for the smoothest possible hardware-accelerated movement
        transform: `translate3d(${curPosition.x}px, ${curPosition.y}px, 0) rotate(${rotation}deg)`,
      }}
    >
      <div
        className={isSwinging ? "bat-swing" : ""}
        style={{ transformOrigin: "0px 0px" }}
      >
        <svg
          width="100"
          height="34"
          viewBox="0 0 200 64"
          fill="none"
          className="drop-shadow-md"
          style={{
            display: "block",
            // KEY ADJUSTMENT:
            // -130px moves the "sweet spot" of the barrel closer to the cursor tip.
            // -32px centers the bat vertically on the cursor tip.
            transform: "translate(-130px, -32px)",
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
          <rect x="22" y="28" width="22" height="8" fill="url(#grip)" rx="1" />
        </svg>
      </div>

      <style>{`
        @keyframes bat-swing {
          0%   { transform: rotate(0deg); }
          30%  { transform: rotate(-45deg) scale(1.1); }
          100% { transform: rotate(0deg); }
        }
        .bat-swing {
          animation: bat-swing 0.3s cubic-bezier(0.2, 0, 0.2, 1) forwards;
          /* Pivot the swing around the mouse tip for accuracy */
          transform-origin: 0px 0px;
        }
      `}</style>
    </div>
  );
};

export default BatCursor;
