import React, { useEffect } from "react";

const WesternWebring = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://jacobl04.github.io/Western-Webrings/webring.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="western-webring"
      data-style="default"
      data-color="blue"
      data-show-list="true"
      data-show-random="true"
      data-random-text="[?]"
      data-arrow-prev="< Prev"
      data-arrow-next="Next >"
    ></div>
  );
};

export default WesternWebring;
