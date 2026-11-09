
import Link from "next/link";
import { FaInstagram,FaFacebook,FaTiktok, FaDiscord } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {

    return(
        <div style={{marginTop:"40px", backgroundImage:"linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.92)), url(https://static0.srcdn.com/wordpress/wp-content/uploads/2026/03/yuji-itadori-in-jujutsu-kaisen-season-3-episode-9.jpg?w=1600&h=1200&fit=crop)",backgroundPosition:"center"}}>
            <div  style={{display:"flex", justifyContent:"space-between",padding:" 20px 10%",textAlign:"left",color:"white"}} className="footer-container">
                <div><h3>Discover</h3>
    
                <p className="discovers"><Link href="/anime?status=RELEASING&sort=START_DATE_DESC">Latest</Link></p>
                <p className="discovers"><Link href="/anime?sort=TRENDING_DESC&status=RELEASING">Trending</Link></p>
                <p className="discovers"><Link href="/anime?sort=POPULARITY_DESC&status=RELEASING">Popular</Link></p>
                <p className="discovers"><Link href="/anime?sort=SCORE_DESC&status=RELEASING">Top Rated</Link></p>
                <p className="discovers"><Link href="/categories/Action">Genres</Link></p></div>

                <div><h3>Save</h3>
                <p className="discovers"><Link href="/anime?sort=START_DATE_DESC&status=NOT_YET_RELEASED">Upcoming</Link></p>
                <p className="discovers"><Link href="/Saved">Saved</Link></p>
                </div>

                <div>
                <h3>Reach us</h3><div style={{display:"flex",gap:"10px",flexDirection:"column",alignItems:"center",fontSize:"25px"}} className="social-icons">
                <Link href="https://www.instagram.com/anisolo_com?exln=NDZyenFwMW9jZDU2" target="_blank"><FaInstagram/></Link>
                <Link href="https://www.tiktok.com/@anisolo___?_r=1&_t=ZP-9Als4l0FhBX" target="_blank"><FaTiktok/></Link>
                <Link href="https://discord.gg/qK4vjRrUQ" target="_blank"><FaDiscord/></Link></div></div>
                
            </div>
            <Image style={{display:"flex",justifySelf:"center",backdropFilter:"drop-shadow(0 0 10px rgba(252, 252, 252, 0.92))"}} alt='Logo' loading="lazy" unoptimized  src="/LOGOanisolo1.png" width={180} height={180} />
            <footer className="portal-footer" style={{
          padding: "20px",
          color:" #777777",
          fontSize: "0.9rem"
        }}>
        <p style = {{textAlign:"center",fontWeight:"600"}} className="footer-text">Copyright© 2026 anisolo. Anime data provided by AniList. All rights reserved.</p>
        <p style={{textAlign:"center"}}>This website does not store any content. All content is provided by 3rd party sites</p>
      </footer>
        <style>{`
    .footer-container a{
        color: white;
        text-decoration: underline;
    }
        .footer-container a:hover{
        color: #A020F0;
        
    }
        `}</style>
        </div>      
    )
}
