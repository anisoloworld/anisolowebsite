"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { GENRES } from "../lib/constants";


export default function CategoryButton() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div 
      ref={menuRef}
      style={{
     
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{fontSize:"15px",color: '#e0e0e0', textDecoration: 'none', fontWeight: '600',
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        Genres {!open ? <FaArrowRight style={{fontSize:'10px'}}/>:<FaArrowDown style={{fontSize:'10px'}}/> } 
      </div>

      {open && (
        <div 
          style={{
            display:"grid",
            gridTemplateColumns:'1fr 1fr',
            gap:"5px",
            position: "absolute",
            top: "40px",
            left: 0,
            width: "fit-content",
            maxHeight: "80vh",
            overflowY: "auto",
            background: "#1b1b1b",
            borderRadius: "8px",
            boxShadow: "0 6px 20px rgba(0,0,0,.5)",
            zIndex: 9999,
          }}
        >
          {GENRES.map((name) => (
            <Link onClick={() => setOpen(!open)} className="catlinks"
              key={name}
              href={`/categories/${encodeURIComponent(name)}`}
              style={{
                display: "block",
                padding: "12px 18px",
                color: "#fff",
                textDecoration: "none",
                borderBottom: "1px solid #2a2a2a",
              }}
            >
              {name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}