import { GENRES } from "./lib/constants";
import { getTopAnimeIds } from "./lib/anilist";

const baseUrl = "https://anisolo.com";

// Generate at request time so deployment never depends on external API availability.
export const dynamic = "force-dynamic";

export default async function sitemap() {
  const now = new Date();

  const genreUrls = GENRES.map((name) => ({
    url: `${baseUrl}/categories/${encodeURIComponent(name)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Top ~100 anime pages. If AniList is unreachable at build time we just skip them.
  let animeUrls = [];
  try {
    const ids = await getTopAnimeIds(2);
    animeUrls = ids.map((id) => ({
      url: `${baseUrl}/anime/${id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {}

  return [
    { url: baseUrl, lastModified: now, priority: 1 },
    { url: `${baseUrl}/home`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/anime`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/Saved`, lastModified: now },
    ...genreUrls,
    ...animeUrls,
  ];
}
