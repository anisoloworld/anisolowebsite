"use client";

import { useState, useEffect } from "react";
import {FaDownload} from "react-icons/fa";


export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // stop the automatic mini-infobar/prompt
      setDeferredPrompt(e); // save the event so we can trigger it later
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // hide button if app gets installed
    window.addEventListener("appinstalled", () => {
      setShowButton(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // show the native install prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User installed the app");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null; // don't render button if install isn't available

  return (
    <button
      onClick={handleInstallClick}
      style={{
        backgroundColor: "#A020F0",
        color: "white",
        border: "none",
        borderRadius: "20px",
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        display:"flex",gap:"10px",alignItems:"center"
      }}
    >
      <FaDownload/>Install App
    </button>
  );
}