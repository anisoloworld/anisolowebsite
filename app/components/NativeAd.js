"use client";

import { useState } from "react";
export default function NativeAd() {
   const [loaded, setLoaded] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: loaded ? "20px 0" : 0,
        height: loaded ? 300 : 0,
        overflow: "hidden",
        transition: "height 0.3s ease",
        maxWidth:"100%"
      }}
    >
      <iframe
        src="/NativeAd.html"
        width="728px"
        height={300}
        style={{ border: "none", maxWidth: "728px" }}
        sandbox="allow-scripts allow-same-origin"
        title="native advertisement"
               onLoad={() => setLoaded(true)}
      />
    </div>
  );
}