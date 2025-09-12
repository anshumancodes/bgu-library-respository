import { useState, useEffect } from "react";
import { getTotalItems, getItemsThisYear } from "../utils/dspace";

export default function Sidebar() {
  const [stats, setStats] = useState({ total: 0, thisYear: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const [total, thisYear] = await Promise.all([
          getTotalItems(),
          getItemsThisYear(),
        ]);
        setStats({ total, thisYear });
      } catch (err) {
        console.error("Error loading sidebar stats:", err);
      }
    }
    loadStats();
  }, []);

  return (
    <aside className="content-sidebar">
      <div className="sidebar-widget card">
        <div className="widget-header">
          <h3 className="widget-title">Repository Statistics</h3>
        </div>
        <div className="widget-content">
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="quick-stat-number">
                {stats.total.toLocaleString()}
              </span>
              <span className="quick-stat-label">Total Items</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-number">
                {stats.thisYear.toLocaleString()}
              </span>
              <span className="quick-stat-label">This Year</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-widget card">
        <div className="widget-header">
          <h3 className="widget-title">Quick Links</h3>
        </div>
        <div className="widget-content">
          <div className="footer-links">
            <u><a href="#">Submit Your Work</a></u>
          </div>
        </div>
      </div>
    </aside>
  );
}
