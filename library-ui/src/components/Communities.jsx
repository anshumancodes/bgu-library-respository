import { BookDashed, Library } from "lucide-react";
import { useState, useEffect } from "react";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCommunities() {
      try {
        const res = await fetch(
          "http://10.120.4.59:8080/server/api/core/communities/580ad82b-1e94-479a-b3b2-1066d84734b9/subcommunities"
        );
        const data = await res.json();
        const comms = data._embedded?.subcommunities || [];

        // Fetch all collections for each subcommunity in parallel
        const commsWithCollections = await Promise.all(
          comms.map(async (c) => {
            let collectionsCount = 0;
            try {
              const colRes = await fetch(c._links.collections.href);
              const colData = await colRes.json();
              collectionsCount = colData._embedded?.collections?.length || 0;
            } catch {
              collectionsCount = 0;
            }

            return {
              id: c.uuid,
              name: c.name,
              collectionsCount,
              uri: `http://10.120.4.59:4000/communities/${c.uuid}`,
            };
          })
        );

        // Sort alphabetically
        commsWithCollections.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCommunities(commsWithCollections);
      } catch (err) {
        console.error("Error loading communities:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCommunities();
  }, []);

  return (
    <section className="card" id="communities">
      <div className="card-header">
        <h2 className="card-title flex items-center gap-2">
          <Library /> Academic Communities
        </h2>
        <p className="card-subtitle text-gray-500">
          Explore research by academic departments
        </p>
      </div>

      <div className="card-content max-h-[500px] overflow-y-auto">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading communities...</p>
        ) : communities.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No communities found.</p>
        ) : (
          communities.map((c) => (
            <div
              key={c.id}
              onClick={() => window.open(c.uri, "_blank")}
              className="community-card p-4 mb-3 bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <BookDashed className="text-blue-500 w-6 h-6" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{c.name}</h3>
                  <p className="text-sm text-gray-500">
                    {c.collectionsCount} collections
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
