
'use client';

import NextTopLoader from 'nextjs-toploader';

const TopLoaderComponent = NextTopLoader.default || NextTopLoader;

export default function TopLoader() {
  return (
    <TopLoaderComponent
      color="#A020F0"
      height={3}
      showSpinner={false}
      crawl={false}
      showForHashAnchor={false}
    />
  );
}
