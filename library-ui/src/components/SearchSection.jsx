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
        <h2 className="card-title">
          <Search /> Explore Repository
        </h2>
        <p className="card-subtitle">
          Search through thousands of academic resources
        </p>
      </div>

      <div className="card-content">
        {/* Search input */}
        <div className="search-container">
          <div className="search-icon">
            <Search />
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search publications, authors, keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(activeFilter)}
          />
          <button
            className="search-btn"
            onClick={() => handleSearch(activeFilter)}
          >
            Search
          </button>
        </div>

        {/* Filter tags */}
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

        {/* Results */}
        <div
          className="search-results"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {loading && <p>Loading...</p>}
          {!loading && results.length === 0 && (
            <p>No results. Try another keyword.</p>
          )}

          {results.map((r) => (
            <div
              key={r.id}
              className="search-item p-4 mb-3 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              onClick={async () => {
                try {
                  // Fetch full item info to get bitstream
                  const res = await fetch(r.selfHref);
                  const itemData = await res.json();

                  // Get first bitstream in first bundle
                  const bitstreamUrl =
                    itemData?.bundles?._embedded?.bundles?.[0]?._embedded
                      ?.bitstreams?.[0]?._links?.self?.href;

                  if (bitstreamUrl) {
                    window.open(bitstreamUrl, "_blank");
                  } else {
                    alert("No file available for this publication.");
                  }
                } catch (err) {
                  console.error("Error opening file:", err);
                  alert("Unable to open file.");
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
      (obj) => ({
        id: obj._embedded.indexableObject?.uuid,
        title:
          obj._embedded.indexableObject?.metadata?.["dc.title"]?.[0]?.value ||
          "Untitled",
        author:
          obj._embedded.indexableObject?.metadata?.[
            "dc.contributor.author"
          ]?.[0]?.value || "Unknown",
        selfHref: obj._embedded.indexableObject?._links?.self?.href,
      })
    );
  } catch (err) {
    console.error("Error fetching search results:", err);
    return [];
  }
}
