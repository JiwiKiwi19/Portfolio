// Live-data tools for the portfolio assistant. All sources are free and keyless:
//   weather → Open-Meteo (geocoding + forecast)
//   news    → public RSS feeds + Google News RSS search
//   github  → GitHub REST API (optional GITHUB_TOKEN raises the rate limit)
// Each tool returns { forModel, card }: compact JSON for the model, and a card the UI renders as-is,
// so links and numbers on screen come straight from the source, not from the model.

import { z } from "npm:zod@3.25.76";

const UA = "Mozilla/5.0 (compatible; JiwonPortfolioAssistant/1.0; +https://www.jiwon.tech)";
const TIMEOUT_MS = 8000;

export class ToolError extends Error {}

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { "User-Agent": UA, ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new ToolError(`${new URL(url).hostname} responded ${res.status}`);
  return res;
}

// Small in-memory cache per isolate so repeated questions don't hammer upstream APIs.
const cache = new Map<string, { at: number; value: unknown }>();
async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as T;
  const value = await load();
  cache.set(key, { at: Date.now(), value });
  if (cache.size > 200) cache.delete(cache.keys().next().value!);
  return value;
}

// ---------------------------------------------------------------- weather

const WMO: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Freezing fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle", 56: "Freezing drizzle", 57: "Freezing drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 66: "Freezing rain", 67: "Freezing rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Rain showers", 81: "Rain showers", 82: "Violent rain showers",
  85: "Snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with hail",
};
const describe = (code: number) => WMO[code] ?? "Unknown conditions";

type GeoResult = {
  name: string; latitude: number; longitude: number; country?: string; country_code?: string;
  admin1?: string; timezone?: string; population?: number;
};

async function geocode(location: string): Promise<GeoResult | null> {
  const search = async (name: string) => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?count=10&language=en&format=json&name=${encodeURIComponent(name)}`;
    const data = await (await fetchWithTimeout(url)).json();
    return (data.results ?? []) as GeoResult[];
  };

  // Open-Meteo matches place names only, so "Toronto, ON" or "Seoul, Korea" needs splitting:
  // search the first part, then prefer a result whose region/country matches the rest.
  const [place, ...qualifiers] = location.split(",").map((s) => s.trim()).filter(Boolean);
  if (!place) return null;
  let results = await search(location.trim());
  if (!results.length && qualifiers.length) results = await search(place);
  if (!results.length) return null;

  const hint = qualifiers.join(" ").toLowerCase();
  if (hint) {
    const match = results.find((r) =>
      [r.admin1, r.country, r.country_code].some((v) => {
        const value = v?.toLowerCase();
        return value && (hint.includes(value) || value.includes(hint));
      }),
    );
    if (match) return match;
  }
  // Otherwise the most populous match ("Paris" → France, not Texas).
  return [...results].sort((a, b) => (b.population ?? 0) - (a.population ?? 0))[0];
}

export const WeatherInput = z.object({
  location: z.string().min(1).max(100),
  days: z.number().int().min(1).max(7).optional(),
});

export async function getWeather(input: z.infer<typeof WeatherInput>) {
  const days = input.days ?? 3;
  const place = await cached(`geo:${input.location.toLowerCase()}`, 24 * 3600_000, () => geocode(input.location));
  if (!place) {
    return {
      forModel: { error: `No place found matching "${input.location}". Ask the visitor to clarify the city.` },
      card: null,
    };
  }

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum` +
    `&timezone=auto&forecast_days=${days}`;
  const data = await cached(`wx:${place.latitude},${place.longitude},${days}`, 10 * 60_000, async () =>
    (await fetchWithTimeout(url)).json()
  );

  const label = [...new Set([place.name, place.admin1, place.country].filter(Boolean))].join(", ");
  const current = data.current;
  const retrievedAt = new Date().toISOString();
  const forecast = (data.daily?.time ?? []).map((date: string, i: number) => ({
    date,
    conditions: describe(data.daily.weather_code[i]),
    code: data.daily.weather_code[i],
    highC: data.daily.temperature_2m_max[i],
    lowC: data.daily.temperature_2m_min[i],
    precipChancePct: data.daily.precipitation_probability_max?.[i] ?? null,
    precipMm: data.daily.precipitation_sum?.[i] ?? null,
  }));

  const card = {
    kind: "weather" as const,
    location: label,
    timezone: data.timezone as string,
    localTime: current.time as string,
    retrievedAt,
    current: {
      tempC: current.temperature_2m as number,
      feelsLikeC: current.apparent_temperature as number,
      humidityPct: current.relative_humidity_2m as number,
      precipMm: current.precipitation as number,
      windKmh: current.wind_speed_10m as number,
      conditions: describe(current.weather_code),
      code: current.weather_code as number,
      isDay: current.is_day === 1,
    },
    forecast,
    source: { name: "Open-Meteo", url: "https://open-meteo.com/" },
  };
  return { forModel: { ...card, units: "°C, km/h, mm" }, card };
}

