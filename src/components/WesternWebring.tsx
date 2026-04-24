import React, { useEffect } from "react";

const WesternWebring = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://jacobl04.github.io/Western-Webrings/webring.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section className="mx-auto mt-10 w-full max-w-3xl px-4">
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur-sm">
        <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-12 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative z-10 mb-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Western Webring
          </p>
        </div>

        <div
          id="western-webring"
          className="relative z-10 mx-auto flex w-full justify-center rounded-xl border border-primary/15 bg-background/70 p-4"
          data-style="default"
          data-color="blue"
          data-show-list="true"
          data-show-random="true"
          data-random-text="[?]"
          data-arrow-prev="< Prev"
          data-arrow-next="Next >"
        ></div>
      </div>
    </section>
  );
};

export default WesternWebring;
