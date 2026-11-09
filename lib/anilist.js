// Uses the shared AniList client (Vercel proxy + Cloudflare KV cache + stale fallback)
// from app/lib/anilist.js instead of calling AniList directly.
import { anilistRequest } from "../app/lib/anilist";

export async function anilistQuery(query, variables = {}) {
  return anilistRequest(query, variables, 21600);
}

export const ANIME_FIELDS = `
  id
  idMal
  title { romaji english native }
  coverImage { extraLarge large medium }
  bannerImage
  description(asHtml: false)
  genres
  averageScore
  popularity
  trending
  episodes
  duration
  season
  seasonYear
  status
  format
  startDate { year month day }
  endDate { year month day }
  studios(isMain: true) { nodes { name } }
  siteUrl
`;

export function normalizeAnime(anime) {
  if (!anime) return null;
  const title =
    anime.title?.english ||
    anime.title?.romaji ||
    anime.title?.native ||
    "Untitled anime";
  const startDate = anime.startDate;
  const date =
    startDate?.year
      ? `${startDate.year}-${String(startDate.month || 1).padStart(2, "0")}-${String(startDate.day || 1).padStart(2, "0")}`
      : "";
  const score =
    typeof anime.averageScore === "number" ? anime.averageScore / 10 : null;
  return {
    ...anime,
    title,
    name: title,
    poster_path: anime.coverImage?.extraLarge || anime.coverImage?.large || anime.coverImage?.medium || null,
    backdrop_path: anime.bannerImage || anime.coverImage?.extraLarge || anime.coverImage?.large || null,
    vote_average: score,
    vote_count: anime.popularity || 0,
    overview: anime.description || "",
    release_date: date,
    first_air_date: date,
    runtime: anime.duration || null,
    number_of_seasons: 1,
    media_type: "anime",
    type: "anime",
  };
}

export async function getAnimeList({
  page = 1,
  perPage = 20,
  sort = "TRENDING_DESC",
  search,
  genre,
  status,
  season,
  seasonYear,
} = {}) {
  const allowedSorts = new Set([
    "TRENDING_DESC", "POPULARITY_DESC", "SCORE_DESC",
    "START_DATE_DESC", "UPDATED_AT_DESC", "SEARCH_MATCH", "FAVOURITES_DESC"
  ]);
  const safeSort = allowedSorts.has(sort) ? sort : "TRENDING_DESC";
  const query = `
    query (
      $page: Int!, $perPage: Int!, $sort: [MediaSort], $search: String,
      $genre: String, $status: MediaStatus, $season: MediaSeason,
      $seasonYear: Int
    ) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage }
        media(
          type: ANIME
          sort: $sort
          search: $search
          genre: $genre
          status: $status
          season: $season
          seasonYear: $seasonYear
          isAdult: false
        ) { ${ANIME_FIELDS} }
      }
    }
  `;
  const data = await anilistQuery(query, {
    page,
    perPage,
    sort: [safeSort],
    ...(search ? { search } : {}),
    ...(genre ? { genre } : {}),
    ...(status ? { status } : {}),
    ...(season ? { season } : {}),
    ...(seasonYear ? { seasonYear } : {}),
  });
  return {
    results: (data.Page?.media || []).map(normalizeAnime),
    totalPages: Math.max(1, Math.min(data.Page?.pageInfo?.lastPage || 1, 500)),
    pageInfo: data.Page?.pageInfo,
  };
}

export async function getAnimeById(id) {
  const query = `
    query ($id: Int!) {
      Media(id: $id, type: ANIME) {
        ${ANIME_FIELDS}
        recommendations(sort: RATING_DESC, perPage: 10) {
          nodes {
            mediaRecommendation {
              ${ANIME_FIELDS}
            }
          }
        }
      }
    }
  `;
  const data = await anilistQuery(query, { id: Number(id) });
  const anime = normalizeAnime(data.Media);
  if (!anime) return null;
  anime.recommendedItems = (data.Media.recommendations?.nodes || [])
    .map((node) => normalizeAnime(node.mediaRecommendation))
    .filter(Boolean);
  return anime;
}