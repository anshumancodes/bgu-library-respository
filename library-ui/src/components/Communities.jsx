import { useState, useEffect } from "react";
import { getCommunities, getCollections } from "../utils/dspace";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCommunities() {
      try {
        const comms = await getCommunities();

        // fetch collections count for each community
        const commsWithCounts = await Promise.all(
          comms.map(async (c) => {
            let collections = [];
            try {
              collections = await getCollections(c.uuid);
            } catch (err) {
              console.warn(`No collections for ${c.name}`, err);
            }
            return {
              id: c.uuid,
              name: c.name,
              itemsCount: c.numberOfItems || 0,
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
            <h2 className="card-title">🏛️ Academic Communities</h2>
            <p className="card-subtitle">
              Explore research by academic departments
            </p>
          </div>
          <div className="view-toggle">
            <button className="view-btn active">📋</button>
            <button className="view-btn">🔳</button>
          </div>
        </div>
      </div>

      <div className="card-content">
        {loading && <p>Loading...</p>}
        {!loading && communities.length === 0 && (
          <p>No communities found.</p>
        )}

        {communities.map((c) => (
          <div key={c.id} className="community-card">
            <div className="community-icon">🎓</div>
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
