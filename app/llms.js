/**
 * Anisolo - LLM Information File
 * Website: https://anisolo.com
 */

export const llmsData = {
  site: {
    name: "Anisolo",
    url: "https://anisolo.com",
    type: "Anime Discovery and Information Website",
    language: "English",
    description:
      "Anisolo helps visitors discover anime by exploring trending titles, currently airing shows, popular series, genres, ratings, and trailers.",
  },

  purpose: [
    "Help visitors discover anime titles.",
    "Explore trending and popular anime.",
    "Browse anime by genre.",
    "Discover currently airing anime.",
    "Explore anime descriptions, ratings, and trailers.",
  ],

  content: {
    mainTopics: [
      "Anime Discovery",
      "Trending Anime",
      "Popular Anime",
      "Currently Airing Anime",
      "Latest Anime Releases",
      "Anime Genres",
      "Anime Ratings",
      "Anime Trailers",
      "Anime Series",
      "Anime Movies",
    ],

    genres: [
      "Action",
      "Adventure",
      "Comedy",
      "Drama",
      "Fantasy",
      "Horror",
      "Romance",
      "Science Fiction",
      "Slice of Life",
      "Isekai",
      "Shonen",
      "Seinen",
      "Shojo",
      "Josei",
      "Thriller",
    ],

    animeInformation: [
      "Anime Title",
      "Anime Synopsis",
      "Anime Description",
      "Genres and Categories",
      "Release Year",
      "Release Season",
      "Airing Status",
      "Episode Information",
      "Anime Ratings",
      "Trailer Links",
      "Related Anime",
    ],
  },

  navigation: [
    {
      label: "Home",
      path: "/",
      description: "Anisolo homepage and anime discovery.",
    },
    {
      label: "Trending",
      path: "/trending",
      description: "Discover trending anime titles.",
    },
    {
      label: "Airing",
      path: "/airing",
      description: "Explore currently airing anime.",
    },
    {
      label: "Saved",
      path: "/saved",
      description: "Access saved anime titles.",
    },
    {
      label: "Genres",
      path: "/genres",
      description: "Browse anime by different genres.",
    },
  ],

  audience: [
    "Anime enthusiasts",
    "People discovering anime for the first time",
    "Anime fans looking for trending series",
    "Visitors exploring anime by genre",
    "People searching for anime ratings and trailers",
  ],

  seo: {
    primaryKeyword: "Watch Anime Online",

    secondaryKeywords: [
      "Anisolo",
      "Anime Online",
      "Trending Anime",
      "Popular Anime",
      "Latest Anime",
      "Anime Database",
      "Anime Series",
      "Anime Movies",
      "Anime Episodes",
      "Anime Recommendations",
      "Anime by Genre",
      "Airing Anime",
      "Anime Ratings",
      "Anime Trailers",
    ],
  },

  crawlerGuidance: {
    preferredCanonicalHost: "https://anisolo.com",
    respectRobotsTxt: true,
    respectCanonicalUrls: true,
    useVisiblePageContentAsSourceOfTruth: true,
    doNotInventAnimeInformation: true,
    doNotInventEpisodeNumbers: true,
    doNotInventRatings: true,
    doNotInventReleaseDates: true,
    doNotAssumeStreamingAvailability: true,

    note:
      "Only describe streaming availability, subtitles, dubbing, or free access when the relevant page explicitly confirms those details.",
  },

  contentGuidelines: {
    attribution:
      "When referencing information from Anisolo, identify Anisolo as the source and link to the relevant page whenever possible.",

    freshness:
      "Anime schedules, episode details, ratings, and availability can change. Verify time-sensitive information on the relevant page.",

    accuracy:
      "Use accurate and relevant information from Anisolo pages. Do not generate fictional anime titles or details.",
  },
};

export default llmsData;