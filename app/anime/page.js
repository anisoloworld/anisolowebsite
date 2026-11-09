import BannerAd from "../components/BannerAd";
import MediaGrid from "../components/MediaGrid";
import Pagination from "../components/Pagination";
import BrowseFilters from "../components/BrowseFilters";
import ErrorState from "../components/ErrorState";
import { browseAnime, sanitizeFilters } from "../lib/anilist";
import { SORTS } from "../lib/constants";

export async function generateMetadata({ searchParams }) {
  const f = sanitizeFilters(await searchParams);
  const sortLabel = SORTS.find((s) => s.value === f.sort)?.label || "Popular";
  const genre = f.genre ? `${f.genre} ` : "";
  return {
    title: `${sortLabel} ${genre}Anime | anisolo`,
    description: `Browse ${sortLabel.toLowerCase()} ${genre.toLowerCase()}anime with scores, genres and official streaming links on anisolo.`,
    alternates: { canonical: "https://anisolo.com/anime" },
  };
}

export default async function BrowseAnimePage({ searchParams }) {
  const raw = await searchParams;
  const f = sanitizeFilters(raw);

  let result = null;
  try {
    result = await browseAnime({
      sort: f.sort,
      format: f.format,
      status: f.status,
      genre: f.genre,
      page: f.page,
    });
  } catch (err) {
    console.error("Browse failed:", err.message);
  }

  const sortLabel = SORTS.find((s) => s.value === f.sort)?.label || "Popular";

  return (
    <div
      style={{
        backgroundColor: "#111111",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        paddingBottom: "80px",
        paddingTop: "80px",
      }}
    >
      <BrowseFilters
        basePath="/anime"
        sort={f.sort}
        format={f.format || ""}
        status={f.status || ""}
        genre={f.genre || ""}
        showGenre
      />

      <main style={{ padding: "20px 4% 0 4%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            borderBottom: "2px solid #222",
            paddingBottom: "15px",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              color: "#ffffff",
              fontWeight: "700",
              margin: 0,
            }}
          >
            <span style={{ color: "#A020F0" }}>{sortLabel}</span>{" "}
            {f.genre ? `${f.genre} ` : ""}Anime
          </h1>
          {result && (
            <span
              style={{
                color: "#aaa",
                fontWeight: "600",
                fontSize: "1rem",
                backgroundColor: "#222",
                padding: "6px 14px",
                borderRadius: "20px",
              }}
            >
              Page {f.page} of {result.lastPage}
            </span>
          )}
        </div>

        {!result ? (
          <ErrorState />
        ) : result.items.length === 0 ? (
          <div style={{ color: "#666", textAlign: "center", padding: "80px 20px" }}>
            No anime match these filters.
          </div>
        ) : (
          <>
            <MediaGrid items={result.items} />
            <Pagination
              basePath="/anime"
              params={{
                sort: f.sort,
                format: f.format,
                status: f.status,
                genre: f.genre,
              }}
              page={f.page}
              lastPage={result.lastPage}
            />
          </>
        )}
        <BannerAd />
      </main>
    </div>
  );
}
