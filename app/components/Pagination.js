import Link from "next/link";

// Previous / Next footer. `params` are the current query params (without page).
export default function Pagination({ basePath, params = {}, page, lastPage }) {
  const hrefFor = (p) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v) qs.set(k, v);
    }
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  const disabled = {
    backgroundColor: "#181818",
    color: "#555",
    border: "1px solid #222",
    padding: "10px 24px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "0.95rem",
    cursor: "not-allowed",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        marginTop: "50px",
      }}
    >
      {page > 1 ? (
        <Link
          prefetch={false}
          href={hrefFor(page - 1)}
          style={{
            backgroundColor: "#222",
            color: "#fff",
            border: "1px solid #444",
            textDecoration: "none",
            padding: "10px 24px",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "0.95rem",
          }}
        >
          ← Previous
        </Link>
      ) : (
        <span style={disabled}>← Previous</span>
      )}

      <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.1rem" }}>
        {page}
      </span>
      {page < lastPage && (
        <span style={{ color: "#888", fontWeight: "bold", fontSize: "1.1rem" }}>
          of {lastPage}
        </span>
      )}

      {page < lastPage ? (
        <Link
          prefetch={false}
          href={hrefFor(page + 1)}
          style={{
            backgroundColor: "#A020F0",
            color: "#fff",
            textDecoration: "none",
            padding: "10px 28px",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "0.95rem",
            boxShadow: "0 4px 10px rgba(229, 9, 20, 0.2)",
          }}
        >
          Next →
        </Link>
      ) : (
        <span style={{ ...disabled, padding: "10px 28px" }}>Next →</span>
      )}
    </div>
  );
}
