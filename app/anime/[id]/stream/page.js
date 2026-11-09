import Link from "next/link";
import StreamPageClient from "./StreamPageClient";
import { getAnimeById } from "../../../../lib/anilist";

export const revalidate = 1800;

async function getStreamPageData(id) {
  const anime = await getAnimeById(id);
  if (!anime) return null;
  return { details: anime, recommendedItems: anime.recommendedItems || [], isMovie: anime.format === "MOVIE" };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  let data = null;
  try { data = await getStreamPageData(id); } catch (error) { console.error("Failed to load stream metadata:", error); }
  const title = data?.details?.title || "Anime";
  return {
    title: `Watching ${title} | anisolo`,
    description: `Anime details and episode player for ${title}.`,
    alternates: { canonical: `https://anisolo.com/watch/${id}/stream?type=anime` },
  };
}

export default async function StreamPlaybackPage({ params }) {
  const { id } = await params;
  let data = null;
  try { data = await getStreamPageData(id); } catch (error) { console.error("Failed to load anime playback page:", error); }
  if (!data?.details) {
    return <div style={{ background: "#0c0c0c", color: "white", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>
      <h2>Anime information could not be loaded.</h2><Link href="/home" style={{ color: "#A020F0", marginTop: 15 }}>← Back to Anime</Link>
    </div>;
  }
  return <StreamPageClient id={String(id)} mediaType="anime" data={data} />;
}