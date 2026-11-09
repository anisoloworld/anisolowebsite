"use client";

import { useEffect, useState } from "react";
import { BsDisplay } from "react-icons/bs";
import { FaBookmark} from "react-icons/fa";

export default function SaveButton({
  id,
  type,
  title,
  poster,
  year,
  rating,
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setSaved(list.some((item) => item.id === id && item.type === type));
  }, [id, type]);

  function toggleSave() {
    const list = JSON.parse(localStorage.getItem("watchlist") || "[]");

    const exists = list.find(
      (item) => item.id === id && item.type === type
    );

    if (exists) {
      const updated = list.filter(
        (item) => !(item.id === id && item.type === type)
      );

      localStorage.setItem("watchlist", JSON.stringify(updated));
      setSaved(false);
    } else {
      list.push({
        id,
        type,
        title,
        poster,
        year,
        rating,
      });

      localStorage.setItem("watchlist", JSON.stringify(list));
      setSaved(true);
    }
  }

  return (
    <div
      onClick={toggleSave}
      style={{
        backgroundColor:"none",
        border:"none",
        
      }}
    >
      {saved ? <div style={{display:'flex',alignItems:'center',fontSize:'22px'}}><FaBookmark style={{color:"red"}}/><p style={{fontSize:"15px",color: '#030303', textDecoration: 'none', fontWeight: '700',marginLeft:'5px'}}>Saved</p></div>
       :<div style={{display:'flex',alignItems:'center',fontSize:'22px'}}><FaBookmark/><p style={{fontSize:"15px",color: '#000000', textDecoration: 'none', fontWeight: '700',marginLeft:'5px'}}>Save</p></div> }
    </div>
  );
}  