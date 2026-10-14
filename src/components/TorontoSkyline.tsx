// Hand-drawn Toronto waterfront at night: financial district, CN Tower,
// Rogers Centre dome, and their reflection on Lake Ontario.
// viewBox units — ground (shoreline) sits at y = 250, lake fills to 320.

type Cap = "flat" | "slant" | "step" | "antenna" | "spire";
type Building = { x: number; w: number; h: number; cap?: Cap };

const GROUND = 250;

const FAR: Building[] = [
  { x: 20, w: 70, h: 90 },
  { x: 110, w: 60, h: 130 },
  { x: 200, w: 80, h: 100 },
  { x: 300, w: 60, h: 150 },
  { x: 380, w: 90, h: 115 },
  { x: 490, w: 70, h: 140 },
  { x: 560, w: 90, h: 95 },
  { x: 840, w: 70, h: 175 },
  { x: 930, w: 60, h: 190 },
  { x: 1010, w: 80, h: 180 },
  { x: 1110, w: 70, h: 200 },
  { x: 1200, w: 90, h: 150 },
  { x: 1310, w: 70, h: 130 },
  { x: 1380, w: 60, h: 110 },
];

const NEAR: Building[] = [
  { x: 0, w: 40, h: 58 },
  { x: 44, w: 30, h: 82 },
  { x: 78, w: 50, h: 54 },
  { x: 132, w: 36, h: 104, cap: "step" },
  { x: 172, w: 54, h: 74 },
  { x: 230, w: 32, h: 120, cap: "slant" },
  { x: 266, w: 48, h: 92 },
  { x: 318, w: 28, h: 136, cap: "antenna" },
  { x: 350, w: 52, h: 110 },
  { x: 406, w: 36, h: 128, cap: "step" },
  { x: 446, w: 56, h: 84 },
  { x: 506, w: 40, h: 100 },
  { x: 550, w: 56, h: 62 },
  { x: 812, w: 40, h: 96 },
  { x: 856, w: 34, h: 132, cap: "slant" },
  { x: 894, w: 54, h: 150 },
  { x: 952, w: 38, h: 166, cap: "antenna" },
  { x: 994, w: 60, h: 138, cap: "step" },
  { x: 1058, w: 34, h: 158 },
  { x: 1096, w: 50, h: 146, cap: "spire" },
  { x: 1150, w: 42, h: 118 },
  { x: 1196, w: 58, h: 100, cap: "slant" },
  { x: 1258, w: 36, h: 126 },
  { x: 1298, w: 52, h: 86 },
  { x: 1354, w: 40, h: 104, cap: "step" },
  { x: 1398, w: 42, h: 66 },
];

function buildingPath({ x, w, h, cap = "flat" }: Building) {
  const top = GROUND - h;
  const r = x + w;
  switch (cap) {
    case "slant":
      return `M${x} ${GROUND}V${top + 14}L${r} ${top}V${GROUND}Z`;
    case "step":
      return `M${x} ${GROUND}V${top + 12}H${x + w * 0.2}V${top}H${r - w * 0.2}V${top + 12}H${r}V${GROUND}Z`;
    case "spire": {
      const mid = x + w / 2;
      return `M${x} ${GROUND}V${top}H${mid - 4}L${mid} ${top - 24}L${mid + 4} ${top}H${r}V${GROUND}Z`;
    }
    default:
      return `M${x} ${GROUND}V${top}H${r}V${GROUND}Z`;
  }
}

// Small seeded PRNG so the lit windows are identical on every render and visit.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Light = { x: number; y: number; cool: boolean; flicker?: number };

const WINDOWS: Light[] = (() => {
  const rand = mulberry32(416);
  const lights: Light[] = [];
  for (const b of NEAR) {
    const top = GROUND - b.h + (b.cap === "slant" || b.cap === "step" ? 18 : 8);
    for (let wy = top; wy < GROUND - 8; wy += 9) {
      for (let wx = b.x + 5; wx + 3 <= b.x + b.w - 4; wx += 7) {
        const roll = rand();
        if (roll > 0.2) continue;
        const cool = rand() < 0.22;
        lights.push({
          x: wx,
          y: wy,
          cool,
          flicker: rand() < 0.07 ? Math.round(rand() * 9000) : undefined,
        });
      }
    }
  }
  return lights;
})();

