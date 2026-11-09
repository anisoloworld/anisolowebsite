import BannerAd from "../components/BannerAd";
import MediaGrid from "../components/MediaGrid";
import Pagination from "../components/Pagination";
import ErrorState from "../components/ErrorState";
import { searchAnime } from "../lib/anilist";

export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  const term = String(q || "").slice(0, 100);

  return {
    title: term ? `${term} Anime Search Results | anisolo` : "Search Anime | anisolo",
    description: `Search results for ${term || "anime"} on anisolo, with scores, genres and official streaming links.`,
    robots: { index: false, follow: true },
  };
}

export default async function SearchResultsPage({ searchParams }) {
  const resolved = await searchParams;
  const keyword = String(resolved.q || "").trim().slice(0, 100);
  const page = Math.min(Math.max(parseInt(resolved.page || "1", 10) || 1, 1), 100);

  let result = null;
  let failed = false;
  if (keyword) {
    try {
      result = await searchAnime(keyword, page);
    } catch (err) {
      console.error("Search failed:", err.message);
      failed = true;
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#111111",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        paddingTop: "50px",
      }}
    >
      <main style={{ padding: "40px 4% 0 4%", maxWidth: "1300px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2rem",
            color: "#ffffff",
            fontWeight: "700",
            marginBottom: "35px",
            borderBottom: "2px solid #222",
            paddingBottom: "15px",
          }}
        >
          {keyword ? (
            <>
              Showing results for:{" "}
              <span style={{ color: "#A020F0", fontStyle: "italic" }}>
                &quot;{keyword}&quot;
              </span>
            </>
          ) : (
            "Search anime"
          )}
        </h1>

        {failed ? (
          <ErrorState />
        ) : !keyword ? (
          <div style={{ color: "#666", textAlign: "center", padding: "80px 20px", fontSize: "1.2rem" }}>
            Type an anime title in the search bar above.
          </div>
        ) : !result || result.items.length === 0 ? (
          <div style={{ color: "#666", textAlign: "center", padding: "80px 20px", fontSize: "1.2rem" }}>
            No anime matched your search. Try a different title!
          </div>
        ) : (
          <>
            <MediaGrid items={result.items} className="media-grid" />
            <Pagination
              basePath="/search"
              params={{ q: keyword }}
              page={page}
              lastPage={result.lastPage}
            />
          </>
        )}
        <BannerAd />
      </main>
    </div>
  );
}
