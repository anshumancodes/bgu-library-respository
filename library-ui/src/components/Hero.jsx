import { useState, useEffect } from "react";
import {
  getTotalItems,
  getTotalCollections,
  getTotalAuthors,
  getTotalDownloads,
} from "../utils/dspace.js";

export default function Hero() {
  const [stats, setStats] = useState({
    items: 0,
    authors: 0,
    collections: 0,
    downloads: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [items, authors, collections, downloads] = await Promise.all([
          getTotalItems(),
          getTotalAuthors(),
          getTotalCollections(),
          getTotalDownloads(),
        ]);
        setStats({ items, authors, collections, downloads });
      } catch (err) {
        console.error("Error loading stats", err);
      }
    }
    loadStats();
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span>Institutional Repository</span>
        </div>
        
          <h1>Repository of Birla Global University</h1>
          <p className="hero-subtitle">
            Advancing Knowledge Through Digital Scholarship - An Initiative By Central Library , Birla Global University
          </p>
         
     

        {/* Feature cards stay the same */}

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-number">{stats.items.toLocaleString()}</span>
            <span className="stat-label">Publications</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {stats.authors.toLocaleString()}
            </span>
            <span className="stat-label">Researchers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {stats.collections.toLocaleString()}
            </span>
            <span className="stat-label">Departments</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {stats.downloads.toLocaleString()}
            </span>
            <span className="stat-label">Downloads</span>
          </div>
        </div>
      </div>
    </section>
  );
}
