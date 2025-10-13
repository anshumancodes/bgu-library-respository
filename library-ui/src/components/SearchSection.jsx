import { useState } from "react";
import { User, Search } from "lucide-react";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Research Papers", "Theses", "Datasets"];

  const handleSearch = async (filter = "All") => {
    if (!query.trim() && filter === "All") {
      setResults([]);
      return;
    }

    setLoading(true);
    setActiveFilter(filter);

    try {
      const data = await searchPublications(query, filter);
      const formatted = data.map((obj) => ({
        id: obj.id,
        title: obj.title,
        author: obj.author,
        selfHref: obj.selfHref,
        metadata: obj.metadata,
      }));
      setResults(formatted);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="search-section card">
      <div className="card-header">
        <h2 className="card-title flex items-center gap-2">
          <Search /> Explore Repository
        </h2>
        <p className="card-subtitle text-gray-500">
          Search through thousands of academic resources
        </p>
      </div>

      <div className="card-content">
        {/* Search input */}
        <div className="search-container flex gap-2 mb-4">
          <input
            type="text"
            className="search-input flex-1 p-2 border rounded-md"
            placeholder="Search publications, authors, keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(activeFilter)}
          />
          <button
            className="search-btn px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handleSearch(activeFilter)}
          >
            Search
          </button>
        </div>

        {/* Filter tags */}
        <div className="filter-tags flex gap-2 mb-4">
          {filters.map((f) => (
            <span
              key={f}
              className={`filter-tag px-3 py-1 rounded-full border ${
                activeFilter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              } cursor-pointer`}
              onClick={() => handleSearch(f)}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Results */}
        <div
          className="search-results space-y-3 max-h-96 overflow-y-auto"
        >
          {loading && <p>Loading...</p>}
          {!loading && results.length === 0 && (
            <p>No results. Try another keyword.</p>
          )}

          {results.map((r) => (
            <div
              key={r.id}
              className="search-item p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              onClick={() => {
                const uri =
                  r.metadata?.["dc.identifier.uri"]?.[0]?.value || r.selfHref;
                if (uri) {
                  window.open(uri, "_blank");
                } else {
                  alert("No link available for this publication.");
                }
              }}
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-1">
                {r.title}
              </h4>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <User className="w-4 h-4 text-gray-400" /> {r.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Utility function to search publications
export async function searchPublications(query) {
  if (!query || !query.trim()) return [];

  const url = `http://10.120.4.59:8080/server/api/discover/search/objects?query=${encodeURIComponent(
    query.trim()
  )}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();
    return (data._embedded?.searchResult?._embedded?.objects || []).map(
      (obj) => {
        const md = obj._embedded.indexableObject?.metadata || {};
        return {
          id: obj._embedded.indexableObject?.uuid,
          title: md["dc.title"]?.[0]?.value || "Untitled",
          author: md["dc.contributor.author"]?.[0]?.value || "Unknown",
          selfHref: obj._embedded.indexableObject?._links?.self?.href,
          metadata: md,
        };
      }
    );
  } catch (err) {
    console.error("Error fetching search results:", err);
    return [];
  }
}
