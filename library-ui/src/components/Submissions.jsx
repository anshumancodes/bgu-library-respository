import { Calendar, User, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Submissions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "http://10.120.4.59:8080/server/api/discover/search/objects?sort=dc.date.accessioned,DESC&page=0&size=5"
        );
        const data = await res.json();


        const results =
          data?._embedded?.searchResult?._embedded?.objects || [];

        const formatted = results.map((obj) => {
          const item = obj._embedded?.indexableObject;
          const md = item?.metadata || {};

          const title = md["dc.title"]?.[0]?.value || "Untitled";
          const author = md["dc.contributor.author"]?.[0]?.value || "Unknown";
          const dateAcc = md["dc.date.accessioned"]?.[0]?.value || null;
          const year = dateAcc ? dateAcc.slice(0, 4) : "N/A";
          const link =
            md["dc.identifier.uri"]?.[0]?.value ||
            `http://10.120.4.59:4000/handle/${item?.handle}`;

          return {
            id: item?.uuid,
            title,
            author,
            year,
            date: dateAcc || "N/A",
            link,
          };
        });

        const sorted = formatted.sort((a, b) => {
          if (a.date === "N/A") return 1;
          if (b.date === "N/A") return -1;
          return new Date(b.date) - new Date(a.date);
        });

        setItems(sorted);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section className="card sm:w-[96%] md:w-full mt-10">
      <div className="card-header flex flex-col justify-center gap-2">
        <div className="flex gap-2 items-center">
          <Calendar />
          <h2 className="card-title mt-2">Recent Submissions</h2>
        </div>
        <p className="card-subtitle">Latest research contributions</p>
      </div>

      <div className="card-content bg-blue-50 py-4 px-2">
        {loading && <p>Loading...</p>}
        {!loading && items.length === 0 && <p>No submissions found.</p>}

        {items.map((item) => (
          <a
            key={item.id}
            href={item.link}
            className="submission-item flex flex-col py-2 border-b border-gray-200 hover:bg-gray-50 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="submission-title font-semibold text-blue-600 hover:underline">
              {item.title}
            </span>
            <span className="submission-meta text-sm text-gray-600 flex items-center gap-2">
              <User className="w-4 h-4" /> {item.author} •{" "}
              <Calendar className="w-4 h-4" /> {item.year}
            </span>
          </a>
        ))}

        {/* See more button */}
        {!loading && (
          <div className="flex justify-center mt-4">
            <a
              href="http://10.120.4.59:4000/search?spc.page=1&spc.sf=dc.date.accessioned&spc.sd=DESC"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-blue-400 transition px-4 py-2 rounded-full shadow-sm"
            >
              See More
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
