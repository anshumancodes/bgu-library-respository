import { useState, useEffect } from "react";
import { login, logout} from "../utils/dspace";
import { Bell, Search } from "lucide-react";
import Login from "./Login";

export default function Header() {
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // Handle login
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setShowLoginPopup(false);
    } catch (err) {
      alert("Login failed! Please check your credentials.");
      console.error(err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <header className="header">
        <nav className="nav-container">
          <div className="logo">
            <div className="logo-icon">
              <img src="BGU-Logo.jpg" alt="Birla Global University" />
            </div>
          </div>

          <div className="nav-links">
            <a href="#">Communities & Collections</a>
            <a href="#">Browse Repository</a>
            <a href="#">Statistics</a>
          </div>

          <div className="nav-right">
            <button className="icon-btn">
              <Search />
            </button>
            <button className="icon-btn">
              <Bell />
            </button>
            {user ? (
              <>
                <span style={{ marginRight: "1rem" }}>
                  👋 {user.name || "User"}
                </span>
                <button className="login-btn" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : (
              <button
                className="login-btn"
                onClick={() => setShowLoginPopup(true)}
              >
                Log In
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Render login popup only when open */}
      {showLoginPopup && (
        <Login
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          onLogin={handleLogin}
        />
      )}
    </>
  );
}
