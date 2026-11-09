"use client";

import { useState, useEffect, useRef } from "react";

export default function BannerAd728() {
  const [loaded, setLoaded] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    const container = bannerRef.current;
    if (!container) return;

    // Clear any existing content to prevent duplicates on re-render
    container.innerHTML = "";

    // 1. Create the configuration script
    const atOptionsScript = document.createElement("script");
    atOptionsScript.type = "text/javascript";
    atOptionsScript.text = `
      atOptions = {
        'key' : '163faa34b72c691dc0342bd0070acead',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    // 2. Create the invocation script
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://bauval.org/22/163faa34b72c691dc0342bd0070acead";
    invokeScript.async = true;

    // Trigger loaded state when the ad script finishes loading
    invokeScript.onload = () => {
      setLoaded(true);
    };

    invokeScript.onerror = () => {
      console.error("Failed to load Adsterra banner script.");
    };

    // 3. Append scripts to the target container
    container.appendChild(atOptionsScript);
    container.appendChild(invokeScript);

    // Cleanup on unmount
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        margin: loaded ? "20px auto" : "0 auto",
        height: loaded ? "auto" : "0px",
        overflow: "hidden",
        transition: "height 0.3s ease, margin 0.3s ease",
      }}
    >
      <div style={{ overflow: "hidden", maxWidth: "100%" }} ref={bannerRef} />
    </div>
  );
}