const SHORE_LIGHTS: number[] = (() => {
  const rand = mulberry32(1793);
  return Array.from({ length: 70 }, () => Math.round(rand() * 1440));
})();

// Colors come from --sky-* tokens in index.css, so the same drawing re-lights
// for Day and Night without swapping assets or shifting layout.
const v = (name: string) => `var(--sky-${name})`;

const TorontoSkyline = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 1440 320"
    preserveAspectRatio="xMidYMax slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="tor-haze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" style={{ stopColor: v("haze-mid"), stopOpacity: 0 }} />
        <stop offset="78%" style={{ stopColor: v("haze-mid") }} />
        <stop offset="100%" style={{ stopColor: v("haze-end") }} />
      </linearGradient>
      <radialGradient id="tor-glow" cx="0.56" cy="0.8" r="0.55">
        <stop offset="0%" style={{ stopColor: v("glow-1") }} />
        <stop offset="60%" style={{ stopColor: v("glow-2") }} />
        <stop offset="100%" style={{ stopColor: v("glow-2"), stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="tor-sun-glow">
        <stop offset="0%" stopColor="hsl(42 100% 62%)" stopOpacity="0.55" />
        <stop offset="100%" stopColor="hsl(42 100% 62%)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="tor-moon-glow">
        <stop offset="0%" stopColor="hsl(220 80% 90%)" stopOpacity="0.35" />
        <stop offset="100%" stopColor="hsl(220 80% 90%)" stopOpacity="0" />
      </radialGradient>
      <mask id="tor-moon-mask">
        <rect x="660" y="10" width="80" height="80" fill="white" />
        <circle cx="707" cy="45" r="13" fill="black" />
      </mask>
      <linearGradient id="tor-tower" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" style={{ stopColor: v("tower-edge") }} />
        <stop offset="55%" style={{ stopColor: v("tower-mid") }} />
        <stop offset="100%" style={{ stopColor: v("tower-edge") }} />
      </linearGradient>
      <linearGradient id="tor-pod-ring" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="hsl(189 94% 60%)" />
        <stop offset="100%" stopColor="hsl(288 80% 70%)" />
      </linearGradient>
      <linearGradient id="tor-lake" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" style={{ stopColor: v("lake-top") }} />
        <stop offset="100%" style={{ stopColor: v("lake-bottom") }} />
      </linearGradient>
      <linearGradient id="tor-reflect-fade" x1="0" y1="250" x2="0" y2="320" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="tor-reflect-mask" maskUnits="userSpaceOnUse" x="0" y="250" width="1440" height="70">
        <rect x="0" y="250" width="1440" height="70" fill="url(#tor-reflect-fade)" />
      </mask>
    </defs>

    {/* Sky haze + city glow */}
    <rect x="0" y="0" width="1440" height="250" fill="url(#tor-haze)" />
    <rect x="0" y="0" width="1440" height="320" fill="url(#tor-glow)" />

    {/* Sun (day) / crescent moon (night) — swap with a spring in index.css (.sky-body) */}
    <g className="sky-body sky-sun" data-theme-anim>
      <circle cx="700" cy="52" r="46" fill="url(#tor-sun-glow)" />
      <circle cx="700" cy="52" r="15" fill="hsl(44 100% 66%)" />
    </g>
    <g className="sky-body sky-moon" data-theme-anim>
      <circle cx="700" cy="52" r="36" fill="url(#tor-moon-glow)" />
      <circle cx="700" cy="52" r="12" fill="hsl(48 70% 90%)" mask="url(#tor-moon-mask)" />
    </g>

    {/* Far layer */}
    <g style={{ fill: v("far") }}>
      {FAR.map((b) => (
        <path key={`f${b.x}`} d={buildingPath(b)} />
      ))}
    </g>

    <g id="tor-skyline">
      {/* Rogers Centre */}
      <path d="M618 250V236H754V250Z" style={{ fill: v("dome-base") }} />
      <path d="M624 236C632 199 740 199 748 236Z" style={{ fill: v("dome") }} />
      <g fill="none" strokeWidth="1" style={{ stroke: v("dome-rib") }}>
        <path d="M646 236C654 210 718 210 726 236" />
        <path d="M668 236C672 214 700 214 704 236" />
        <path d="M686 205V236" />
      </g>
      <path
        d="M620 239H752"
        stroke="hsl(38 95% 66%)"
        strokeWidth="1.2"
        style={{ strokeOpacity: v("stadium-opacity") }}
      />

      {/* CN Tower */}
      <path d="M777 250L785 104H795L803 250Z" fill="url(#tor-tower)" />
      <path d="M786 90L787.5 48H792.5L794 90Z" fill="url(#tor-tower)" />
      <rect x="768" y="89" width="44" height="15" rx="7" style={{ fill: v("pod") }} />
      <rect
        x="770"
        y="96"
        width="40"
        height="1.6"
        rx="0.8"
        fill="url(#tor-pod-ring)"
        style={{ opacity: v("pod-ring-opacity") }}
      />
      <rect x="783" y="44" width="14" height="7" rx="3" style={{ fill: v("pod") }} />
      <rect x="789" y="8" width="2" height="36" style={{ fill: v("mast") }} />
      <circle className="sky-blink" cx="790" cy="7" r="2.2" fill="hsl(0 85% 62%)" />

      {/* Near layer */}
      <g style={{ fill: v("near") }}>
        {NEAR.map((b) => (
          <path key={`n${b.x}`} d={buildingPath(b)} />
        ))}
      </g>
      {NEAR.filter((b) => b.cap === "antenna").map((b) => (
        <path
          key={`a${b.x}`}
          d={`M${b.x + b.w / 2} ${GROUND - b.h}V${GROUND - b.h - 22}`}
          strokeWidth="1.5"
          style={{ stroke: v("mast") }}
        />
      ))}
      {NEAR.filter((b) => !b.cap || b.cap === "flat").map((b) => (
        <rect
          key={`r${b.x}`}
          x={b.x}
          y={GROUND - b.h}
          width={b.w}
          height="1"
          style={{ fill: v("rim") }}
        />
      ))}

      {/* Windows: lit at night, glass glints by day */}
      <g style={{ opacity: v("win-opacity") }}>
        {WINDOWS.map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width="3"
            height="4"
            rx="0.5"
            className={w.flicker !== undefined ? "window-flicker" : undefined}
            style={{
              fill: v(w.cool ? "win-cool" : "win-warm"),
              animationDelay: w.flicker !== undefined ? `${w.flicker}ms` : undefined,
            }}
          />
        ))}
      </g>
    </g>

    {/* Lake Ontario + reflection */}
    <rect x="0" y="250" width="1440" height="70" fill="url(#tor-lake)" />
    <g mask="url(#tor-reflect-mask)" style={{ opacity: v("reflect-opacity") }}>
      <use href="#tor-skyline" transform="translate(0 500) scale(1 -1)" />
    </g>
    <g strokeWidth="1" style={{ stroke: v("wave") }}>
      <path d="M140 266H420M560 274H980M1080 262H1320M260 288H620M840 296H1180" />
    </g>

    {/* Shoreline lights */}
    <path d="M0 250.5H1440" strokeWidth="1" style={{ stroke: v("rim") }} />
    <g style={{ fill: v("shore"), opacity: v("shore-opacity") }}>
      {SHORE_LIGHTS.map((x, i) => (
        <rect key={i} x={x} y="249" width="2" height="1.5" />
      ))}
    </g>
  </svg>
);

export default TorontoSkyline;
