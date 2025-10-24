import { useState, useEffect } from "react";


export default function Submissions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const results = await getRecentSubmissions();
        const formatted = results.map((obj) => {
          const md = obj._embedded.indexableObject?.metadata || {};
          return {
            id: obj._embedded.indexableObject?.uuid,
            title: md["dc.title"]?.[0]?.value || "Untitled",
            author: md["dc.contributor.author"]?.[0]?.value || "Unknown",
          };
        });
        setItems(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="card mt-10">
      <div className="card-header">
        <h2 className="card-title">📈 Recent Submissions</h2>
        <p className="card-subtitle">Latest research contributions</p>
      </div>

      <div className="card-content">
        {loading && <p>Loading...</p>}
        {!loading && items.length === 0 && <p>No submissions found.</p>}

        {items.map((item) => (
          <div key={item.id} className="submission-item">
            <div className="submission-thumb"></div>
            <div className="submission-info">
              <a href="#" className="submission-title">
                {item.title}
              </a>
              <div className="submission-meta">👤 {item.author}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
