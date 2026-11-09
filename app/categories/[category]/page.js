import { notFound } from "next/navigation";
import BannerAd from "../../components/BannerAd";
import MediaGrid from "../../components/MediaGrid";
import Pagination from "../../components/Pagination";
import BrowseFilters from "../../components/BrowseFilters";
import Catrow from "../../components/catrow";
import ErrorState from "../../components/ErrorState";
import { browseAnime, sanitizeFilters } from "../../lib/anilist";
import { GENRES } from "../../lib/constants";

function resolveGenre(param) {
  const name = decodeURIComponent(param || "");
  return GENRES.find((g) => g.toLowerCase() === name.toLowerCase()) || null;
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const genre = resolveGenre(category);
  if (!genre) return { title: "Genre not found | anisolo" };

  return {
    title: `${genre} Anime | anisolo`,
    description: `Browse the best ${genre.toLowerCase()} anime on anisolo, with scores, details and official streaming links.`,
    keywords: [`${genre} anime`, `best ${genre} anime`, "anisolo", "anime genres"],
    alternates: {
      canonical: `https://anisolo.com/categories/${encodeURIComponent(genre)}`,
    },
  };
}

export default async function GenrePage({ params, searchParams }) {
  const { category } = await params;
  const genre = resolveGenre(category);
  if (!genre) notFound();

  const f = sanitizeFilters(await searchParams);

  let result = null;
  try {
    result = await browseAnime({
      genre,
      sort: f.sort,
      format: f.format,
      status: f.status,
      page: f.page,
      revalidate: 3600,
    });
  } catch (err) {
    console.error("Genre page failed:", err.message);
  }

  const basePath = `/categories/${encodeURIComponent(genre)}`;

  return (
    <div
      style={{
        backgroundColor: "#111111",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        paddingBottom: "80px",
        paddingTop: "60px",
      }}
    >
      <Catrow current={genre} />
      <BrowseFilters
        basePath={basePath}
        sort={f.sort}
        format={f.format || ""}
        status={f.status || ""}
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
            <span style={{ color: "#A020F0" }}>{genre}</span> Anime
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
            No {genre.toLowerCase()} anime match these filters.
          </div>
        ) : (
          <>
            <MediaGrid items={result.items} />
            <Pagination
              basePath={basePath}
              params={{
                sort: f.sort,
                format: f.format,
                status: f.status,
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
