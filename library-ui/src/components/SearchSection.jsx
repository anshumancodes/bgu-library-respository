import { useState } from "react";
import { searchPublications } from "../utils/dspace";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchPublications(query);
      const formatted = data.map((obj) => {
        const md = obj._embedded.indexableObject?.metadata || {};
        return {
          id: obj._embedded.indexableObject?.uuid,
          title: md["dc.title"]?.[0]?.value || "Untitled",
          author: md["dc.contributor.author"]?.[0]?.value || "Unknown",
        };
      });
      setResults(formatted);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="search-section card">
      <div className="card-header">
        <h2 className="card-title">
          <span>🔍</span> Explore Repository
        </h2>
        <p className="card-subtitle">
          Search through thousands of academic resources
        </p>
      </div>
      <div className="card-content">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            className="search-input"
            placeholder="Search publications, authors, keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="filter-tags">
          <span
            className="filter-tag active"
            onClick={() => {
              setQuery("");
              handleSearch();
            }}
          >
            All
          </span>
          <span className="filter-tag">Research Papers</span>
          <span className="filter-tag">Theses</span>
          <span className="filter-tag">Datasets</span>
        </div>

        {/* Results */}
        <div className="search-results">
          {loading && <p>Loading...</p>}
          {!loading && results.length === 0 && (
            <p>No results. Try another keyword.</p>
          )}
          {results.map((r) => (
            <div key={r.id} className="search-item">
              <h4>{r.title}</h4>
              <p>👤 {r.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
