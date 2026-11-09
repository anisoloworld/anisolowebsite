"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
//import NativeAd from "./NativeAd";
import BannerAd from "./BannerAd";

const ITEMS_PER_PAGE = 12;

export default function WatchListClient() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  

  useEffect(() => {
    loadWatchlist();
  }, []);

  function loadWatchlist() {
    // Older saves from the movie version of the site (TMDB ids) are ignored.
    const list = JSON.parse(localStorage.getItem("watchlist") || "[]").filter(
      (item) => item.type === "anime"
    );

    // newest first
    list.reverse();

    setItems(list);
  }

  function removeItem(id, type) {
    const list = JSON.parse(localStorage.getItem("watchlist") || "[]");

    const updated = list.filter(
      (item) => !(item.id === id && item.type === type)
    );

    localStorage.setItem("watchlist", JSON.stringify(updated));

    setItems(updated.filter((item) => item.type === "anime").reverse());
  }

  const totalPages = Math.max(
    1,
    Math.ceil(items.length / ITEMS_PER_PAGE)
  );

  const currentItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;

    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, page]);

  return (
    <div
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "white",
        padding: "40px 4%",
      }}
    >
        <BannerAd/>
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "30px",
        }}
      >
        ❤️ My Watchlist
      </h1>

      {items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "80px",
            color: "#888",
          }}
        >
          <h2>No saved anime yet.</h2>

          <p>
            Click the Save button on any anime page.
          </p>

          <Link
            href="/home"
            style={{
              display: "inline-block",
              marginTop: "25px",
              background: "#A020F0",
              color: "white",
              padding: "12px 25px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Browse Anime
          </Link>
        </div>
      ) : (
        <>
          <div className="media-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(180px,1fr))",
              gap: "22px",
            }}
          >
            {currentItems.map((movie) => (
              <div key={`${movie.type}-${movie.id}`} style={{
                  background: "#1a1a1a",
                  borderRadius: "10px",
                  
                }}>
              <Link href={`/anime/${movie.id}`}
                key={`${movie.type}-${movie.id}`}
                style={{
                  background: "#1a1a1a",
                  borderRadius: "10px",
                  
                }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "2/3",
                  }}
                >
                  <Image
                    src={movie.poster || "https://placehold.co/500x750?text=No+Poster"}
                    alt={movie.title}
                    fill
                    unoptimized
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: "12px",
                  }}
                >
                  <h3
                    style={{
                      color:"white",
                      fontSize: "15px",
                      marginBottom: "10px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {movie.title}
                  </h3>

                  <div
                    
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: "#A020F0",
                      color: "white",
                      padding: "10px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontWeight: "bold",
                     
                    }}
                  >
                    View Details
                  </div>

                  
                </div>
              </Link>
              <div  style={{
                  padding:"0px 12px"
                  
                }}>
              <button
                    onClick={() =>
                      removeItem(movie.id, movie.type)
                    }
                    style={{
                      width: "100%",
                      background: "#333",
                      color: "white",
                      border: "none",
                      padding: "12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginBottom: "10px",
                    }}
                  >
                    Remove
                  </button></div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "45px",
                flexWrap: "wrap",
              }}
            >
              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    background:
                      p === page ? "#A020F0" : "#222",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      {/*<NativeAd/>*/}
    </div>
  );
}