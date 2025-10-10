import React, { useState } from "react";

export default function Login({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null; // Don't render if closed

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password); // Pass credentials to parent
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#5A87A1]/70 backdrop-blur-2xl"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8 w-96 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/80 hover:text-white"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold mb-6 text-center text-white drop-shadow">
          BGU - Institutional Repository
        </h1>

        <h2 className="text-xl font-semibold text-center mb-6 text-white drop-shadow">
          Login as Admin
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/70 border border-white/50 rounded-md p-2 placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/70 border border-white/50 rounded-md p-2 placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600/90 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        <label
          htmlFor="text"
          className="block text-center text-sm text-white/80 mt-4 drop-shadow-sm"
        >
          In case of malfunction or reset, contact
          <a
            href="mailto:anshumanprof01@gmail.com"
            className="text-blue-200 hover:text-blue-300 underline ml-1"
          >
            anshumanprof01@gmail.com
          </a>
        </label>
      </div>
    </div>
  );
}
