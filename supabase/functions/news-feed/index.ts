// Aggregates real-time news from public RSS feeds (MLB + AI/ML)
// No API keys needed.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FEEDS: { url: string; topic: "MLB" | "AI"; source: string }[] = [
  // MLB
  { url: "https://www.espn.com/espn/rss/mlb/news", topic: "MLB", source: "ESPN MLB" },
  { url: "https://www.cbssports.com/rss/headlines/mlb/", topic: "MLB", source: "CBS MLB" },
  // AI / ML
  { url: "https://www.technologyreview.com/feed/", topic: "AI", source: "MIT Tech Review" },
  { url: "https://www.wired.com/feed/tag/ai/latest/rss", topic: "AI", source: "WIRED AI" },
  { url: "https://venturebeat.com/category/ai/feed/", topic: "AI", source: "VentureBeat AI" },
];

function decodeEntities(s: string) {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .trim();
}

function extractTag(item: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = item.match(re);
  return m ? decodeEntities(m[1]) : "";
}

function parseRss(xml: string) {
  const items: { title: string; link: string; pubDate: string }[] = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  const matches = xml.match(itemRegex) ?? [];
  for (const item of matches) {
    const title = extractTag(item, "title");
    const link = extractTag(item, "link");
    const pubDate = extractTag(item, "pubDate") || extractTag(item, "dc:date");
    if (title) items.push({ title, link, pubDate });
  }
  return items;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const results = await Promise.allSettled(
      FEEDS.map(async (f) => {
        const res = await fetch(f.url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; LovableNewsBot/1.0)" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`${f.source}: ${res.status}`);
        const xml = await res.text();
        return parseRss(xml).slice(0, 5).map((it) => ({
          ...it,
          topic: f.topic,
          source: f.source,
        }));
      })
    );

    const headlines = results
      .filter((r): r is PromiseFulfilledResult<any[]> => r.status === "fulfilled")
      .flatMap((r) => r.value)
      .map((h) => ({
        title: h.title,
        link: h.link,
        topic: h.topic,
        source: h.source,
        timestamp: h.pubDate ? new Date(h.pubDate).getTime() : Date.now(),
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);

    return new Response(
      JSON.stringify({ headlines, fetchedAt: Date.now() }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
        status: 200,
      }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg, headlines: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});