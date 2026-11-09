'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaInfoCircle } from 'react-icons/fa';
import { FORMAT_LABELS } from '../lib/constants';

// Hero slider for the home page. Items are normalised AniList media
// (id, title, banner, score, year, format, description).
export default function HeroCarousel({ items }) {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  // Auto-play interval
  useEffect(() => {
    if (!items?.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [current, items?.length]);

  if (!items?.length) return null;

  return (
    <div
      className="upperbanner"
      style={{
        position: 'relative',
        paddingTop: "40px",
        height: '80vh',
        overflow: 'hidden',
        borderRadius: '12px',
        marginBottom: '50px',
        marginLeft: "-4%",
        marginRight: "-4%"
      }}
    >
      {items.map((item, index) => {
        const snippet =
          item.description.length > 220
            ? item.description.slice(0, 220).trimEnd() + '…'
            : item.description;

        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: current === index ? 1 : 0,
              pointerEvents: current === index ? 'auto' : 'none',
              zIndex: current === index ? 2 : 1,
              transition: 'opacity .5s ease-in-out',
              backgroundImage: `
                linear-gradient(
                  to right,
                  rgba(17,17,17,1) 0%,
                  rgba(17, 17, 17, 0.43) 50%,
                  rgba(0, 0, 0, 0.57) 70%,
                  rgba(0, 0, 0, 0.94) 100%
                ),
                url(${item.banner})
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '6%',
                right: '6%',
                bottom: '12%',
                maxWidth: '650px'
              }}
            >
              <h1
                style={{
                  color: '#fff',
                  fontSize: '3rem',
                  fontWeight: '800',
                  marginBottom: '20px',
                  lineHeight: '1.1'
                }}
              >
                {item.title}
              </h1>

              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: '16px',
                  color: '#ddd',
                  fontSize: '1rem',
                  fontWeight: '600',
                  flexWrap: 'wrap'
                }}
              >
                {item.score && <span>⭐ {item.score.toFixed(1)}</span>}
                {item.year && <span>📅 {item.year}</span>}
                <span>🎬 {FORMAT_LABELS[item.format] || 'Anime'}</span>
              </div>

              {snippet && (
                <p
                  style={{
                    color: '#ccc',
                    lineHeight: '1.5',
                    margin: '0 0 26px 0',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {snippet}
                </p>
              )}

              <Link
                className="watchbt"
                href={`/anime/${item.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  color: '#000000',
                  padding: '14px 34px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '1rem',
                }}
              >
                 Watch Now
              </Link>
            </div>
          </div>
        );
      })}

      {/* LEFT BUTTON */}
      <button
        className="nextbt"
        onClick={prevSlide}
        aria-label="Previous slide"
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '55px',
          height: '55px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          fontSize: '28px',
          cursor: 'pointer',
          zIndex: 20,
          backdropFilter: 'blur(4px)'
        }}
      >
        ❮
      </button>

      {/* RIGHT BUTTON */}
      <button
        className="nextbt"
        onClick={nextSlide}
        aria-label="Next slide"
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '55px',
          height: '55px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          fontSize: '28px',
          cursor: 'pointer',
          zIndex: 20,
          backdropFilter: 'blur(4px)'
        }}
      >
        ❯
      </button>

      {/* DOTS */}
      <div
        style={{
          position: 'absolute',
          bottom: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 20
        }}
      >
        {items.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: '0.3s',
              background: current === index ? '#A020F0' : 'rgba(255,255,255,0.4)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
