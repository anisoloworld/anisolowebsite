
'use client';

import Link from 'next/link';
import { FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const AD_URL =
  'https://www.profitableratecpmnetwork.com/s23ki0q0ht?key=9c4b453c21b3ade5a3b9fd34d228332b';

const AD_COOLDOWN = 30 * 60 * 1000; // 30 minutes

export default function WatchButton({ id }) {
  const router = useRouter();
  const watchUrl = `/anime/${id}/stream?type=anime`;

  const handleClick = (e) => {
    // Preserve normal behavior for opening links in another tab.
    if (
      e.button !== 0 ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    e.preventDefault();

    try {
      const lastAdTime = Number(
        sessionStorage.getItem('anisolo_last_watch_ad') || 0
      );

      const now = Date.now();

      if (now - lastAdTime >= AD_COOLDOWN) {
        // Set cooldown before opening the ad to prevent rapid repeat clicks.
        sessionStorage.setItem(
          'anisolo_last_watch_ad',
          String(now)
        );

        {/*window.open(AD_URL, '_blank', 'noopener,noreferrer');*/}
      }
    } catch {
      // If storage is unavailable, continue playback without blocking.
    }

    router.push(watchUrl);
  };

  return (
    <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
      <Link
        className="watchbt"
        onClick={handleClick}
        href={watchUrl}
        prefetch={false}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'white',
          color: '#000000',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          padding: '14px 38px',
          borderRadius: '6px',
          textDecoration: 'none',
          transition: '.2s ease-in-out',
        }}
      >
        <span style={{ fontSize: '1.4rem' }}>
          <FaPlay />
        </span>
        Watch Now
      </Link>
    </div>
  );
}
