"use client";
import Link from 'next/link';
import Image from "next/image";
import { FaArrowAltCircleRight } from 'react-icons/fa';
import Installbt from "./components/installbt"
import Sharebts from "./components/ShareSection"

export default function WelcomePortal() {
  // A high-quality placeholder background image path (You can change this URL anytime)
  const backupHeroBg = "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";
  
  return (
    <div className="portal-container" style={{ paddingTop:"40px",backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${backupHeroBg})` }}>


      {/* Main Hero Content */}
      <main className="portal-main-content">
        <h1 className="portal-title">
          Discover and Watch any Anime For free
        </h1>
        <p className="portal-subtitle">
          Browse trending anime, popular series, and the latest releases. Watch top-rated anime across different genres, check ratings, watch trailers, and find your next favorite anime.
        </p>

        {/* Big Navigation Button */}
        <div className="portal-action-area">
          <Link href="/home" className="portal-browse-btn">
            Browse All Anime
            <span style={{height:"100%",display:"flex",justifyContent:"center",marginLeft:"7px"}}><FaArrowAltCircleRight/></span>
          </Link>
          
        </div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",textAlign:"center",marginTop:'20px'}}>
          <Sharebts title="Anisolo - Watch Anime Online – Explore Trending & Popular Anime For free" />
          </div>

      </main>



      {/* Footer Area */}
      

      {/* Basic Inline Baseline Styles — You can delete this block and replace it with your own global CSS files! */}
      <style jsx global>{`
        .portal-container {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          overflow-x: hidden;
        }

        .portal-header {
          width: 100%;
          max-width: 1200px;
          padding: 20px 40px;
          display: flex;
          justify-content: flex-start;
          box-sizing: border-box;
        }

        .portal-logo {
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: 2px;
          color: #ffffff;
        }

        .logo-accent {
          color: #A020F0; /* Streaming Red Accent */
        }

        .portal-main-content {
          text-align: center;
          max-width: 800px;
          padding: 0 20px;
          margin-bottom: 5vh;
        }

        .portal-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 20px;
          color: #ffffff;
          line-height: 1.2;
        }

        .portal-subtitle {
          font-size: 1.3rem;
          color: #e0e0e0;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .portal-browse-btn {
          display: inline-flex;
          align-items: center;
          background-color: #A020F0;
          color: #ffffff;
          text-decoration: none;
          font-size: 1.2rem;
          font-weight: bold;
          padding: 16px 36px;
          border-radius: 8px;
          transition: background-color 0.2s ease, transform 0.2s ease;
          box-shadow: 0 4px 15px #a534ec42;
        }

        .portal-browse-btn:hover {
          background-color: #9109e5;
          transform: scale(1.03);
        }

        .btn-icon {
          margin-left: 10px;
          font-size: 1.3rem;
        }

        
      `}</style>
    </div>
  );
}