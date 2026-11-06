import LiveClock from "@/components/LiveClock";

const Hero = () => {
  return (
    <header
      id="top"
      className="relative overflow-hidden"
      style={{
        background: '#1b3a28',
        paddingTop: '52px',
        minHeight: '100svh',
        display: 'grid',
        gridTemplateColumns: 'clamp(240px,28vw,360px) 1fr',
      }}
    >
      {/* Subtle horizontal texture lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 44px,rgba(242,236,224,.022) 44px,rgba(242,236,224,.022) 45px)',
          zIndex: 0,
        }}
      />

      {/* LEFT: portrait */}
      <div className="relative flex flex-col" style={{ zIndex: 1 }}>
        <div
          className="portrait-frame"
          style={{ margin: '36px 0 36px 44px', flex: 1 }}
        >
          {/* Stars */}
          <span
            aria-hidden
            className="absolute text-[18px] select-none"
            style={{ top: 20, left: 20, color: 'rgba(242,236,224,.45)', zIndex: 4 }}
          >
            ✦
          </span>
          <span
            aria-hidden
            className="absolute text-[18px] select-none"
            style={{ bottom: 72, left: 16, color: 'rgba(242,236,224,.45)', zIndex: 4 }}
          >
            ✦
          </span>
          <span
            aria-hidden
            className="absolute text-[18px] select-none"
            style={{ top: 16, right: 16, color: 'rgba(242,236,224,.45)', zIndex: 4 }}
          >
            ✦
          </span>

          <img
            src="/portrait.jpg"
            alt="Jiwon Lee"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center top' }}
          />

          <div className="portrait-label">
            <span>Full-Stack Engineer</span>
            <strong>Jiwon Lee</strong>
          </div>
        </div>
      </div>

      {/* RIGHT: echo type + meta */}
      <div
        className="relative flex flex-col justify-center overflow-hidden"
        style={{ padding: '0 48px 0 36px', zIndex: 1 }}
      >
        {/* JIWON echo type */}
        <div className="echo-group" aria-label="Jiwon" style={{ position: 'relative', lineHeight: 0.82 }}>
          <span className="echo-line e-solid">JIWON</span>
          <span className="echo-line e-ghost-1" aria-hidden>JIWON</span>
          <span className="echo-line e-ghost-2" aria-hidden>JIWON</span>
        </div>

        {/* Lee + 이지원 */}
        <div
          className="flex items-baseline gap-4"
          style={{ marginTop: 'clamp(.5rem,2vw,1.2rem)' }}
        >
          <span
            className="font-display italic"
            style={{
              fontSize: 'clamp(2rem,6vw,4.5rem)',
              fontWeight: 700,
              letterSpacing: '-.02em',
              color: 'rgba(242,236,224,.55)',
            }}
          >
            Lee.
          </span>
          <span
            className="font-sans font-bold uppercase"
            style={{ fontSize: 'clamp(1rem,2.5vw,1.8rem)', letterSpacing: '.12em', color: '#c47a0a' }}
          >
            이지원
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-col" style={{ marginTop: 'clamp(1.5rem,4vw,2.5rem)', gap: 14 }}>
          {/* Location + clock */}
          <div
            className="font-sans text-[11px] font-medium uppercase tracking-[.08em]"
            style={{ color: 'rgba(242,236,224,.35)', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span>Toronto · 43.65° N 79.38° W</span>
            <span aria-hidden style={{ width: 1, height: 10, background: 'rgba(242,236,224,.15)', display: 'inline-block' }} />
            <span>
              <LiveClock seconds={false} />
            </span>
          </div>

          {/* Role */}
          <div
            className="font-sans text-[12px] font-medium uppercase tracking-[.07em]"
            style={{ color: 'rgba(242,236,224,.38)', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span
              style={{
                width: 5, height: 5,
                background: '#72c99a',
                borderRadius: '50%',
                animation: 'breathe 2.8s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            SWE Intern · INVENTIS Korea, Seoul
          </div>

          {/* Description */}
          <p
            className="font-sans font-light leading-relaxed"
            style={{
              fontSize: 14,
              lineHeight: 1.72,
              color: 'rgba(242,236,224,.5)',
              maxWidth: '42ch',
            }}
          >
            CS student at Western University building GPU simulations,
            ML pipelines, and production web apps —
            with a designer's eye for the interface.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3" style={{ marginTop: 4 }}>
            <a
              href="#projects"
              className="font-sans text-[11px] font-bold uppercase tracking-[.07em] transition-opacity hover:opacity-80"
              style={{
                background: '#c47a0a',
                color: '#142e1e',
                padding: '12px 20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                textDecoration: 'none',
                borderRadius: 2,
              }}
            >
              Selected Work
            </a>
            <a
              href="#ask"
              className="font-sans text-[11px] font-bold uppercase tracking-[.07em] transition-colors"
              style={{
                background: 'transparent',
                color: 'rgba(242,236,224,.55)',
                border: '1px solid rgba(242,236,224,.2)',
                padding: '12px 20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                textDecoration: 'none',
                borderRadius: 2,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#f2ece0';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(242,236,224,.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(242,236,224,.55)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(242,236,224,.2)';
              }}
            >
              Ask My AI →
            </a>
          </div>
        </div>
      </div>

      {/* Mobile layout override */}
      <style>{`
        @media (max-width: 768px) {
          #top { grid-template-columns: 1fr !important; }
          #top > div:first-child { min-height: 45vw; }
          #top > div:first-child > .portrait-frame { margin: 20px 20px 0 !important; height: 240px; flex: none !important; }
          #top > div:last-child { padding: 28px 24px 48px !important; }
        }
      `}</style>
    </header>
  );
};

export default Hero;
