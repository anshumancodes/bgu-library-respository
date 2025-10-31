import { Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function Submissions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "http://10.120.4.59:8080/server/api/discover/browses/dateissued/items?size=5"
        );
        const data = await res.json();
        const results = data?._embedded?.items || [];

        const formatted = results.map((obj) => {
          const md = obj.metadata || {};
          return {
            id: obj.uuid,
            title: md["dc.title"]?.[0]?.value || "Untitled",
            author: md["dc.contributor.author"]?.[0]?.value || "Unknown",
            year: md["dc.date.issued"]?.[0]?.value || "N/A",
            link: md["dc.identifier.uri"]?.[0]?.value || "#",
          };
        });

        setItems(formatted);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section className="card mt-10">
      <div className="card-header">
        <h2 className="card-title"><Calendar/> Recent Submissions</h2>
        <p className="card-subtitle">Latest research contributions</p>
      </div>

      <div
        className="card-content overflow-y-auto"
        style={{
          maxHeight: "300px",
          scrollbarWidth: "thin",
          scrollbarColor: "#999 #f0f0f0",
        }}
      >
        {loading && <p>Loading...</p>}
        {!loading && items.length === 0 && <p>No submissions found.</p>}

        {items.map((item) => (
          <div
            key={item.id}
            className="submission-item flex gap-3 py-2 border-b border-gray-200"
          >
            <div className="submission-info">
              <a
                href={item.link}
                className="submission-title font-semibold text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.title}
              </a>
              <div className="submission-meta text-sm text-gray-600">
                <User/> {item.author} • <Calendar/> {item.year}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
