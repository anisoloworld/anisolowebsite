// AniList GraphQL data layer for anisolo.
// Server-side only: every page calls these helpers from server components, so
// visitors never hit AniList directly. Results are cached (Next data cache plus a
// small in-memory cache that also serves stale data if AniList rate-limits us).

// ANILIST_URL can be overridden (e.g. to point at a proxy or a mock in tests).
// On Cloudflare, AniList blocks most Worker IPs, so ANILIST_URL points at a small
// proxy hosted on Vercel. The proxy only accepts requests that carry ANILIST_PROXY_KEY.
// Both are read at request time (not module load) so Worker secrets are available.
function getAniListConfig() {
  return {
    url: process.env.ANILIST_URL || "https://graphql.anilist.co",
    proxyKey: process.env.ANILIST_PROXY_KEY || "",
  };
}

import {
  GENRES, SORTS, FORMATS, STATUSES, FORMAT_LABELS, STATUS_LABELS, sanitizeFilters,
} from "./constants";

export { GENRES, SORTS, FORMATS, STATUSES, FORMAT_LABELS, STATUS_LABELS, sanitizeFilters };

// ---------------------------------------------------------------------------
// Fetching with Cloudflare KV cache + local single-flight + stale fallback
// ---------------------------------------------------------------------------

// KV is optional at build time. Add an ANILIST_CACHE binding in wrangler.jsonc
// for persistent cache shared by all Worker isolates. The in-memory fallback
// keeps local development working when that binding is not configured.
const memory = new Map(); // key -> { data, at }
const inflight = new Map(); // key -> Promise
const MAX_MEMORY_ENTRIES = 300;
const MAX_STALE_MS = 7 * 24 * 60 * 60 * 1000;

async function getKV() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const context = getCloudflareContext();
    return context?.env?.ANILIST_CACHE || null;
  } catch {
    // During next build/dev or if no binding is configured, use memory cache.
    return null;
  }
}

