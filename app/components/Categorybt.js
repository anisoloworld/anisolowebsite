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
      ref={menuRef} className="lefnavlinks" 
    >
      <div
        onClick={() => setOpen(!open)}
        style={{fontSize:"15px",color: '#e0e0e0', textDecoration: 'none', fontWeight: '600',
          cursor: "pointer",
        }}
      >
        Genres {!open ? <FaArrowRight style={{animation:"arrowrotate1 0.2s ease-in-out",fontSize:'10px'}}/>:<FaArrowDown style={{animation:"arrowrotate 0.2s ease-in-out",fontSize:'10px'}}/> } 
      </div>

      {open && (
        <div 
          style={{
            animation:"catdown 0.2s ease-out",
            display:"grid",
            gridTemplateColumns:'1fr 1fr 1fr',
            gap:"2px",
            position: "absolute",
            top: "50px",
            left: 10,
            width: "fit-content",
            
            maxHeight: "90vh",
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