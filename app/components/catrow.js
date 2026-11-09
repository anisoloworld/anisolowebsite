"use client";

import { useRef } from "react";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { GENRES } from "../lib/constants";

// Horizontally scrolling genre chips shown above genre pages.
export default function Catrow({ current }) {
  const containerRef = useRef(null);

  const getItemWidth = () => {
    const container = containerRef.current;
    if (!container) return 0;
    const firstItem = container.querySelector("a");
    if (!firstItem) return 0;
    return firstItem.getBoundingClientRect().width + 10;
  };

  const handlescroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;
    const distance = getItemWidth() * 2;
    container.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "95vw",
        justifySelf: "center",
        margin: "0 auto",
      }}
    >
      <FaArrowLeft
        onClick={() => handlescroll("prev")}
        style={{
          padding: "10px",
          boxShadow: "2px 0px 10px black",
          borderRadius: "50px",
          cursor: "pointer",
        }}
      />
      <div
        ref={containerRef}
        className="catrow"
        style={{
          display: "flex",
          justifyContent: "space-between",
          overflow: "scroll",
          whiteSpace: "nowrap",
          gap: "10px",
          margin: "20px 0px",
          justifySelf: "center",
        }}
      >
        {GENRES.map((name) => (
          <Link
            className={current === name ? "catrows" : "catselected"}
            key={name}
            style={{
              color: "white",
              fontSize: "14px",
              flexShrink: "0",
              textDecoration: "none",
              padding: "10px",
              border: "1px solid #A020F0",
              borderRadius: "20px",
              background: current === name ? "#A020F0" : "none",
            }}
            href={`/categories/${encodeURIComponent(name)}`}
          >
            {name}
          </Link>
        ))}
      </div>
      <FaArrowRight
        onClick={() => handlescroll("next")}
        style={{
          padding: "10px",
          boxShadow: "2px 0px 10px black",
          borderRadius: "50px",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