// ---------------------------------------------------------------- news

type Headline = { title: string; link: string; source: string; published: string | null };

function decodeEntities(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .trim();
}

function tag(xml: string, name: string) {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decodeEntities(m[1]) : "";
}

function parseFeed(xml: string, fallbackSource: string): Headline[] {
  // RSS <item> or Atom <entry>
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  return blocks.map((b) => {
    let link = tag(b, "link");
    if (!link) link = b.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? "";
    const date = tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date");
    const parsed = date ? new Date(date) : null;
    let title = tag(b, "title");
    const source = tag(b, "source") || fallbackSource;
    // Google News titles end with " - Publisher"
    if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3));
    return {
      title,
      link: link.trim(),
      source,
      published: parsed && !isNaN(parsed.getTime()) ? parsed.toISOString() : null,
    };
  }).filter((h) => h.title && /^https?:\/\//.test(h.link));
}

const TOPIC_FEEDS: Record<string, { url: string; source: string }[]> = {
  ai: [
    { url: "https://www.technologyreview.com/topic/artificial-intelligence/feed", source: "MIT Technology Review" },
    { url: "https://techcrunch.com/category/artificial-intelligence/feed/", source: "TechCrunch" },
    { url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", source: "The Verge" },
  ],
  technology: [
    { url: "https://www.theverge.com/rss/index.xml", source: "The Verge" },
    { url: "https://feeds.arstechnica.com/arstechnica/technology-lab", source: "Ars Technica" },
    { url: "https://techcrunch.com/feed/", source: "TechCrunch" },
  ],
  software: [
    { url: "https://hnrss.org/frontpage", source: "Hacker News" },
    { url: "https://github.blog/feed/", source: "The GitHub Blog" },
    { url: "https://feed.infoq.com/", source: "InfoQ" },
  ],
};

const googleNews = (q: string) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(`${q} when:7d`)}&hl=en-US&gl=US&ceid=US:en`;

export const NewsInput = z.object({
  topic: z.enum(["ai", "technology", "software", "search"]),
  query: z.string().max(120).optional(),
});

export async function getNews(input: z.infer<typeof NewsInput>) {
  const q = input.query?.trim();
  const feeds = input.topic === "search" || !TOPIC_FEEDS[input.topic]
    ? [{ url: googleNews(q || "technology"), source: "Google News" }]
    : TOPIC_FEEDS[input.topic];

  const items = await cached(`news:${input.topic}:${q ?? ""}`, 5 * 60_000, async () => {
    const results = await Promise.allSettled(
      feeds.map(async (f) => parseFeed(await (await fetchWithTimeout(f.url)).text(), f.source).slice(0, 8)),
    );
    let all = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
    // A topic search with extra keywords: fall back to Google News if the curated feeds came back empty.
    if (!all.length && feeds[0].source !== "Google News") {
      all = parseFeed(await (await fetchWithTimeout(googleNews(q || input.topic))).text(), "Google News");
    }
    if (!all.length) throw new ToolError("All news sources were unavailable");
    const seen = new Set<string>();
    return all
      .filter((h) => !seen.has(h.title.toLowerCase()) && seen.add(h.title.toLowerCase()))
      .sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""))
      .slice(0, 6);
  });

  const retrievedAt = new Date().toISOString();
  const card = { kind: "news" as const, topic: q || input.topic, retrievedAt, items };
  return { forModel: card, card };
}

// ---------------------------------------------------------------- github

export const GithubInput = z.object({});

export async function getGithubRepos() {
  const token = Deno.env.get("GITHUB_TOKEN");
  const repos = await cached("gh:repos", 15 * 60_000, async () => {
    const res = await fetchWithTimeout(
      "https://api.github.com/users/JiwiKiwi19/repos?sort=pushed&per_page=30&type=owner",
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );
    const data = await res.json();
    return (data as Array<Record<string, unknown>>)
      .filter((r) => !r.fork && !r.private)
      .slice(0, 12)
      .map((r) => ({
        name: r.name as string,
        description: (r.description as string | null) ?? null,
        language: (r.language as string | null) ?? null,
        stars: r.stargazers_count as number,
        updated: r.pushed_at as string,
        url: r.html_url as string,
      }));
  });
  const card = {
    kind: "github" as const,
    profile: "https://github.com/JiwiKiwi19",
    retrievedAt: new Date().toISOString(),
    repos,
  };
  return { forModel: card, card };
}

// ---------------------------------------------------------------- registry

export type ToolCard =
  | Awaited<ReturnType<typeof getWeather>>["card"]
  | Awaited<ReturnType<typeof getNews>>["card"]
  | Awaited<ReturnType<typeof getGithubRepos>>["card"];

export const TOOLS = {
  get_weather: {
    schema: WeatherInput,
    run: getWeather,
    status: (i: z.infer<typeof WeatherInput>) => `Checking the weather in ${i.location}`,
    definition: {
      name: "get_weather",
      description:
        "Get live current conditions and a daily forecast (up to 7 days) for a city, from Open-Meteo. Use for any question about current or upcoming weather. Only call it when the visitor has named a place; otherwise ask them which city.",
      input_schema: {
        type: "object" as const,
        properties: {
          location: { type: "string", description: "City, optionally with region/country, e.g. 'Seoul' or 'London, Ontario'" },
          days: { type: "integer", minimum: 1, maximum: 7, description: "Forecast days including today (default 3)" },
        },
        required: ["location"],
        additionalProperties: false,
      },
    },
  },
  get_news: {
    schema: NewsInput,
    run: getNews,
    status: (i: z.infer<typeof NewsInput>) => `Pulling the latest ${i.query || (i.topic === "ai" ? "AI" : i.topic)} headlines`,
    definition: {
      name: "get_news",
      description:
        "Fetch current headlines (title, publisher, link, publish time) from live news feeds. topic 'ai' = AI/ML news, 'technology' = general tech, 'software' = software engineering/dev news, 'search' = search Google News for `query` (any subject, last 7 days).",
      input_schema: {
        type: "object" as const,
        properties: {
          topic: { type: "string", enum: ["ai", "technology", "software", "search"] },
          query: { type: "string", description: "Search terms; required when topic is 'search'" },
        },
        required: ["topic"],
        additionalProperties: false,
      },
    },
  },
  get_github_repos: {
    schema: GithubInput,
    run: (_: unknown) => getGithubRepos(),
    status: () => "Opening Jiwon's GitHub",
    definition: {
      name: "get_github_repos",
      description:
        "List Jiwon's public GitHub repositories (github.com/JiwiKiwi19), most recently pushed first, with description, language, stars and last push date.",
      input_schema: { type: "object" as const, properties: {}, additionalProperties: false },
    },
  },
} as const;

export type ToolName = keyof typeof TOOLS;
