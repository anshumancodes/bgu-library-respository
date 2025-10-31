import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 transition-all">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          {/* Logo */}
          <div className="flex items-center gap-3 hover:scale-105 transition-transform">
            <div className="relative md:w-full h-10 md:h-24 rounded overflow-hidden shadow-md">
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
              href="#communities"
              className="text-gray-700 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all hover:text-blue-600"
            >
              Communities & Collections
            </a>
            <a
              href="#browse"
              className="text-gray-700 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all hover:text-blue-600"
            >
              Browse Repository
            </a>
            <a
              href=""
              className="text-gray-700 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all hover:text-blue-600"
            >
              Statistics
            </a>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
           

            <a
              href="http://10.120.4.59:4000/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              Log In
            </a>

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
            <a href="#communities" className="text-gray-700 font-medium hover:text-blue-600">
              Communities & Collections
            </a>
            <a href="#browse" className="text-gray-700 font-medium hover:text-blue-600">
              Browse Repository
            </a>
            <a href="#" className="text-gray-700 font-medium hover:text-blue-600">
              Statistics
            </a>
            <a
              href="http://10.120.4.59:4000/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all w-full text-center"
            >
              Log In
            </a>
          </div>
        )}
      </header>
    </>
  );
}
