import { useState, useEffect } from "react";
import { Menu, X, Bell, Search } from "lucide-react";
import { login, logout, getCurrentUser } from "../utils/dspace";
import Login from "./Login";

export default function Header() {
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setShowLoginPopup(false);
    } catch (err) {
      alert("Login failed! Please check your credentials.");
    }
  };

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
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 transition-all">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          {/* Logo */}
          <div className="flex items-center gap-3 hover:scale-105 transition-transform">
            <div className="relative md:w-full  h-10 md:h-24 rounded overflow-hidden shadow-md">
              <img
                src="BGU-Logo.jpg"
                alt="Birla Global University"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-gray-700 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all hover:text-blue-600"
            >
              Communities & Collections
            </a>
            <a
              href="#"
              className="text-gray-700 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all hover:text-blue-600"
            >
              Browse Repository
            </a>
            <a
              href="#"
              className="text-gray-700 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all hover:text-blue-600"
            >
              Statistics
            </a>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              <Search size={18} />
            </button>
          

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-gray-700">
                  👋 {user.name || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginPopup(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                Log In
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-600 hover:text-white transition-all"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/80 backdrop-blur-md border-t border-gray-200 px-6 py-4 space-y-4 flex flex-col">
            <a href="#" className="text-gray-700 font-medium hover:text-blue-600">
              Communities & Collections
            </a>
            <a href="#" className="text-gray-700 font-medium hover:text-blue-600">
              Browse Repository
            </a>
            <a href="#" className="text-gray-700 font-medium hover:text-blue-600">
              Statistics
            </a>
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all w-full"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => setShowLoginPopup(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all w-full"
              >
                Log In
              </button>
            )}
          </div>
        )}
      </header>

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
