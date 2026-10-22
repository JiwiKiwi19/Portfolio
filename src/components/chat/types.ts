// Mirrors the NDJSON events and cards sent by supabase/functions/chat.

export type WeatherCard = {
  kind: "weather";
  location: string;
  timezone: string;
  localTime: string;
  retrievedAt: string;
  current: {
    tempC: number;
    feelsLikeC: number;
    humidityPct: number;
    precipMm: number;
    windKmh: number;
    conditions: string;
    code: number;
    isDay: boolean;
  };
  forecast: {
    date: string;
    conditions: string;
    code: number;
    highC: number;
    lowC: number;
    precipChancePct: number | null;
  }[];
  source: { name: string; url: string };
};

export type NewsCard = {
  kind: "news";
  topic: string;
  retrievedAt: string;
  items: { title: string; link: string; source: string; published: string | null }[];
};

export type GithubCard = {
  kind: "github";
  profile: string;
  retrievedAt: string;
  repos: { name: string; description: string | null; language: string | null; stars: number; updated: string; url: string }[];
};

export type ToolCard = WeatherCard | NewsCard | GithubCard;

export type ToolStatus = { id: string; name: string; label: string; state: "start" | "done" | "error" };

export type StreamEvent =
  | { t: "text"; v: string }
  | ({ t: "tool" } & ToolStatus)
  | { t: "card"; id: string; card: ToolCard }
  | { t: "done" }
  | { t: "error"; code: string; message: string };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  tools?: ToolStatus[];
  cards?: { id: string; card: ToolCard }[];
  status?: "streaming" | "done" | "stopped" | "error";
  error?: string;
};
