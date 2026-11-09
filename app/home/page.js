import Link from "next/link";
import BannerAd from "../components/BannerAd";
import HeroCarousel from "../components/HeroCarousel";
import MediaGrid from "../components/MediaGrid";
import ErrorState from "../components/ErrorState";
import { browseAnime } from "../lib/anilist";
import Catrow from "../components/catrow";

export const metadata = {
  title: "Anisolo - Trending & Latest Anime",
  description:
    "Explore trending anime, currently airing series, and popular anime on anisolo.",
 keywords: ["anisolo", "anime", "trending anime", "latest anime", "anime genres", "watch anime", "anime database", "watch anme for free", "anime website", "free anime website", "free anime streaming website", "watch anime online",
    "anime online",
    "anime streaming",
    "free anime streaming",
    "watch anime free",
    "stream anime online",
    "online anime website",
    "anime streaming website",
    "anime episodes",
    "watch anime episodes",
    "latest anime episodes",
    "new anime releases",
    "latest anime",
    "upcoming anime",
    "trending anime",
    "popular anime",
    "best anime",
    "anime series",
    "anime movies",
    "anime database",
    "anime search",
    "discover anime",
    "anime recommendations",
    "anime genres",
    "action anime",
    "adventure anime",
    "romance anime",
    "comedy anime",
    "fantasy anime",
    "isekai anime",
    "slice of life anime",
    "drama anime",
    "horror anime",
    "sci-fi anime",
    "shonen anime",
    "seinen anime",
    "shojo anime",
    "josei anime",
    "subbed anime",
    "dubbed anime",
    "anime sub and dub",
    "English dubbed anime",
    "English subbed anime",
    "anime with English subtitles",
    "anime in Japanese",
    "anime in English",
    "anime watch online",
    "anime streaming in HD",
    "anime episode guide",
    "anime release schedule",
    "anime ratings",
    "anime synopsis",
    "anime characters",
    "anime seasons",
    "anime watchlist",
    "anisolo",
    "anisolo anime",
    "anisolo anime streaming"],
  authors: [{ name: "anisolo Team" }],
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Anisolo - Anime",
    description: "Explore trending and currently airing anime on anisolo.",
    url: "https://anisolo.com/home",
    siteName: "Anisolo",
    type: "website",
  },
};

// Home needs several lists; one failing (e.g. rate limit) shouldn't blank the page.
async function safeBrowse(options) {
  try {
    return (await browseAnime(options)).items;
  } catch (err) {
    console.error("Home list failed:", err.message);
    return [];
  }
}

function AnimeSection({ title, items, moreHref, moreLabel, marginTop }) {
  if (!items.length) return null;
  return (
    <section className="media-section" style={{ marginTop }}>
      
      <h2
        className="row-title"
        style={{
          fontSize: "1.6rem",
          color: "white",
          marginBottom: "20px",
          fontWeight: "700",
        }}
      >
        {title}
      </h2>

      <MediaGrid items={items} limit={12} />

      {moreHref && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <Link
            prefetch={false}
            href={moreHref}
            className="show-more-btn"
            style={{
              display: "inline-block",
              backgroundColor: "transparent",
              color: "#A020F0",
              border: "2px solid #A020F0",
              fontSize: "1rem",
              fontWeight: "bold",
              padding: "12px 30px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            {moreLabel}
          </Link>
        </div>
      )}
    </section>
  );
}

export default async function HomePage() {
  const [trending, airing, popular, topRated] = await Promise.all([
    safeBrowse({ sort: "TRENDING_DESC" }),
    safeBrowse({ sort: "START_DATE_DESC", status: "RELEASING" }),
    safeBrowse({ sort: "POPULARITY_DESC" }),
    safeBrowse({ sort: "SCORE_DESC", format: "TV" }),
  ]);

  const heroItems = [...trending, ...airing]
    .filter((anime) => anime.banner)
    .filter((anime, i, all) => all.findIndex((a) => a.id === anime.id) === i)
    .slice(0, 6);

  const nothingLoaded = !trending.length && !airing.length && !popular.length;

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundColor: "#111111",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        paddingBottom: "80px",
      }}
    >
      <div style={{marginTop:"40px"}}>
        <Catrow />
      </div>
      <main className="dashboard-main" style={{ padding: "0 4%" }}>
        {nothingLoaded ? (
          <div style={{ paddingTop: "100px" }}>
            <ErrorState />
          </div>
        ) : (
          <>
            <div style={{ marginTop: "0" }}>
              <HeroCarousel items={heroItems} />
            </div>

            <AnimeSection
              title="Trending Anime This Week"
              items={trending}
              moreHref="/anime?sort=TRENDING_DESC"
              moreLabel="Show More Trending Anime"
              marginTop="60px"
            />

            <BannerAd />

            <AnimeSection
              title="Currently Airing Anime"
              items={airing}
              moreHref="/anime?status=RELEASING&sort=START_DATE_DESC"
              moreLabel="Show More Airing Anime"
              marginTop="60px"
            />

            <AnimeSection
              title="Popular Anime"
              items={popular}
              moreHref="/anime?sort=POPULARITY_DESC"
              moreLabel="Show More Popular Anime"
              marginTop="60px"
            />

            <AnimeSection
              title="Top Rated TV Anime"
              items={topRated}
              moreHref="/anime?sort=SCORE_DESC&format=TV"
              moreLabel="Show More Top Rated"
              marginTop="60px"
            />
          </>
        )}
      </main>
    </div>
  );
}
