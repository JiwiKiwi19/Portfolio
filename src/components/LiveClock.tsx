import { useEffect, useState } from "react";

// Toronto local time. Ticks on its own so parents don't re-render every second.
const LiveClock = ({ seconds = true }: { seconds?: boolean }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time dateTime={now.toISOString()}>
      {now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        ...(seconds ? { second: "2-digit" } : {}),
        timeZone: "America/Toronto",
      })}
    </time>
  );
};

export default LiveClock;
