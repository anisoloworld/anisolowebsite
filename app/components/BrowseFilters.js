"use client";

import { useState } from "react";
import Link from "next/link";
import { GENRES, SORTS, FORMATS, STATUSES } from "../lib/constants";

const selectStyle = {
  background: "#2a2a2a",
  color: "white",
  border: "1px solid #000000",
  borderRadius: "20px",
  padding: "12px 12px",
  fontSize: "14px",
  cursor: "pointer",
  outline: "none",
  width: "fit-content",
};

// Filter bar for /anime and genre pages. `showGenre` adds a genre dropdown.
export default function BrowseFilters({
  basePath,
  sort = "POPULARITY_DESC",
  format = "",
  status = "",
  genre = "",
  showGenre = false,
  resetHref,
}) {
  const [s, setS] = useState(sort);
  const [f, setF] = useState(format);
  const [st, setSt] = useState(status);
  const [g, setG] = useState(genre);

  // Genre pages keep the genre in the path; /anime keeps it in the query.
  const qs = new URLSearchParams();
  if (s) qs.set("sort", s);
  if (f) qs.set("format", f);
  if (st) qs.set("status", st);
  if (showGenre && g) qs.set("genre", g);
  const applyHref = `${basePath}?${qs.toString()}`;

  return (
    <div
      className="filterbtns"
      style={{
        display: "flex",
        width: "95vw",
        justifySelf: "center",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <select value={s} style={selectStyle} onChange={(e) => setS(e.target.value)}>
          {SORTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select value={f} style={selectStyle} onChange={(e) => setF(e.target.value)}>
          {FORMATS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select value={st} style={selectStyle} onChange={(e) => setSt(e.target.value)}>
          {STATUSES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {showGenre && (
          <select value={g} style={selectStyle} onChange={(e) => setG(e.target.value)}>
            <option value="">All genres</option>
            {GENRES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <Link
          href={applyHref}
          style={{
            fontSize: "14px",
            cursor: "pointer",
            padding: "10px",
            backgroundColor: "#A020F0",
            border: "none",
            borderRadius: "20px",
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          Apply Filters
        </Link>
        <Link
          href={resetHref || basePath}
          style={{
            fontSize: "14px",
            cursor: "pointer",
            padding: "10px",
            backgroundColor: "#252525",
            border: "none",
            borderRadius: "20px",
            color: "#A020F0",
            display: "flex",
            alignItems: "center",
          }}
        >
          Remove Filters
        </Link>
      </div>
    </div>
  );
}
