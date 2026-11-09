

import Link from 'next/link';
import Bannerad from "../../../components/BannerAd";
import Image from "next/image";
import Catrow from "../../../components/catrow";
import Filters from "../../../components/filters";


export async function generateMetadata({ params, searchParams }) {
  const { category, idnum } = await params;
  const { type } = await searchParams;

  const label = type === "tv" ? "TV Shows" : "Movies";

  return {
    title: `${category} ${label} | anisolo`,
    description: `Watch the best ${category} ${label.toLowerCase()} online on anisolo. Updated regularly with new releases.`,
    keywords: [`${label} category`,`${category} ${label}`,`${category} ${label} anisolo`, "streaming", "free movies"],
    alternates: {
      canonical: `https://anisolo.com/categories/${category}/${idnum}?type=${type || "movie"}&country=&sortby=popularity.desc`,
    },
  };
}


async function fetchMoviesData(pageNumber,genres,type ,country,sortby) {
  const apiKey = process.env.TMDB_API_KEY;
  const baseUrl = 'https://api.themoviedb.org/3';
  const today = new Date().toISOString().split('T')[0];
  
  
  
  // Changed sort_by to popularity.desc and added vote_count filtering
    const url =`${baseUrl}/discover/${type}?api_key=${apiKey}&with_origin_country=${country}&sort_by=${sortby}&release_date.lte=${today}&include_adult=true&vote_count.gte=5&page=${pageNumber}&with_genres=${genres}`;
  
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch filtered movies collection.');
  const data = await res.json();
  
  return {
    results: data.results || [],
    totalPages: Math.min(data.total_pages || 1, 500)
  };
}
export default async function MoviesCategoryPage({ searchParams,params}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || '1', 10));
  const {idnum}= await params;
  const {category} = await params;
  const {type} = await searchParams;
  const {country} = await searchParams;
  const {sortby} = await searchParams;

  
  const { results: movies, totalPages } = await fetchMoviesData(currentPage,idnum,type,country,sortby);
  const imgPrefix = "https://image.tmdb.org/t/p/w342";

  
  return (
    
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '80px',paddingTop:"60px" }}>
      <div ><Catrow idnum={idnum} type={type} country={country} sortby={sortby}/></div>
      <Filters idnum={idnum} category={category} types={type} countrys={country} sortbys={sortby}/>
      {/* Grid Feed Area */}
      <main style={{ padding: '20px 4% 0 4%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #222', paddingBottom: '15px' }}>
          
          <h1 style={{display:"flex",flexDirection:"column", fontSize: '2rem', color: '#ffffff', fontWeight: '700', margin: 0 }}>
            <span style={{color:"#A020F0"}}>{category} <span style={{color:"#e8e6e6"}}>{(type == "movie") ? ("Movies"):("TV Shows")}</span></span> 
          </h1>
          <span style={{ color: '#aaa', fontWeight: '600', fontSize: '1rem', backgroundColor: '#222', padding: '6px 14px', borderRadius: '20px' }}>
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Media Grid */}
        <div className='media-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }}>
  {movies.slice(0, 20).map(movie => (
    <Link prefetch={false} href={`/watch/${movie.id}?type=${type}`} key={movie.id} style={{ textDecoration: 'none', color: 'white', display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', width: '100%', aspectRatio: '2/3', backgroundColor: '#222' }}>
        <Image  width={342} height={513} loading="lazy" unoptimized  src={movie.poster_path ? `${imgPrefix}${movie.poster_path}` : 'https://placehold.co/500x750?text=No+Poster'} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.8)', padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', color: '#ffb606', fontWeight: 'bold' }}>★ {movie.vote_average?.toFixed(1) || 'NR'}</span>
      </div>
      <h3 style={{ fontSize: '0.95rem', fontWeight: '600', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '10px 0 0 0', lineHeight: '1.2' }}>{movie.title}</h3>
    </Link>
  ))}
</div>
        {/* Pagination Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '50px' }}>
          {currentPage > 1 ? (
            <Link prefetch={false}
              href={`/categories/${category}/${idnum}?type=${type}&country=${country}&sortby=${sortby}&page=${currentPage - 1}`}
              style={{ backgroundColor: '#222', color: '#fff', border: '1px solid #444', textDecoration: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95rem' }}
            >
              ← Previous
            </Link>
          ) : (
            <span style={{ backgroundColor: '#181818', color: '#555', border: '1px solid #222', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'not-allowed' }}>
              ← Previous
            </span>
          )}

          <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {currentPage}
          </span>
          {currentPage < totalPages ? (<span  style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem' }}>
            • • •  {totalPages}
          </span>): <span></span>}

          {currentPage < totalPages ? (
            <Link prefetch={false}
              href={`/categories/${category}/${idnum}?type=${type}&country=${country}&sortby=${sortby}&page=${currentPage + 1}`}
              style={{ backgroundColor: '#A020F0', color: '#fff', textDecoration: 'none', padding: '10px 28px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 10px rgba(229, 9, 20, 0.2)' }}
            >
              Next →
            </Link>
          ) : (
            <span style={{ backgroundColor: '#181818', color: '#555', border: '1px solid #222', padding: '10px 28px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'not-allowed' }}>
              Next →
            </span>
          )}
        </div>
        {/*<NativeAd/>*/}
        <Bannerad/>
      </main>

    </div>
  );
}