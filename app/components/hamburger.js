"use client"; // Required for interactivity/useState in Next.js App Router

import { useState } from "react";
import { FaBars,FaTimes,FaHeart } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Categorybt from '../components/Categorybt2';
import Installbt from '../components/installbt';

export default function ToggleBarComponent() {
  // 1. Create a state variable to track visibility
  const [isVisible, setIsVisible] = useState(false);

  // 2. Toggle state function
  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="hamburger">
       <div  className='hambar' style={{transition:"ease-in-out",zIndex:'999'}}
            onClick={handleToggle}
        ><FaBars/></div>
      
    
      {/* Conditional Rendering of the Bar */}
      {isVisible && (
        
        <div  className="leftbar" style={{animation:'slide 0.3s ease-in-out',position:"fixed",top:'0px',right:"0px",display:"flex",flexDirection:"column",gap:"20px",padding:'15px',borderRadius:'10px',width:'30vh', height:"80vh",backgroundColor:"rgba(0, 0, 0)",zIndex:'99',}}>
            <div  className='hambar' style={{transition:"ease-in-out",position:'absolute',right:'20px',zIndex:'999'}}
            onClick={handleToggle}
        ><FaTimes/></div>
          <Link onClick={handleToggle}  style={{marginTop:'30px',height:'17.33px',fontSize:"15px",color: '#e0e0e0', textDecoration: 'none', fontWeight: '600',display:'flex',alignItems:'center'}} prefetch={false} href="/Saved"><FaHeart style={{color:'white'}}/><p style={{marginLeft:'10px'}}>Saved Items</p></Link>
          <Categorybt />
          <Link onClick={handleToggle} prefetch={false} href="/anime?sort=TRENDING_DESC"  style={{fontSize:"15px",color: '#e0e0e0', textDecoration: 'none', fontWeight: '600' }}>Trending Anime</Link>
          <Link onClick={handleToggle} prefetch={false} href="/anime?status=RELEASING&sort=START_DATE_DESC" style={{ fontSize:"15px",color: '#e0e0e0', textDecoration: 'none', fontWeight: '600' }}>Airing Now</Link>
          <Link onClick={handleToggle} prefetch={false} href="/anime?format=MOVIE&sort=POPULARITY_DESC" style={{ fontSize:"15px",color: '#e0e0e0', textDecoration: 'none', fontWeight: '600' }}>Anime Movies</Link>
          <Link onClick={handleToggle} style={{display:'flex',alignItems:'center'}} prefetch={false} href="https://discord.gg/MdUnDapQd" target="_blank" ><Image width={30} height={30} alt='discord' loading="lazy"  unoptimized src='../discord.png'  /><p style={{marginLeft:'5px',color:"white"}}>Join Discord</p></Link>
          <Installbt/>
        </div>
    
      )}
      {isVisible &&(
        <div onClick={handleToggle} style={{position:"fixed",top:'0px',bottom:'0px',left:'0px',rigt:'0px',width:'100vh',height:'100vh'}}></div>
      )}
    </div>
  );
}
