"use client";
import { useState } from "react";

export default function EntryPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/validate-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: code }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.valid) {
      if (data.admin) {
        localStorage.setItem("admin_code", code);
        window.location.href = "/admin";
        return;
      }
      localStorage.setItem("super_secret_code", code);
      window.location.href = "/";
    } else {
      setError("Invalid code. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center text-[var(--color-text)]">
      <div className="flex w-full max-w-md flex-col items-center p-8">
        <img
          src="/cat.png"
          alt="Logo"
          className="mb-6 h-40 w-40 animate-bounce object-contain"
        />
        <h1 className="mb-2 text-center text-2xl font-bold">
          Miaw, Enter the secret code!
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center"
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mb-4 w-full rounded border border-pink-300 px-4 py-2 text-white placeholder-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            placeholder="Type your secret miaw code here..."
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full rounded bg-pink-600 px-4 py-2 font-bold text-white shadow-md transition-colors duration-200 hover:bg-pink-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "The web is miawing..." : "Let me in! 🐾"}
          </button>
        </form>
        {error && (
          <p className="animate-shake mt-4 text-center text-pink-300">
            🚫 Bruhhhhhh! {error} 🐱
          </p>
        )}
      </div>
    </div>
  );
}
