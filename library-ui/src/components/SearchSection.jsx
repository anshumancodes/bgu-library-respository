import { useState } from "react";
import { User, Search, Filter } from "lucide-react";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const [subject, setSubject] = useState("");
  const [entityType, setEntityType] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  const filters = [
    { label: "All", apiField: null },
    { label: "Title", apiField: "title" },
    { label: "Author", apiField: "author" },
    { label: "Subject", apiField: "subject" },
    { label: "Year", apiField: "dateIssued" },
    { label: "Entity Type", apiField: "entityType" },
  ];

  const handleSearch = async (filterLabel = "All") => {
    if (!query.trim() && filterLabel === "All") {
      setResults([]);
      return;
    }

    setLoading(true);
    setActiveFilter(filterLabel);

    try {
      const selected = filters.find((f) => f.label === filterLabel);
      const apiField = selected?.apiField;

      const data = await searchPublications({
        query,
        filterField: apiField,
        subject,
        entityType,
        yearFrom,
        yearTo,
      });

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
    <section className="search-section card" id="browse">
      <div className="card-header">
        <h2 className="card-title flex items-center gap-2">
          <Search /> Explore Repository
        </h2>
        <p className="card-subtitle text-gray-500">
          Search through thousands of academic resources
        </p>
      </div>

      <div className="card-content">
        {/* Search Input */}
        <div className="search-container flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md"
            placeholder="Search publications, authors, keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(activeFilter)}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handleSearch(activeFilter)}
          >
            Search
          </button>
        </div>

        {/* Filter tags */}
        <div className="filter-tags flex flex-wrap gap-2 mb-4">
          {filters.map((f) => (
            <span
              key={f.label}
              className={`px-3 py-1 rounded-full border cursor-pointer ${
                activeFilter === f.label
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
              onClick={() => handleSearch(f.label)}
            >
              {f.label}
            </span>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="advanced-filters bg-gray-50 p-3 rounded-md border mb-4 space-y-3">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Advanced Filters</span>
          </div>

          <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-3">
            {/* Subject */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Subject</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Machine Learning"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Entity Type */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Entity Type
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
              >
                <option value="">All</option>
                <option value="Publication">Publication</option>
                <option value="Dataset">Dataset</option>
                <option value="Thesis">Thesis</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Year Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="From"
                  className="w-1/2 p-2 border rounded-md"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="To"
                  className="w-1/2 p-2 border rounded-md"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="search-results space-y-3 max-h-96 overflow-y-auto">
          {loading && <p>Loading...</p>}
          {!loading && results.length === 0 && <p>No results found.</p>}

          {results.map((r) => (
            <div
              key={r.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer"
              onClick={() => {
                const uri =
                  r.metadata?.["dc.identifier.uri"]?.[0]?.value || r.selfHref;
                if (uri) window.open(uri, "_blank");
                else alert("No link available for this publication.");
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

// Utility function


export async function searchPublications({
  query,
  filterField,
  subject,
  entityType,
  yearFrom,
  yearTo,
}) {
  const BASE_URL = "http://10.120.4.59:8080";
  const params = new URLSearchParams();

  // --- ADVANCED SEARCH ---
  const hasAdvancedFilters =
    subject || entityType || (yearFrom && yearTo);

  if (hasAdvancedFilters) {
    // Use `query` parameter for combined filtering
    let queryParts = [];

    if (query) queryParts.push(query);
    if (subject) queryParts.push(subject);
    if (entityType) queryParts.push(entityType);
    if (yearFrom && yearTo)
      queryParts.push(`dateIssued:[${yearFrom} TO ${yearTo}]`);

    const queryString = queryParts.join(" AND ");
    params.append("query", queryString || "*");
  } else {
    // --- BASIC SEARCH ---
    if (filterField && query)
      params.append(`f.${filterField}`, `${query},contains`);
    else if (query)
      params.append("query", query);
  }

  // Common DSpace params
  params.append("size", 20);
  params.append("sort", "score,desc");

  try {
    const response = await fetch(
      `${BASE_URL}/server/api/discover/search/objects?${params.toString()}`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

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

