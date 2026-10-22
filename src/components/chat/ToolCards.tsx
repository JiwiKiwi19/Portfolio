import { formatDistanceToNowStrict } from "date-fns";
import { ArrowUpRight, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Github, Moon, Star, Sun } from "lucide-react";
import type { GithubCard, NewsCard, ToolCard, WeatherCard } from "./types";

// Rendered straight from the tool data the server fetched, so every number and link on
// these cards comes from the source (Open-Meteo, the publisher's feed, GitHub), not from the model.

const ago = (iso: string | null) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (isNaN(date.getTime())) return null;
  return `${formatDistanceToNowStrict(date)} ago`;
};

const fahrenheit = (c: number) => Math.round((c * 9) / 5 + 32);

function WeatherIcon({ code, isDay = true, className }: { code: number; isDay?: boolean; className?: string }) {
  const Icon =
    code === 0 || code === 1 ? (isDay ? Sun : Moon)
    : code === 2 ? CloudSun
    : code === 45 || code === 48 ? CloudFog
    : code >= 51 && code <= 57 ? CloudDrizzle
    : (code >= 61 && code <= 67) || (code >= 80 && code <= 82) ? CloudRain
    : (code >= 71 && code <= 77) || code === 85 || code === 86 ? CloudSnow
    : code >= 95 ? CloudLightning
    : Cloud;
  return <Icon className={className} aria-hidden />;
}

const Retrieved = ({ iso, source, href }: { iso: string; source: string; href?: string }) => (
  <p className="slug mt-3 flex flex-wrap items-center gap-x-2 text-[10px] normal-case tracking-[0.08em]">
    <span className="lit" aria-hidden />
    Live · retrieved{" "}
    {new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} your time · via{" "}
    {href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="ink-link">
        {source}
      </a>
    ) : (
      source
    )}
  </p>
);

function Weather({ card }: { card: WeatherCard }) {
  const { current } = card;
  const localTime = card.localTime.split("T")[1];
  return (
    <div className="border border-border bg-card/80 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="slug truncate">{card.location}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Local time {localTime}</p>
        </div>
        <WeatherIcon code={current.code} isDay={current.isDay} className="h-7 w-7 shrink-0 text-city-amber" />
      </div>
      <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
        <p className="font-display text-5xl leading-none text-foreground">
          {Math.round(current.tempC)}°<span className="text-2xl text-muted-foreground">C</span>
        </p>
        <div className="pb-1 text-sm text-muted-foreground">
          <p className="text-foreground">{current.conditions}</p>
          <p>
            {fahrenheit(current.tempC)}°F · feels {Math.round(current.feelsLikeC)}° · wind {Math.round(current.windKmh)} km/h ·
            humidity {current.humidityPct}%
          </p>
        </div>
      </div>
      {card.forecast.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-px overflow-hidden border border-border bg-border sm:grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))]">
          {card.forecast.map((day, i) => (
            <li key={day.date} className="bg-card px-2.5 py-2 text-center">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {i === 0 ? "Today" : new Date(`${day.date}T12:00`).toLocaleDateString([], { weekday: "short" })}
              </p>
              <WeatherIcon code={day.code} className="mx-auto my-1 h-4 w-4 text-foreground/70" />
              <p className="text-sm text-foreground">
                {Math.round(day.highC)}° <span className="text-muted-foreground">{Math.round(day.lowC)}°</span>
              </p>
              {day.precipChancePct !== null && (
                <p className="font-mono text-[10px] text-muted-foreground">{day.precipChancePct}% rain</p>
              )}
            </li>
          ))}
        </ul>
      )}
      <Retrieved iso={card.retrievedAt} source={card.source.name} href={card.source.url} />
    </div>
  );
}

function News({ card }: { card: NewsCard }) {
  return (
    <div className="border border-border bg-card/80 p-4">
      <p className="slug">Headlines · {card.topic}</p>
      <ol className="mt-2 divide-y divide-border">
        {card.items.map((item) => (
          <li key={item.link}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-3 py-2.5"
            >
              <span className="min-w-0">
                <span className="block font-display text-lg leading-snug text-foreground group-hover:text-primary">
                  {item.title}
                </span>
                <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
                  {item.source}
                  {ago(item.published) && ` · ${ago(item.published)}`}
                </span>
              </span>
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ol>
      <Retrieved iso={card.retrievedAt} source="publisher feeds" />
    </div>
  );
}

function Repos({ card }: { card: GithubCard }) {
  return (
    <div className="border border-border bg-card/80 p-4">
      <a
        href={card.profile}
        target="_blank"
        rel="noopener noreferrer"
        className="slug inline-flex items-center gap-2 hover:text-primary"
      >
        <Github className="h-3.5 w-3.5" aria-hidden /> github.com/JiwiKiwi19
      </a>
      <ul className="mt-2 divide-y divide-border">
        {card.repos.slice(0, 6).map((repo) => (
          <li key={repo.url}>
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="group block py-2.5">
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-sm font-medium text-foreground group-hover:text-primary">{repo.name}</span>
                <span className="flex shrink-0 items-center gap-3 font-mono text-[11px] text-muted-foreground">
                  {repo.language && <span>{repo.language}</span>}
                  {repo.stars > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3" aria-label="stars" />
                      {repo.stars}
                    </span>
                  )}
                </span>
              </span>
              {repo.description && <span className="mt-0.5 block text-sm text-muted-foreground">{repo.description}</span>}
              <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground/80">
                pushed {ago(repo.updated)}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <Retrieved iso={card.retrievedAt} source="GitHub" href={card.profile} />
    </div>
  );
}

const ToolCardView = ({ card }: { card: ToolCard }) =>
  card.kind === "weather" ? <Weather card={card} /> : card.kind === "news" ? <News card={card} /> : <Repos card={card} />;

export default ToolCardView;
