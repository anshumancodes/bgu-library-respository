import { useState } from "react";
// import { searchPublications } from "../utils/dspace";
import { User,Search } from "lucide-react";
export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const handleSearch = async (filter = "All") => {
    if (!query.trim() && filter === "All") {
      setResults([]);
      return;
    }

    setLoading(true);
    setActiveFilter(filter);

    try {
      const data = await searchPublications(query, filter);
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
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filters = ["All", "Research Papers", "Theses", "Datasets"];

  return (
    <section className="search-section card">
      <div className="card-header">
        <h2 className="card-title">
          <span><Search/></span> Explore Repository
        </h2>
        <p className="card-subtitle">
          Search through thousands of academic resources
        </p>
      </div>

      <div className="card-content">
        <div className="search-container">
          <div className="search-icon"><Search/></div>
          <input
            type="text"
            className="search-input"
            placeholder="Search publications, authors, keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(activeFilter)}
          />
          <button className="search-btn" onClick={() => handleSearch(activeFilter)}>
            Search
          </button>
        </div>

        <div className="filter-tags">
          {filters.map((f) => (
            <span
              key={f}
              className={`filter-tag ${activeFilter === f ? "active" : ""}`}
              onClick={() => handleSearch(f)}
            >
              {f}
            </span>
          ))}
        </div>

        <div
          className="search-results"
          style={{
            maxHeight: "400px", // make results scrollable if too long
            overflowY: "auto",
          }}
        >
          {loading && <p>Loading...</p>}
          {!loading && results.length === 0 && <p>No results. Try another keyword.</p>}

          {results.map((r) => (
            <div key={r.id} className="search-item">
              <h4>{r.title}</h4>
              <p><User/> {r.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export async function searchPublications(query) {
  if (!query || !query.trim()) return [];

  const url = `http://10.120.4.59:8080/server/api/discover/search/objects?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    // Navigate to the actual search results
    return data._embedded?.searchResult?._embedded?.objects || [];
  } catch (err) {
    console.error("Error fetching search results:", err);
    return [];
  }
}