async function cacheKey(key) {
  const bytes = new TextEncoder().encode(key);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return "anilist:v1:" + Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function readPersistent(key) {
  const kv = await getKV();
  if (!kv) return null;
  try {
    const raw = await kv.get(await cacheKey(key), "json");
    if (raw && raw.data && Number.isFinite(raw.at)) return raw;
  } catch (err) {
    console.warn("AniList KV read failed; using local cache:", err?.message || err);
  }
  return null;
}

async function writePersistent(key, entry) {
  const kv = await getKV();
  if (!kv) return;
  try {
    // Keep stale results for up to a week so temporary API blocks/outages do
    // not blank pages. The timestamp controls the shorter fresh-cache window.
    await kv.put(await cacheKey(key), JSON.stringify(entry), { expirationTtl: 604800 });
  } catch (err) {
    console.warn("AniList KV write failed; using local cache:", err?.message || err);
  }
}

async function request(query, variables, revalidate = 1800) {
  const key = JSON.stringify([query, variables]);
  const now = Date.now();
  let hit = memory.get(key) || await readPersistent(key);
  if (hit) {
    memory.set(key, hit);
    if (now - hit.at < Math.max(60, revalidate) * 1000) return hit.data;
  }

  if (inflight.has(key)) return inflight.get(key);

  const run = (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      let res;
      try {
        const { url, proxyKey } = getAniListConfig();
        res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(proxyKey ? { "x-proxy-key": proxyKey } : {}),
          },
          body: JSON.stringify({ query, variables }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      const json = await res.json().catch(() => null);
      if (!res.ok || !json || json.errors?.length) {
        const msg = json?.errors?.[0]?.message || `HTTP ${res.status}`;
        const err = new Error(`AniList request failed: ${msg}`);
        err.status = res.status;
        err.retryAfter = res.headers.get("retry-after");
        throw err;
      }

      const entry = { data: json.data, at: Date.now() };
      if (memory.size >= MAX_MEMORY_ENTRIES) {
        const oldest = memory.keys().next().value;
        if (oldest !== undefined) memory.delete(oldest);
      }
      memory.set(key, entry);
      // Do not make the visitor wait for KV persistence; it is best-effort.
      await writePersistent(key, entry);
      return json.data;
    } catch (err) {
      // Serve last successful response, even when it is stale, during rate
      // limits, manual blocks, network errors, or AniList downtime.
      if (hit && Date.now() - hit.at <= MAX_STALE_MS) {
        console.warn("AniList unavailable; serving stale cached data:", err?.message || err);
        return hit.data;
      }
      throw err;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, run);
  return run;
}

// Raw GraphQL access for other modules (e.g. lib/anilist.js used by the stream page).
// Goes through the same proxy, KV cache, single-flight and stale fallback as everything else.
export async function anilistRequest(query, variables = {}, revalidate = 21600) {
  return request(query, variables, revalidate);
}

// ---------------------------------------------------------------------------
// Normalising AniList media into one simple shape used by every component
// ---------------------------------------------------------------------------

const CARD_FIELDS = `
  id
  title { romaji english native }
  coverImage { extraLarge large color }
  bannerImage
  averageScore
  episodes
  format
  status
  season
  seasonYear
  genres
  description(asHtml: false)
`;

export function pickTitle(title) {
  return (
    title?.english || title?.romaji || title?.native || "Untitled anime"
  );
}

// AniList descriptions are HTML with spoiler markup. Render as plain text only.
export function cleanDescription(html) {
  if (!html) return "";
  return String(html)
    .replace(/~!.*?!~/gs, "") // spoilers
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeMedia(m) {
  if (!m) return null;
  return {
    id: m.id,
    title: pickTitle(m.title),
    romaji: m.title?.romaji || null,
    native: m.title?.native || null,
    poster: m.coverImage?.extraLarge || m.coverImage?.large || null,
    color: m.coverImage?.color || null,
    banner: m.bannerImage || null,
    score:
      typeof m.averageScore === "number" ? m.averageScore / 10 : null,
    episodes: m.episodes ?? null,
    format: m.format || null,
    status: m.status || null,
    year: m.seasonYear || m.startDate?.year || null,
    season: m.season || null,
    genres: m.genres || [],
    description: cleanDescription(m.description),
  };
}

// ---------------------------------------------------------------------------
// Public queries
// ---------------------------------------------------------------------------

// Browse / filter / search. Used by home rows, /anime, genre pages and search.
export async function browseAnime({
  sort = "POPULARITY_DESC",
  status,
  format,
  genre,
  search,
  page = 1,
  perPage = 20,
  revalidate = 1800,
} = {}) {
  const query = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus,
           $format: MediaFormat, $genre: String, $search: String) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage }
        media(type: ANIME, isAdult: false, sort: $sort, status: $status,
              format: $format, genre: $genre, search: $search) {
          ${CARD_FIELDS}
          startDate { year }
        }
      }
    }
  `;

  const variables = { page, perPage, sort: [sort] };
  if (status) variables.status = status;
  if (format) variables.format = format;
  if (genre) variables.genre = genre;
  if (search) variables.search = search;

  const data = await request(query, variables, revalidate);
  const pageData = data?.Page;
  return {
    items: (pageData?.media ?? []).map(normalizeMedia),
    lastPage: Math.min(pageData?.pageInfo?.lastPage || 1, 100),
    total: pageData?.pageInfo?.total || 0,
  };
}

export async function searchAnime(term, page = 1) {
  const cleaned = String(term || "").trim().slice(0, 100);
  if (!cleaned) return { items: [], lastPage: 1, total: 0 };
  return browseAnime({
    search: cleaned,
    sort: "SEARCH_MATCH",
    page,
    perPage: 24,
    revalidate: 3600,
  });
}

// Streaming platforms AniList lists for a title, de-duplicated by platform.
function extractStreamingLinks(media) {
  const seen = new Set();
  const links = [];

  for (const l of media.externalLinks || []) {
    if (l.type !== "STREAMING" || l.isDisabled || !l.url) continue;
    const name = (l.site || "").trim();
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    links.push({
      site: name,
      url: l.url,
      color: l.color || null,
      language: l.language || null,
    });
  }

  // Episode pages sometimes reveal a platform the external-links list lacks.
  for (const ep of media.streamingEpisodes || []) {
    const name = (ep.site || "").trim();
    if (!name || !ep.url || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    links.push({ site: name, url: ep.url, color: null, language: null });
  }

  return links;
}

export async function getAnimeDetails(id) {
  const numericId = parseInt(id, 10);
  if (!Number.isInteger(numericId) || numericId <= 0) return null;

  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        idMal
        isAdult
        siteUrl
        title { romaji english native }
        description(asHtml: false)
        coverImage { extraLarge large color }
        bannerImage
        genres
        synonyms
        averageScore
        popularity
        favourites
        episodes
        duration
        status
        format
        source
        season
        seasonYear
        startDate { year month day }
        endDate { year month day }
        studios(isMain: true) { nodes { name } }
        trailer { id site }
        nextAiringEpisode { episode airingAt }
        externalLinks { site type url language color isDisabled }
        streamingEpisodes { site url }
        characters(perPage: 10, sort: [ROLE, RELEVANCE]) {
          edges { role node { id name { full } image { large } } }
        }
        relations {
          edges {
            relationType(version: 2)
            node { id type format title { romaji english native } coverImage { large } }
          }
        }
        recommendations(perPage: 12, sort: RATING_DESC) {
          nodes {
            mediaRecommendation {
              id isAdult
              title { romaji english native }
              coverImage { extraLarge large }
              averageScore format
            }
          }
        }
      }
    }
  `;

  let data;
  try {
    data = await request(query, { id: numericId }, 86400);
  } catch (err) {
    // AniList answers 404 with an error for unknown ids.
    if (err.status === 404) return null;
    throw err;
  }

  const m = data?.Media;
  if (!m || m.isAdult) return null;

  const base = normalizeMedia(m);

  return {
    ...base,
    idMal: m.idMal || null,
    siteUrl: m.siteUrl || `https://anilist.co/anime/${m.id}`,
    synonyms: m.synonyms || [],
    popularity: m.popularity || 0,
    favourites: m.favourites || 0,
    duration: m.duration || null,
    source: m.source || null,
    startDate: m.startDate || null,
    endDate: m.endDate || null,
    studios: (m.studios?.nodes || []).map((s) => s.name),
    trailer:
      m.trailer?.site === "youtube" && m.trailer?.id ? m.trailer.id : null,
    nextEpisode: m.nextAiringEpisode || null,
    streamingLinks: extractStreamingLinks(m),
    characters: (m.characters?.edges || [])
      .filter((e) => e.node?.name?.full)
      .map((e) => ({
        id: e.node.id,
        name: e.node.name.full,
        image: e.node.image?.large || null,
        role: e.role,
      })),
    relations: (m.relations?.edges || [])
      .filter((e) => e.node?.type === "ANIME")
      .map((e) => ({
        id: e.node.id,
        relation: String(e.relationType || "").replace(/_/g, " "),
        title: pickTitle(e.node.title),
        poster: e.node.coverImage?.large || null,
        format: e.node.format || null,
      })),
    recommendations: (m.recommendations?.nodes || [])
      .map((n) => n.mediaRecommendation)
      .filter((r) => r && !r.isAdult)
      .map((r) => ({
        id: r.id,
        title: pickTitle(r.title),
        poster: r.coverImage?.extraLarge || r.coverImage?.large || null,
        score:
          typeof r.averageScore === "number" ? r.averageScore / 10 : null,
        format: r.format || null,
      })),
  };
}

// Used by the sitemap: a modest list of the most popular titles.
export async function getTopAnimeIds(pages = 2) {
  const out = [];
  for (let p = 1; p <= pages; p++) {
    try {
      const { items } = await browseAnime({ page: p, perPage: 50, revalidate: 86400 });
      out.push(...items.map((i) => i.id));
    } catch {
      break;
    }
  }
  return out;
}