# J.AI — portfolio assistant

`POST /functions/v1/chat` streams the assistant's replies (Google Gemini by default) as NDJSON to the chat UI in `src/components/chat/`.

| File | What it holds |
| --- | --- |
| `profile.ts` | The verified facts about Jiwon and the assistant's instructions. **Update this when the site changes.** |
| `tools.ts` | Live data: weather (Open-Meteo), news (RSS + Google News), GitHub repos. No keys needed. |
| `index.ts` | Validation, rate limiting, the tool loop against an OpenAI-compatible API, and the stream. |

## Setup

1. Get a free Gemini key at https://aistudio.google.com/apikey and add it as the `CHAT_API_KEY` secret (Lovable Cloud → Secrets). See `.env.example` for the optional ones, including how to switch providers.
2. Deploy the function (Lovable deploys `supabase/functions/*` automatically; with the CLI: `supabase functions deploy chat`).
3. Keep the key on Gemini's free tier (no billing account) so usage can never cost money; at the free quota the assistant answers "busy" instead. The in-function rate limit (8/min, 60/hour per IP) is per instance and best effort.

Without the key, the UI shows "The assistant isn't configured yet" and the rest of the site is unaffected.

## Local development

```sh
supabase functions serve chat --env-file supabase/functions/chat/.env
VITE_CHAT_ENDPOINT=http://localhost:54321/functions/v1/chat npm run dev
```

## Privacy

Conversations are held in the visitor's browser memory only. The function doesn't store or log message content;
it logs error types only. Voice uses the browser's Web Speech API (Chrome sends audio to Google's recognizer).
