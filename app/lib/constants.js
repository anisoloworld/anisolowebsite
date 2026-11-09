// Static lists shared by server and client components (no API calls here).

// ---------------------------------------------------------------------------
// Static lists (kept local so the nav/genre pages need no API call)
// ---------------------------------------------------------------------------

// AniList's non-adult genres. "Hentai" is intentionally not here.
export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

export const SORTS = [
  { value: "POPULARITY_DESC", label: "Popular" },
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "START_DATE_DESC", label: "Latest" },
  { value: "SCORE_DESC", label: "Top Rated" },
];

export const FORMATS = [
  { value: "", label: "All formats" },
  { value: "TV", label: "TV" },
  { value: "MOVIE", label: "Movie" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "SPECIAL", label: "Special" },
  { value: "TV_SHORT", label: "TV Short" },
];

export const STATUSES = [
  { value: "", label: "Any status" },
  { value: "RELEASING", label: "Airing" },
  { value: "FINISHED", label: "Finished" },
  { value: "NOT_YET_RELEASED", label: "Upcoming" },
];

const SORT_VALUES = new Set(SORTS.map((s) => s.value));
const FORMAT_VALUES = new Set(FORMATS.map((f) => f.value).filter(Boolean));
const STATUS_VALUES = new Set(STATUSES.map((s) => s.value).filter(Boolean));

// Turns whatever is in the URL into values AniList will accept (or drops them).
export function sanitizeFilters({ sort, format, status, genre, page } = {}) {
  return {
    sort: SORT_VALUES.has(sort) ? sort : "POPULARITY_DESC",
    format: FORMAT_VALUES.has(format) ? format : undefined,
    status: STATUS_VALUES.has(status) ? status : undefined,
    genre: GENRES.includes(genre) ? genre : undefined,
    page: Math.min(Math.max(parseInt(page || "1", 10) || 1, 1), 100),
  };
}

export const FORMAT_LABELS = {
  TV: "TV",
  TV_SHORT: "TV Short",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
};

export const STATUS_LABELS = {
  FINISHED: "Finished",
  RELEASING: "Currently Airing",
  NOT_YET_RELEASED: "Not Yet Released",
  CANCELLED: "Cancelled",
  HIATUS: "On Hiatus",
};

