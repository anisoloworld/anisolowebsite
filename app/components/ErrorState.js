import Link from "next/link";

// Shown when AniList can't be reached (rate limit / outage) so pages never crash.
export default function ErrorState({
  title = "Couldn't load anime right now",
  message = "The anime data service is busy. Please try again in a minute.",
}) {
  return (
    <div
      style={{
        color: "#888",
        textAlign: "center",
        padding: "80px 20px",
        fontSize: "1.1rem",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: "10px" }}>{title}</h2>
      <p style={{ margin: "0 0 25px 0" }}>{message}</p>
      <Link
        href="/home"
        style={{
          color: "#A020F0",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        ← Back to Home
      </Link>
    </div>
  );
}
