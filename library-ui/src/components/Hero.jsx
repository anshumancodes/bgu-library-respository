import { useState, useEffect } from "react";
import {
  getTotalItems,
  getTotalAuthors,
  getTotalCollections,
  getTotalsubjects,
} from "../utils/stats.js";


export default function Hero() {
  const [stats, setStats] = useState({
    communities: 0,
    authors: 0,
    collections: 0,
    subjects: 0,
  });

 useEffect(() => {
  async function loadStats() {
    try {
      const [items, authors, collections, subjects] = await Promise.all([
        getTotalItems(),
        getTotalAuthors(),
        getTotalCollections(),
        getTotalsubjects(),
      ]);

      setStats({
        communities: items,
        authors,
        collections,
        subjects
      });
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  }
  loadStats();
}, []);


  return (
    <section className="hero">
      <div className="hero-content text-center max-w-4xl mx-auto py-16">
        <div className="hero-badge mb-4">
          
            Institutional Repository
          
        </div>

        <h1 className="text-4xl font-bold mb-3">
          Repository of Birla Global University
        </h1>

        <p className=" text-gray-600 mb-10">
          Advancing Knowledge Through Digital Scholarship - An Initiative by
          Central Library, Birla Global University
        </p>

        {/* Stats Row */}
        <div className="stats-row grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
          <div className="stat-item">
            <span className="stat-number text-3xl font-bold text-blue-700 block">
              {stats.communities.toLocaleString()}
            </span>
            <span className="stat-label">Communities</span>
          </div>

          <div className="stat-item">
            <span className="stat-number text-3xl font-bold text-blue-700 block">
              {stats.authors.toLocaleString()}
            </span>
            <span className="stat-label ">Researchers</span>
          </div>

          <div className="stat-item">
            <span className="stat-number text-3xl font-bold text-blue-700 block">
              {stats.collections.toLocaleString()}
            </span>
            <span className="stat-label ">Collections</span>
          </div>

          <div className="stat-item">
            <span className="stat-number text-3xl font-bold text-blue-700 block">
              {stats.subjects.toLocaleString()}
            </span>
            <span className="stat-label ">Subjects</span>
          </div>
        </div>
      </div>
    </section>
  );
}
