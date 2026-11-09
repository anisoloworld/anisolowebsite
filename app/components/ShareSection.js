'use client';

import { useEffect, useRef, useState } from 'react';
import { FaFacebookF, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FiLink, FiCheck } from 'react-icons/fi';

const FALLBACK_URL = 'https://anisolo.com';

// Set to false if the hashtag ever stops the link from showing on Facebook
const FACEBOOK_HASHTAG = true;

const getShareUrl = () => {
  try {
    if (typeof window !== 'undefined' && window.location?.href) {
      return window.location.href;
    }
  } catch {}
  return FALLBACK_URL;
};

// "Attack on Titan" -> "AttackOnTitan" (falls back to "anisolo")
const makeTag = (title) => {
  const tag = (title || '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');
  return tag || 'anisolo';
};

const buildLinks = (title) => {
  const url = getShareUrl();
  const u = encodeURIComponent(url);
  const tag = makeTag(title);
  const text = encodeURIComponent(`Watch ${title}`);

  const facebook =
    `https://www.facebook.com/sharer/sharer.php?u=${u}` +
    (FACEBOOK_HASHTAG ? `&hashtag=${encodeURIComponent('#' + tag)}` : '');

  return {
    url,
    facebook,
    x: `https://twitter.com/intent/tweet?url=${u}&text=${text}&hashtags=${encodeURIComponent(tag)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Watch ${title} ${url}`)}`,
  };
};

export default function ShareSection({ title = 'this title' }) {
  const [links, setLinks] = useState(() => buildLinks(title));
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const copyTimer = useRef(null);

  // Recompute links with the real browser URL after mount
  const refresh = () => setLinks(buildLinks(title));

  useEffect(() => {
    refresh();
    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(copyTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3000);
  };

  const writeClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const el = document.createElement('textarea');
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };

  // Instagram has no web share URL: native share sheet on mobile,
  // otherwise copy the link and open Instagram.
  const shareInstagram = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* cancelled, fall through */
      }
    }
    await writeClipboard(url);
    showToast('Link copied. Paste it in Instagram.');
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  const copyLink = async () => {
    await writeClipboard(getShareUrl());
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  const anchors = [
    { name: 'Facebook', Icon: FaFacebookF, size: 16, href: links.facebook },
    { name: 'X', Icon: FaXTwitter, size: 16, href: links.x },
    { name: 'WhatsApp', Icon: FaWhatsapp, size: 17, href: links.whatsapp },
  ];

  return (
    <section className="share">
      <h4 className="share-title">Share</h4>

      <div className="share-row" >
        {anchors.map(({ name, Icon, size, href }) => (
          <a 
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${name}`}
            className="share-btn"
            onMouseEnter={refresh}
            onFocus={refresh}
            onTouchStart={refresh}
          >
            <Icon size={size} />
          </a>
        ))}

        <button
          type="button"
          onClick={shareInstagram}
          aria-label="Share on Instagram"
          className="share-btn"
        >
          <FaInstagram size={17} />
        </button>

        <button type="button" onClick={copyLink} className="share-copy" aria-label="Copy link">
          {copied ? <FiCheck size={15} /> : <FiLink size={15} />}
          <span>{copied ? 'Copied' : 'Copy link'}</span>
        </button>
      </div>

      {toast && (
        <p className="share-toast" role="status">
          {toast}
        </p>
      )}

      <style>{`
        .share { margin-bottom: 20px; padding:10px; }
        .share-title { margin: 0 0 16px; font-size: 1 rem; font-weight: 900; color: #bfbebe; text-transform: uppercase; letter-spacing: 1.5px; }
        .share-row {padding:10px; display: flex; align-items: center; gap: 10px; flex-wrap: nowrap; border-radius: 50px; background: rgba(20, 20, 20, 0.5); border: 1px solid #333; }
        .share-btn {
          width: 42px; height: 42px; display: inline-flex; align-items: center; justify-content: center;
          border-radius: 50%; background: #111; border: 1px solid #262626; color: #e5e5e5;
          cursor: pointer; padding: 0; text-decoration: none;
          transition: transform .15s ease, background .15s ease, border-color .15s ease, color .15s ease;
        }
        .share-btn:hover { transform: translateY(-2px); background: #A020F0; border-color: #A020F0; color: #fff; }
        .share-copy {
          height: 42px; padding: 0 18px; display: inline-flex; align-items: center; gap: 8px;
          border-radius: 999px; background: transparent; border: 1px solid #333; color: #e5e5e5;
          font-size: .85rem; font-weight: 600; cursor: pointer;
          transition: background .15s ease, border-color .15s ease;
        }
        .share-copy:hover { background: #1a1a1a; border-color: #555; }
        .share-toast { margin: 14px 0 0; font-size: .82rem; color: #aaa; }
      `}</style>
    </section>
  );
}