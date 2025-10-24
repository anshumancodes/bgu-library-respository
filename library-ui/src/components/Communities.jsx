import { BookDashed, Library } from "lucide-react";
import { useState, useEffect } from "react";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCommunities() {
      try {
        const res = await fetch("http://10.120.4.59:8080/server/api/core/communities");
        const data = await res.json();

        const comms = data._embedded?.communities || [];

        const commsWithCounts = await Promise.all(
          comms.map(async (c) => {
            let collections = [];
            try {
              const colRes = await fetch(c._links.collections.href);
              const colData = await colRes.json();
              collections = colData._embedded?.collections || [];
            } catch (err) {
              console.warn(`No collections for ${c.name}`, err);
            }

            // Try to get the URI link from metadata, fallback to handle path
            const uri =
             
              `http://10.120.4.59:4000/communities/${c.uuid}`;

            return {
              id: c.uuid,
              name: c.name,
              itemsCount: c.archivedItemsCount >= 0 ? c.archivedItemsCount : 0,
              collectionsCount: collections.length,
              uri,
            };
          })
        );

        setCommunities(commsWithCounts);
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
        <div className="communities-header">
          <div>
            <h2 className="card-title flex items-center gap-2">
              <Library /> Academic Communities
            </h2>
            <p className="card-subtitle">
              Explore research by academic departments
            </p>
          </div>
        </div>
      </div>

      <div className="card-content max-h-[500px] overflow-y-auto">
        {loading && <p>Loading...</p>}
        {!loading && communities.length === 0 && <p>No communities found.</p>}

        {communities.map((c) => (
          <div
            key={c.id}
            onClick={() => window.open(c.uri, "_blank")}
            className="community-card p-4 mb-3 bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="community-icon text-blue-500">
                  <BookDashed className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {c.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {c.itemsCount} items • {c.collectionsCount} collections
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
