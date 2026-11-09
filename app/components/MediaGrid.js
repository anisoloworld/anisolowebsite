import Link from "next/link";
import Image from "next/image";
import { FORMAT_LABELS } from "../lib/constants";

// One anime card grid used by home, browse, genre and search pages.
// Expects items normalised by lib/anilist.js (id, title, poster, score, format, episodes).
export default function MediaGrid({ items, limit, className = "media-grid" }) {
  const list = limit ? items.slice(0, limit) : items;

  return (
    <div className={className}>
      {list.map((anime) => {
        const meta = [
          anime.format ? FORMAT_LABELS[anime.format] || anime.format : null,
          anime.episodes ? `${anime.episodes} eps` : null,
        ]
          .filter(Boolean)
          .join(" • ");

        return (
          <Link
            prefetch={false}
            href={`/anime/${anime.id}`}
            key={anime.id}
            className="media-card"
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                width: "100%",
                aspectRatio: "2/3",
                backgroundColor: anime.color || "#222",
              }}
            >
              <Image
                width={342}
                height={513}
                loading="lazy"
                unoptimized
                src={
                  anime.poster || "https://placehold.co/500x750?text=No+Poster"
                }
                alt={anime.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  padding: "4px 8px",
                  fontSize: "0.75rem",
                  borderRadius: "4px",
                  color: "#ffb606",
                  fontWeight: "bold",
                }}
              >
                ★ {anime.score ? anime.score.toFixed(1) : "NR"}
              </span>
            </div>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: "600",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: "10px 0 0 0",
                lineHeight: "1.2",
              }}
            >
              {anime.title}
            </h3>
            {meta && (
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "0.8rem",
                  color: "#888",
                }}
              >
                {meta}
              </p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
