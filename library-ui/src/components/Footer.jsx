export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>About Repository</h3>
            <p>
              Birla Global University's institutional repository preserves and
              shares scholarly works.
            </p>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <div className="footer-links">
              <a href="#">User Guide</a>
              <a href="#">FAQ</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Birla Global University. Powered by DSpace API </span>
          <span>Developed and Maintained By : <a href="">ape labs</a></span>
          <div className="coar-badge">🏛️ COAR Notify</div>
        </div>
      </div>
    </footer>
  );
}
