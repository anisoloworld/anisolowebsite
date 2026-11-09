'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {FaSearch, FaTimes} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef(null);


  // Auto-focus the large input field when the overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery('');
  };

  return (
    <div style={{ display: 'inline-block' }}>
      {/* Big Search Header Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'transparent',borderRadius:'6px', border: 'none', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', padding: '7px 10px', display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <FaSearch/> {/*<span style={{ fontSize: '15px', marginLeft: '6px', fontWeight: '600', color: '#e0e0e0' }}>Search</span>*/}
      </button>

      {/* Large Full-Screen Typing Overlay */}
      {isOpen && (
        
        <div className='searchbar' style={{justifySelf:"center",width:"fit-content",height:"20px", backgroundColor: 'rgb(0, 0, 0)',border: "1px solid rgba(204, 204, 204, 0.4) ", backdropFilter: "blur(8px)",borderRadius: "50px",alignItems:'center',display:'flex',gap:'10px',justifyContent:'space-between', position: 'fixed',left:'5px', right:'5px', top: '50px', zIndex: 9999, padding: '15px 10px' }}>
          

          {/* Form with Huge Interactive Typing Space */}
          <form onSubmit={handleSubmit} style={{justifyContent:"space-between", alignItems:'center',display:'flex',gap:'10px',width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent:"right" }}>
            <button 
            onClick={() => setIsOpen(false)}
            type='button'
            style={{
              textAlign:'right',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:'none',
              border:'none',
              fontSize:"24px"
            }}
          >
            <FaTimes/>
          </button>
          </div>
            <input
              ref={inputRef}
              color='white'
              type="text"
              placeholder="Search anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{background:"none",border:"none", width: '100%', color: '#ffffff', fontSize: 'clamp(0.9rem, 2vw, 1rem)', fontWeight: '700',  outline: 'none', letterSpacing: '0.5px' ,padding: '10px 30px',}}
            />
            <button type="submit" style={{ backgroundColor: '#A020F0', color: '#fff', border: 'none', borderRadius: '50px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>
              Search
            </button>
            
          </form>
        
        </div>
        
      )}
    </div>
  );
}