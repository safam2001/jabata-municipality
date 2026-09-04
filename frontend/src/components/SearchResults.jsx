import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search).get("query").toLowerCase();

  const data = [
    { name_en: "Home", name_ar: "الرئيسية", path: "/" },

    { name_en: "Citizen Services", name_ar: "خدمات المواطنين", path: "/services/citizens" },
    { name_en: "Martyrs Services", name_ar: "خدمات الشهداء", path: "/services/martyrs" },
    { name_en: "Special Needs", name_ar: "ذوي الاحتياجات الخاصة", path: "/services/special-needs" },
    { name_en: "Village Services", name_ar: "خدمات القرى", path: "/services/villages" },
    { name_en: "Town Services", name_ar: "خدمات البلدة", path: "/services/town" },
    { name_en: "Electronic Services", name_ar: "الخدمات الإلكترونية", path: "/services/electronic" },
    { name_en: "News", name_ar: "الأخبار", path: "/news" },
    { name_en: "Media", name_ar: "الإعلام", path: "/media" },
    { name_en: "About Us", name_ar: "من نحن", path: "/about" },
    { name_en: "Contact Us", name_ar: "اتصل بنا", path: "/contact" },
  ];

  const results = data.filter(item =>
    item.name_en.toLowerCase().includes(query) ||
    item.name_ar.toLowerCase().includes(query)
  );

  return (
    <>
    {/* <div className="search-page">
      <h2>Results for: {query}</h2>
      {results.length > 0 ? (
        <ul className="search-list">
          {results.map((item) => (
            <li key={item.path} onClick={() => navigate(item.path)}>
              {item.name_en} — {item.name_ar}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div> */}
    <div className="search-page">
  <h2>Results for: {query}</h2>
  {results.length > 0 ? (
    <div className="cards-container">
      {results.map((item) => (
        <div key={item.path} className="search-card" onClick={() => navigate(item.path)}>
          <h3>{item.name_en}</h3>
          <p>{item.name_ar}</p>
        </div>
      ))}
    </div>
  ) : (
    <p>No results found.</p>
  )}
</div>
    
    
    </>
  );
};

export default SearchResults;