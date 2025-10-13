import { Library } from "lucide-react";
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

            return {
              id: c.uuid,
              name: c.name,
              itemsCount: c.archivedItemsCount >= 0 ? c.archivedItemsCount : 0,
              collectionsCount: collections.length,
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
    <section className="card">
      <div className="card-header">
        <div className="communities-header">
          <div>
            <h2 className="card-title"> <Library/> Academic Communities</h2>
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
          <div key={c.id} className="community-card">
            <div className="community-icon"><Books/></div>
            <div className="community-name">{c.name}</div>
            <div className="community-count">
              {c.itemsCount} items • {c.collectionsCount} collections
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
