"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const tvGenres = [
    { id: 10759, name: "Action-Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 10762, name: "Kids" },
    { id: 9648, name: "Mystery" },
    { id: 10763, name: "News" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi-and-Fantasy" },
    { id: 10766, name: "Soap" },
    { id: 10767, name: "Talk" },
    { id: 10768, name: "War-&-Politics" },
    { id: 37, name: "Western" },
];

const categories = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science-Fiction" },
    { id: 10770, name: "TV-Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
];

const selectStyle = {
    background: "#2a2a2a",
    color: "white",
    border: "1px solid #000000",
    borderRadius: "20px",
    padding: "12px 12px",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
    textalign: "center",
    width: "fit-content",
};

const typefil = ["movie", "tv"];
const countries = [
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "JP", label: "Japan" },
    { value: "KR", label: "South Korea" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
    { value: "IT", label: "Italy" },
    { value: "ES", label: "Spain" },
    { value: "PT", label: "Portugal" },
    { value: "NL", label: "Netherlands" },
    { value: "BE", label: "Belgium" },
    { value: "SE", label: "Sweden" },
    { value: "NO", label: "Norway" },
    { value: "DK", label: "Denmark" },
    { value: "FI", label: "Finland" },
    { value: "PL", label: "Poland" },
    { value: "RU", label: "Russia" },
    { value: "UA", label: "Ukraine" },
    { value: "TR", label: "Turkey" },
    { value: "GR", label: "Greece" },
    { value: "IE", label: "Ireland" },
    { value: "CH", label: "Switzerland" },
    { value: "AT", label: "Austria" },
    { value: "CZ", label: "Czech Republic" },
    { value: "HU", label: "Hungary" },
    { value: "RO", label: "Romania" },

    { value: "IN", label: "India" },
    { value: "PK", label: "Pakistan" },
    { value: "BD", label: "Bangladesh" },
    { value: "CN", label: "China" },
    { value: "HK", label: "Hong Kong" },
    { value: "TW", label: "Taiwan" },
    { value: "TH", label: "Thailand" },
    { value: "VN", label: "Vietnam" },
    { value: "PH", label: "Philippines" },
    { value: "ID", label: "Indonesia" },
    { value: "MY", label: "Malaysia" },
    { value: "SG", label: "Singapore" },

    { value: "CA", label: "Canada" },
    { value: "MX", label: "Mexico" },
    { value: "BR", label: "Brazil" },
    { value: "AR", label: "Argentina" },
    { value: "CO", label: "Colombia" },
    { value: "CL", label: "Chile" },

    { value: "AU", label: "Australia" },
    { value: "NZ", label: "New Zealand" },

    { value: "EG", label: "Egypt" },
    { value: "NG", label: "Nigeria" },
    { value: "ZA", label: "South Africa" },
    { value: "KE", label: "Kenya" },
    { value: "MA", label: "Morocco" },

    { value: "SA", label: "Saudi Arabia" },
    { value: "AE", label: "UAE" },
    { value: "IL", label: "Israel" },
    { value: "IR", label: "Iran" },
    { value: "LB", label: "Lebanon" },
];

const sortby = [
    { value: "popularity.desc", label: "Popular" },
    { value: "primary_release_date.desc", label: "Latest" }, // movie
    { value: "vote_average.desc", label: "Top Rated" },
];
export default function ({ idnum, category, types, countrys, sortbys }) {
    const [type, settype] = useState(types);
    const [country, setcountry] = useState(countrys);
    const [sort, setsort] = useState(sortbys);
    const [idname, setidname] = useState(idnum);
    const [catname, setcatname] = useState(category);


    const handlechange = (e) => {
        settype(e.target.value);
        const list = e.target.value == "movie" ? categories : tvGenres;
        const check = list.find(g => (g).id === idname);

        if (check) {
            setidname(check.id);
            setcatname(check.name);
        }
        else {

            if (e.target.value === "movie") {
                setidname(28);
                setcatname("Action");
            } else {
                setidname(10759);
                setcatname("Action-Adventure");
            }
        }
    };


    return (

        <div className="filterbtns" style={{ display: "flex", width: "95vw", justifySelf: "center", justifyContent: "center", gap: "10px" }}>
             <div style={{display: "flex",justifySelf: "center", justifyContent: "center", gap: "10px"}}><div>
                <select value={type} style={selectStyle} onChange={handlechange}>
                    {typefil.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select></div>

            <div>
                <select value={country} style={selectStyle} onChange={(e) => setcountry(e.target.value)}>
                    <option value="">All countries</option>
                    {countries.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select></div>
            <div>
                <select value={sort} style={selectStyle} onChange={(e) => setsort(e.target.value)}>

                    {sortby.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select></div></div>

                    <div  style={{display: "flex",justifySelf: "center", justifyContent: "center", gap: "10px"}}>
            <Link href={`/categories/${catname}/${idname}?type=${type}&country=${country}&sortby=${sort}`} style={{ fontSize: "14px", cursor: "pointer", padding: "10px", backgroundColor: "#A020F0", border: "none", borderRadius: "20px", color: "white", display: "flex", alignItems: "center" }}>
                Apply Filters
            </Link>
            <Link href={`/categories/Action/28?type=movie&country=&sortby=popularity.desc`} style={{ fontSize: "14px", cursor: "pointer", padding: "10px", backgroundColor: "#252525", border: "none", borderRadius: "20px", color: "#A020F0", display: "flex", alignItems: "center" }}>
                Remove Filters
            </Link></div>
        </div>
    );
}