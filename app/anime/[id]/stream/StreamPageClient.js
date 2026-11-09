"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BannerAd from "../../../components/BannerAd";
import Savebt from "../../../components/savebutton";
import Sharebts from "../../../components/ShareSection";
import { FaInfoCircle } from "react-icons/fa";

// Episode grid: each row is 40px tall, 4 rows are visible, the rest scrolls
const EP_ROW_HEIGHT = 40;
const EP_GAP = 8;
const EP_VISIBLE_ROWS = 4; // change to 3 for 3 rows

export default function StreamPageClient({ id, mediaType = "anime", data }) {
  const item = data.details;
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [vidriftSources, setVidriftSources] = useState([]);
  const [currentSource, setCurrentSource] = useState(null);
  const [sourcePanelSeen, setSourcePanelSeen] = useState(false);
  const [audioMode, setAudioMode] = useState("sub");
  const [sourceNotice, setSourceNotice] = useState("Open the player's Sources menu once to load available server options here.");

  // Episode count read straight from AniList (no cap)
  const [anilistEpisodes, setAnilistEpisodes] = useState(0);
  const totalEpisodes = Math.max(1, anilistEpisodes || Number(item.episodes) || 1);

  const title = item.title || item.name || "Anime";
  const backdrop = item.bannerImage || item.backdrop_path || item.poster_path || "";
  const poster = item.poster_path || "https://placehold.co/500x750?text=No+Poster";
  const playerUrl = `https://embed.vidrift.net/embed/anilist/${encodeURIComponent(id)}/${selectedEpisode}?layout=labeled&mobileSheets=true${audioMode === "dub" ? "&dub=1" : ""}`;
  const iframeOrigin = "https://embed.vidrift.net";
  const chooseVidriftSource = (source) => {
    const frame = document.getElementById("vidrift-player");
    if (!frame?.contentWindow || !source) return;
    frame.contentWindow.postMessage({
      type: "vidrift:mobile-option",
      option: source.option,
      value: source.value,
    }, iframeOrigin);
    setCurrentSource(source.value);
  };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://anisolo.ai/anime/${id}/stream?type=anime`;

  // Fetch the episode count from AniList
  // Priority: total episodes -> (next airing episode - 1) -> latest aired episode in schedule
  useEffect(() => {
    const anilistId = Number(id);
    if (!anilistId) return;
    let cancelled = false;
    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        query: `query ($id: Int) {
          Media(id: $id, type: ANIME) {
            episodes
            nextAiringEpisode { episode }
          }
          Page(perPage: 1) {
            airingSchedules(mediaId: $id, notYetAired: false, sort: EPISODE_DESC) { episode }
          }
        }`,
        variables: { id: anilistId },
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const media = json?.data?.Media;
        const total = Number(media?.episodes) || 0;
        const next = Number(media?.nextAiringEpisode?.episode) || 0;
        const latest = Number(json?.data?.Page?.airingSchedules?.[0]?.episode) || 0;
        const count = total || (next > 1 ? next - 1 : 0) || latest;
        if (count > 0) setAnilistEpisodes(count);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    function handleVidriftMessage(event) {
      if (event.origin !== iframeOrigin || !event.data || typeof event.data !== "object") return;
      const message = event.data;
      if (message.type === "vidrift:mobile-panel" && (message.panel === "source" || message.panel === "settings")) {
        const options = Array.isArray(message.options) ? message.options.filter((option) =>
          option && typeof option.label === "string" && "value" in option && "option" in option
        ) : [];
        setVidriftSources(options);
        setCurrentSource(message.current?.source ?? message.current?.server ?? null);
        setSourcePanelSeen(true);
        setSourceNotice(options.length ? "Choose a source below. The options are supplied by VidRift." : "VidRift opened a panel but did not provide selectable source options.");
      }
      if (message.type === "vidrift:episode" && Number.isFinite(Number(message.episode))) {
        setSelectedEpisode(Math.max(1, Number(message.episode)));
      }
    }
    window.addEventListener("message", handleVidriftMessage);
    return () => window.removeEventListener("message", handleVidriftMessage);
  }, []);

  // Restore the saved episode (not clamped, because the episode count loads after the page)
  useEffect(() => {
    const saved = Number(sessionStorage.getItem(`anime_ep_${id}`) || "1");
    setSelectedEpisode(Math.max(1, saved));
  }, [id]);

  useEffect(() => {
    sessionStorage.setItem(`anime_ep_${id}`, String(selectedEpisode));
  }, [id, selectedEpisode]);

  const addComment = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments((current) => [...current, { id: Date.now(), text }]);
    setCommentText("");
  };

  return (
    <div style={{ background: "#0c0c0c", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif", paddingBottom: 80, paddingTop: 40 }}>
      <main style={{ padding: "30px 4% 0", maxWidth: 1300, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, marginBottom: 20 }}>
          Watching <span style={{ color: "#A020F0" }}>{title}</span>
          <span style={{ fontSize: "1.1rem", color: "#888", marginLeft: 12 }}>Episode {selectedEpisode}</span>
        </h1>

        <div id="playerid" style={{
          margin: "auto", position: "relative", width: "100%", maxWidth: 1250,height:"90vh", aspectRatio: "16/9",
          borderRadius: 12, overflow: "hidden", backgroundColor: "#000", marginBottom: 20,
          backgroundImage: isPlaying ? "none" : `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.7)), url("${backdrop}")`,
          backgroundSize: "cover", backgroundPosition: "center", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          {!isPlaying ? (
            <div style={{ textAlign: "center", padding: 20 }}>
              <button onClick={() => setIsPlaying(true)} style={{ border: 0, background: "#A020F0", color: "#fff", width: 76, height: 76, borderRadius: "50%", fontSize: 28, cursor: "pointer" }} aria-label="Load player">▶</button>
              <p>Click to load player</p>
            </div>
          ) : (
            <iframe id="vidrift-player" key={playerUrl} src={playerUrl} title={`${title} episode ${selectedEpisode}`}
              style={{ width: "100%", height: "100%", border: 0 }} allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" />
          )}
        </div>

        <p style={{margin:"20px 0px", textAlign:"center",fontSize:"14px",padding:"10px",borderRadius:"50px",backgroundColor:"#a020f020",border:"1px solid #a020f0",width:"fit-content",display:"flex",justifySelf:"center"}}>Explore player builtin option at top right corner and switch servers to find your DUB in audio options</p>

        <section aria-label="Audio and video sources" style={{ maxWidth: 1250, margin: "0 auto 22px", padding: 18, border: "1px solid #292929", borderRadius: 12, background: "#111" }}>
          <div style={{ display: "flex",flexDirection:"column",justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 750 }}>Audio &amp; sources</h2>
              <p style={{ margin: "5px 0 0", color: "#929292", fontSize: ".82rem" }}>SUB/DUB only available for supported titles. For more audio options, use the player’s built-in menu to witch servers and choose specific dub.</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[{ value: "sub", label: "SUB · Original" }, { value: "dub", label: "DUB" }].map((mode) => (
                <button key={mode.value} type="button" onClick={() => {
                  setAudioMode(mode.value);
                  setIsPlaying(true);
                  setVidriftSources([]);
                  setSourcePanelSeen(false);
                  setSourceNotice(mode.value === "dub" ? "Requesting VidRift's English-dub default if available." : "Loading VidRift's default source.");
                }} style={{ padding: "9px 14px", borderRadius: 8, border: audioMode === mode.value ? "1px solid #a020f0" : "1px solid #353535", background: audioMode === mode.value ? "rgba(160,32,240,.18)" : "#1b1b1b", color: audioMode === mode.value ? "#e6c8ff" : "#d0d0d0", fontWeight: 700, fontSize: ".82rem", cursor: "pointer" }}>
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          {vidriftSources.length > 0 ? (
            <>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {vidriftSources.map((source, index) => {
                  const selected = currentSource === source.value;
                  const label = source.label || `Source ${index + 1}`;
                  const dubLike = /dub|english|eng/i.test(`${label} ${source.group || ""} ${source.desc || ""}`);
                  return <button key={`${String(source.option)}-${String(source.value)}-${index}`} type="button" onClick={() => chooseVidriftSource(source)} title={source.desc || label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, border: selected ? "1px solid #a020f0" : "1px solid #343434", background: selected ? "rgba(160,32,240,.17)" : "#191919", color: selected ? "#fff" : "#d5d5d5", cursor: "pointer", fontSize: ".85rem" }}>
                    <span>{label}</span>
                    {dubLike && <span style={{ fontSize: ".68rem", fontWeight: 800, padding: "2px 5px", borderRadius: 4, background: "#173c2a", color: "#8be0ae" }}>DUB</span>}
                  </button>;
                })}
              </div>
              <p style={{ color: "#777", fontSize: ".76rem", margin: "10px 0 0" }}>Source labels and options come from VidRift. A DUB badge is inferred from the source label, not guaranteed by the provider.</p>
            </>
          ) : <p style={{ margin: 0, color: "#858585", fontSize: ".82rem", lineHeight: 1.5 }}>{sourceNotice} {isPlaying && !sourcePanelSeen ? "Custom source lists are only provided through VidRift’s mobileSheets message API on supported phone views. On PC, use Quality → Source inside the player; the iframe does not expose its source list to this page." : ""}</p>}
        </section>

        {item.format !== "MOVIE" && <section style={{ background: "#111", padding: 18, borderRadius: 12, border: "1px solid #292929", marginBottom: 30 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 750 }}>Episodes</h2>
            <span style={{ color: "#858585", fontSize: ".8rem" }}>{totalEpisodes} listed</span>
          </div>
          <p style={{ color: "#cecece", fontSize: ".82rem", margin: "0 0 14px" ,textDecoration:"underline"}}>Select an episode. More seasons and episodes may be available in player built-in Episodes menu.</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(68px, 1fr))",
            gridAutoRows: EP_ROW_HEIGHT,
            gap: EP_GAP,
            maxHeight: EP_VISIBLE_ROWS * EP_ROW_HEIGHT + (EP_VISIBLE_ROWS - 1) * EP_GAP,
            overflowY: "auto",
            paddingRight: 4
          }}>
            {Array.from({ length: totalEpisodes }, (_, index) => index + 1).map((episode) => (
              <button key={episode} onClick={() => {
                setSelectedEpisode(episode);
                setIsPlaying(true);
                document.getElementById("playerid")?.scrollIntoView({ behavior: "smooth", block: "center" });
              }} style={{
                height: EP_ROW_HEIGHT, padding: "0 8px", borderRadius: 8, border: selectedEpisode === episode ? "1px solid #a020f0" : "1px solid #303030", fontWeight: 700, cursor: "pointer",
                background: selectedEpisode === episode ? "#6920a0" : "#191919",
                color: selectedEpisode === episode ? "#fff" : "#c1c1c1", transition: "background .15s ease"
              }}>EP {episode}</button>
            ))}
          </div>
        </section>}

        
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",textAlign:"center"}}><Sharebts title={title} shareUrl={shareUrl} /></div>
        <div
          
                style={{
                  marginBottom:"20px",
                  background: "#111", padding: 20, borderRadius: 8, border: "1px solid #1c1c1c"
                }}
              >
                <div
                  style={{
                    
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
                      backgroundColor: item.color || "#222",
                    }}
                  >
                    <Image
                      width={342}
                      height={513}
                      unoptimized
                      priority
                      src={poster || "https://placehold.co/500x750?text=No+Poster"}
                      alt={title}
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                  </div>
        
                  <div className="detail-metadata-block" style={{ flex: "1", minWidth: "300px" }}>
                    <h1
                      style={{
                        fontSize: "3rem",
                        margin: "10px 0 6px 0",
                        fontWeight: "800",
                        lineHeight: "1.1",
                      }}
                    >
                      {title}
                    </h1>
                    {item.native && (
                      <p style={{ margin: "0 0 16px 0", color: "#999", fontSize: "1rem" }}>
                        {item.native}
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
                      {item.score && (
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
                          ★ {item.score.toFixed(1)} AniList Score
                        </span>
                      )}
                      <span style={{ color: "#ccc", fontSize: "0.9rem" }}>
                        {item.popularity.toLocaleString("en-US")} members
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
                      {totalEpisodes > 1 ? ` • ${totalEpisodes} episodes` : ""}
                    </span>
        
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "16px 0" }}>
                      {item.genres.map((g) => (
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
                          id={item.id}
                          type="anime"
                          title={title}
                          poster={poster}
                          year={item.year}
                          rating={item.score}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <section style={{ marginBottom: 35, background: "#111", padding: 20, borderRadius: 8, border: "1px solid #1c1c1c" }}>
          <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>Story Overview</h2>
          <p style={{ color: "#ccc", lineHeight: 1.7, margin: 0 }}>{(item.overview || "No description is available.").replace(/<[^>]*>/g, "")}</p>
        </section>

        {data.recommendedItems?.length > 0 && <section style={{ marginBottom: 45 }}>
          <h2 style={{ fontSize: "1.5rem", borderBottom: "2px solid #222", paddingBottom: 12 }}>More Anime Like This</h2>
          <div className="media-gridrec" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 16 }}>
            {data.recommendedItems.slice(0, 10).map((anime) => <Link prefetch={false} href={`/anime/${anime.id}?type=anime`} key={anime.id} style={{ color: "#fff", textDecoration: "none" }}>
              <div style={{ aspectRatio: "2/3", overflow: "hidden", background: "#222", borderRadius: 6 }}>
                <Image width={342} height={513} unoptimized loading="lazy" src={anime.poster_path || "https://placehold.co/500x750?text=No+Poster"} alt={anime.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <h3 style={{ fontSize: ".9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{anime.title}</h3>
            </Link>)}
          </div>
        </section>}

        {/*<section style={{ background: "#111", padding: 25, borderRadius: 8, border: "1px solid #222" }}>
          <h2 style={{ fontSize: "1.3rem", marginTop: 0 }}>Discussion</h2>
          <textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add your thoughts..." style={{ width: "100%", minHeight: 80, boxSizing: "border-box", background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, color: "white", padding: 12 }} />
          <button onClick={addComment} style={{ marginTop: 10, background: "#A020F0", color: "#fff", border: 0, padding: "9px 18px", borderRadius: 4, cursor: "pointer" }}>Post Comment</button>
          {comments.map((comment) => <p key={comment.id} style={{ color: "#ccc", borderBottom: "1px solid #222", paddingBottom: 10 }}>{comment.text}</p>)}
        </section>*/}
        <BannerAd />
      </main>
    </div>
  );
}