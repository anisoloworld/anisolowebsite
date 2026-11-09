import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import BannerAd from "../../components/BannerAd";
import Savebt from "../../components/savebutton";
import ErrorState from "../../components/ErrorState";
import { getAnimeDetails } from "../../lib/anilist";
import { FORMAT_LABELS, STATUS_LABELS } from "../../lib/constants";
import Watchbutton from "./watchbutton";

async function load(id) {
  try {
    return { anime: await getAnimeDetails(id), failed: false };
  } catch (err) {
    console.error("Detail load failed:", err.message);
    return { anime: null, failed: true };
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { anime } = await load(id);
  if (!anime) return { title: "Anime | anisolo" };

  const description =
    anime.description.slice(0, 155).replace(/\s+/g, " ").trim() ||
    `Details, score and where to watch ${anime.title} officially.`;

  return {
    title: `${anime.title} | anisolo`,
    description,
    keywords: [anime.title, anime.romaji, `${anime.title} where to watch`, "anime", "anisolo"].filter(Boolean),
    alternates: { canonical: `https://anisolo.com/anime/${anime.id}` },
    openGraph: {
      title: anime.title,
      description,
      images: anime.poster ? [anime.poster] : [],
      type: "website",
    },
  };
}

function formatDate(d) {
  if (!d?.year) return null;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return [d.month ? months[d.month - 1] : null, d.day, d.year].filter(Boolean).join(" ");
}

const sectionTitle = {
  fontSize: "1.4rem",
  color: "#fff",
  borderBottom: "2px solid #222",
  paddingBottom: "10px",
  marginBottom: "15px",
};

const labelStyle = {
  color: "#666",
  margin: "0 0 5px 0",
  fontSize: "0.85rem",
  textTransform: "uppercase",
};

const valueStyle = { margin: 0, fontWeight: "600", color: "#e0e0e0" };

export default async function AnimeDetailPage({ params }) {
  const { id } = await params;
  const { anime, failed } = await load(id);

  if (failed) {
    return (
      <div style={{ backgroundColor: "#111", minHeight: "100vh", paddingTop: "100px" }}>
        <ErrorState />
      </div>
    );
  }
  if (!anime) notFound();

  const seasonText = anime.season
    ? `${anime.season.charAt(0)}${anime.season.slice(1).toLowerCase()} ${anime.year || ""}`.trim()
    : anime.year
    ? String(anime.year)
    : "N/A";

  const nextAir = anime.nextEpisode
    ? new Date(anime.nextEpisode.airingAt * 1000).toLocaleDateString("en-US", {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const info = [
    ["Status", STATUS_LABELS[anime.status] || anime.status || "N/A"],
    ["Format", FORMAT_LABELS[anime.format] || anime.format || "N/A"],
    ["Episodes", anime.episodes || "N/A"],
    ["Episode length", anime.duration ? `${anime.duration} min` : "N/A"],
    ["Season", seasonText],
    ["Studio", anime.studios.join(", ") || "N/A"],
    ["Aired", [formatDate(anime.startDate), formatDate(anime.endDate)].filter(Boolean).join(" – ") || "N/A"],
    ["Source", anime.source ? anime.source.replace(/_/g, " ").toLowerCase() : "N/A"],
  ];

  return (
    <div
      className="detail-page-container"
      style={{
        backgroundColor: "#0c0c0c",
        minHeight: "100vh",
        color: "#ffffff",
        fontFamily: "sans-serif",
        paddingBottom: "60px",
      }}
    >
      {/* Hero backdrop */}
      <div
        className="hero-backdrop"
        style={{
          position: "relative",
          width: "100%",
       
          minHeight: "80vh",
          
          backgroundImage: anime.banner
            ? `linear-gradient(to bottom, rgba(12,12,12,0.1), #0c0c0c), url(${anime.banner})`
            : "linear-gradient(to bottom, #1a1a1a, #0c0c0c)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "80px",
            bottom: "20px",
            left: "4%",
            right: "4%",
            display: "flex",
            alignItems: "flex-end",
            gap: "40px",
            flexWrap: "wrap",
          }}
        >
          <div
            className="detail-poster-wrapper"
            style={{
              width: "220px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
              flexShrink: 0,
              backgroundColor: anime.color || "#222",
            }}
          >
            <Image
              width={342}
              height={513}
              unoptimized
              priority
              src={anime.poster || "https://placehold.co/500x750?text=No+Poster"}
              alt={anime.title}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          <div className="detail-metadata-block" style={{ flex: "1", minWidth: "300px" }}>
            <h1
              style={{
                fontSize: "2.5rem",
                margin: "10px 0 6px 0",
                fontWeight: "800",
                lineHeight: "1.1",
              }}
            >
              {anime.title}
            </h1>
            {anime.native && (
              <p style={{ margin: "0 0 16px 0", color: "#999", fontSize: "1rem" }}>
                {anime.native}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                marginBottom: "18px",
                flexWrap: "wrap",
              }}
            >
              {anime.score && (
                <span
                  style={{
                    backgroundColor: "#ffb606",
                    color: "#000",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                  }}
                >
                  ★ {anime.score.toFixed(1)} AniList Score
                </span>
              )}
              <span style={{ color: "#ccc", fontSize: "0.9rem" }}>
                {anime.popularity.toLocaleString("en-US")} members
              </span>
            </div>

            <span
              style={{
                fontSize: "0.9rem",
                color: "#aaa",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              {anime.year || "N/A"} • {FORMAT_LABELS[anime.format] || "Anime"}
              {anime.episodes ? ` • ${anime.episodes} episodes` : ""}
            </span>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "16px 0" }}>
              {anime.genres.map((g) => (
                <Link
                  key={g}
                  prefetch={false}
                  href={`/categories/${encodeURIComponent(g)}`}
                  style={{
                    border: "1px solid #A020F0",
                    borderRadius: "20px",
                    padding: "5px 12px",
                    fontSize: "0.85rem",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  {g}
                </Link>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "20px", flexWrap: "wrap" }}>
              <Watchbutton id={anime.id} />
              <div
                className="savebtdata"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "30px",
                  backgroundColor: "white",
                  color: "black",
                  padding: "4px 5px",
                  borderRadius: "5px",
                }}
              >
                <Savebt
                  id={anime.id}
                  type="anime"
                  title={anime.title}
                  poster={anime.poster}
                  year={anime.year}
                  rating={anime.score}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main style={{ padding: "40px 4% 0 4%", maxWidth: "1300px", margin: "0 auto" }}>
        

        <div className="idinfo" style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
          <section className="detail-left-col" style={{ flex: "1 1 420px", minWidth: 0 }}>
            <h2 style={sectionTitle}>Overview</h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#cccccc",
                lineHeight: "1.7",
                margin: "0 0 20px 0",
                whiteSpace: "pre-line",
              }}
            >
              {anime.description || "No description available."}
            </p>

            {nextAir && (
              <p
                style={{
                  background: "#141414",
                  border: "1px solid #222",
                  borderRadius: "8px",
                  padding: "14px 18px",
                  color: "#e0e0e0",
                  margin: "0 0 20px 0",
                }}
              >
                📺 Episode {anime.nextEpisode.episode} airs on <strong>{nextAir}</strong>
              </p>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                background: "#141414",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              {info.map(([label, value]) => (
                <div key={label}>
                  <h4 style={labelStyle}>{label}</h4>
                  <p style={{ ...valueStyle, textTransform: label === "Source" ? "capitalize" : "none" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="trailer-section"
            className="detail-right-col"
            style={{ flex: "1 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <h2 style={{ ...sectionTitle, marginBottom: "5px" }}>Official Trailer</h2>
            {anime.trailer ? (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  backgroundColor: "#000",
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${encodeURIComponent(anime.trailer)}?autoplay=0&rel=0`}
                  title={`${anime.title} trailer`}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allowFullScreen
                />
              </div>
            ) : (
              <div
                style={{
                  background: "#141414",
                  borderRadius: "8px",
                  aspectRatio: "16/9",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#777",
                  flexDirection: "column",
                  gap: "10px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🎬</span>
                <p style={{ margin: 0, fontSize: "0.95rem" }}>No official trailer available.</p>
              </div>
            )}
          </section>
        </div>

        <BannerAd />

        {anime.characters.length > 0 && (
          <section style={{ marginTop: "40px" }}>
            <h2 style={sectionTitle}>Characters</h2>
            <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "10px" }}>
              {anime.characters.map((c) => (
                <div key={c.id} style={{ width: "110px", flexShrink: 0, textAlign: "center" }}>
                  <div
                    style={{
                      width: "110px",
                      height: "110px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundColor: "#222",
                    }}
                  >
                    {c.image && (
                      <Image
                        width={110}
                        height={110}
                        unoptimized
                        loading="lazy"
                        src={c.image}
                        alt={c.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", fontWeight: "600" }}>{c.name}</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#777", textTransform: "capitalize" }}>
                    {String(c.role || "").toLowerCase()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {anime.relations.length > 0 && (
          <section style={{ marginTop: "40px" }}>
            <h2 style={sectionTitle}>Related Anime</h2>
            <div className="media-gridrec" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "16px" }}>
              {anime.relations.slice(0, 10).map((r) => (
                <Link
                  prefetch={false}
                  href={`/anime/${r.id}`}
                  key={`${r.relation}-${r.id}`}
                  style={{ textDecoration: "none", color: "white", display: "block" }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "2/3",
                      borderRadius: "6px",
                      overflow: "hidden",
                      backgroundColor: "#222",
                      marginBottom: "8px",
                    }}
                  >
                    {r.poster && (
                      <Image
                        width={342}
                        height={513}
                        loading="lazy"
                        unoptimized
                        src={r.poster}
                        alt={r.title}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <p style={{ margin: "0 0 2px 0", fontSize: "0.75rem", color: "#A020F0", textTransform: "capitalize" }}>
                    {r.relation.toLowerCase()}
                  </p>
                  <h4 style={{ fontSize: "0.9rem", margin: 0, fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}

        {anime.recommendations.length > 0 && (
          <section style={{ marginTop: "40px" }}>
            <h2 style={sectionTitle}>More Anime Like This</h2>
            <div className="media-gridrec" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "16px" }}>
              {anime.recommendations.slice(0, 10).map((r) => (
                <Link
                  prefetch={false}
                  href={`/anime/${r.id}`}
                  key={r.id}
                  style={{ textDecoration: "none", color: "white", display: "block" }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "2/3",
                      borderRadius: "6px",
                      overflow: "hidden",
                      backgroundColor: "#222",
                      marginBottom: "8px",
                    }}
                  >
                    {r.poster && (
                      <Image
                        width={342}
                        height={513}
                        loading="lazy"
                        unoptimized
                        src={r.poster}
                        alt={r.title}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <h4 style={{ fontSize: "0.9rem", margin: 0, fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}

    
      </main>
    </div>
  );
}
