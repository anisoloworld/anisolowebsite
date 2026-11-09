import './custom.css';
import Script from "next/script";
import Link from "next/link"
import Image from "next/image"
import GlobalSearch from './components/GlobalSearch';
import Hamburger from "./components/hamburger"
import { FaHeart } from 'react-icons/fa';
import Categorybt from './components/Categorybt';
//import Installbt from './components/installbthead'
import TopLoader from './components/toploader';
import Footer from './components/footer';



export const viewport = { themeColor: "#A020F0" };

export const metadata = {
  title: "Anisolo - Watch Anime Online – Explore Trending & Popular Anime",
  description: "Discover popular anime online. Explore trending anime, latest releases, airing shows, top-rated series, genres, ratings, and trailers.",
  keywords: ["anisolo", "anime", "trending anime", "latest anime", "anime genres", "watch anime", "anime database", "watch anme for free", "anime website", "free anime website", "free anime streaming website", "watch anime online",
    "anime online",
    "anime streaming",
    "free anime streaming",
    "watch anime free",
    "stream anime online",
    "online anime website",
    "anime streaming website",
    "anime episodes",
    "watch anime episodes",
    "latest anime episodes",
    "new anime releases",
    "latest anime",
    "upcoming anime",
    "trending anime",
    "popular anime",
    "best anime",
    "anime series",
    "anime movies",
    "anime database",
    "anime search",
    "discover anime",
    "anime recommendations",
    "anime genres",
    "action anime",
    "adventure anime",
    "romance anime",
    "comedy anime",
    "fantasy anime",
    "isekai anime",
    "slice of life anime",
    "drama anime",
    "horror anime",
    "sci-fi anime",
    "shonen anime",
    "seinen anime",
    "shojo anime",
    "josei anime",
    "subbed anime",
    "dubbed anime",
    "anime sub and dub",
    "English dubbed anime",
    "English subbed anime",
    "anime with English subtitles",
    "anime in Japanese",
    "anime in English",
    "anime watch online",
    "anime streaming in HD",
    "anime episode guide",
    "anime release schedule",
    "anime ratings",
    "anime synopsis",
    "anime characters",
    "anime seasons",
    "anime watchlist",
    "anisolo",
    "anisolo anime",
    "anisolo anime streaming"],
  authors: [{ name: "anisolo Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "anisolo - Anime Discovery & watch for free",
    description: "Trending, latest and top-rated anime with free streaming",
    url: "https://anisolo.com",
    siteName: "anisolo",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "anisolo",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-SV52LYFHGG"></script>
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-SV52LYFHGG');
        `,
      }}
    />
    <script data-cfasync="false" src="https://abscloud.org/1/e4a2afc17e81dd3713d8b5bd1fe9e809"></script>
    <script
        src="https://bauval.org/14/3fffd5b9235a0e48b5622b9d490327e6"
        data-cfasync="false"
        strategy="afterInteractive" // Options: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload'
      />
  </head>

      <body style={{ margin: 0, padding: 0, backgroundColor: '#000000', color: '#ffffff' }}>

        <header className="dashboard-header" style={{ display: 'flex', justifySelf: "center", justifyContent: 'space-between', alignItems: 'center', padding: '5px 3%', backgroundColor: 'rgba(21, 21, 21, 0.3)', border: "1px solid rgba(204, 204, 204, 0.4) ", backdropFilter: "blur(8px)", position: 'fixed', top: '3px', zIndex: 99, width: '90%', borderRadius: "50px" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: "5px" }} >
            <Link style={{ display: 'flex', justifySelf: "center", alignItems: 'center' }} href="/home"><Image width={45} height={35} alt='Logo' loading="lazy" unoptimized src='/LOGOanisolo.png' /></Link>
            <Link className='lefnavlinks' style={{ display: 'flex', justifySelf: "center", alignItems: 'center', fontSize: "15px", color: '#e0e0e0', textDecoration: 'none', fontWeight: '600', marginLeft: '20px', marginRight: '15px' }} href="/home">Home</Link>


            <Link prefetch={false} href="/anime?sort=TRENDING_DESC" className="nav-link" style={{ fontSize: "15px", color: '#e0e0e0', textDecoration: 'none', fontWeight: '600', marginRight: '15px' }}>Trending</Link>
            <Link prefetch={false} href="/anime?status=RELEASING&sort=START_DATE_DESC" className="nav-link" style={{ fontSize: "15px", color: '#e0e0e0', textDecoration: 'none', fontWeight: '600', marginRight: '15px' }}>Airing</Link>
            <div className="nav-link"><Link style={{ height: '17.33px', fontSize: "15px", color: '#e0e0e0', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', marginRight: '15px' }} prefetch={false} href="/Saved"><FaHeart style={{ color: 'white' }} /><p style={{ marginLeft: '10px' }}>Saved</p></Link></div>
            <span style={{ marginRight: '15px' }} className="lefnavlinks" ><Categorybt /></span>

          </div>
          <nav className="dashboard-nav" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* The Search Button */}
            <GlobalSearch />

            <Link style={{ display: 'flex', alignItems: 'center' }} className='disc' prefetch={false} href="https://discord.gg/qK4vjRrUQ" target="_blank" ><Image width={30} height={30} alt='discord' loading="lazy" unoptimized src='/discord.png' /></Link>

            {/* <div className='installbt'><Installbt /></div> */}
            <Hamburger className="hamburger" />
          </nav>
        </header>





        {/* Google Analytics */}





        <TopLoader />
        {children}

        <Footer />

      </body>

    </html>
  );
}




