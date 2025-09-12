import { useState, useEffect } from "react";
import { login, logout, getCurrentUser } from "../utils/dspace";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkUser() {
      const u = await getCurrentUser();
      setUser(u);
    }
    checkUser();
  }, []);

  const handleLogin = async () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    try {
      await login(email, password);
      const u = await getCurrentUser();
      setUser(u);
    } catch (err) {
      alert("Login failed!");
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
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
          <button className="icon-btn">🔍</button>
          <button className="icon-btn">🔔</button>
          {user ? (
            <>
              <span style={{ marginRight: "1rem" }}>
                👋 {user?.name || "User"}
              </span>
              <button className="login-btn" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              Log In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
