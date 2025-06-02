"use client";
import { useState } from "react";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [modalUrl, setModalUrl] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setImages([]);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });
      const data = await res.json();
      if (!res.ok || !data.imageUrls) {
        setError(data.error || "Failed to search images");
        setLoading(false);
        return;
      }
      setImages(data.imageUrls);
    } catch (err) {
      setError("Failed to search images");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-6 text-[var(--color-text)]">
      <div className="w-full max-w-2xl flex flex-col items-center mt-8">
        <h1 className="mb-4 text-3xl font-bold text-center">
          ✨ Miaw Image Search ✨
        </h1>
        <form
          onSubmit={handleSearch}
          className="w-full flex flex-col items-center"
        >
          <textarea
            className="w-full rounded border border-pink-300 px-4 py-2 mb-4 text-white placeholder-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none bg-[var(--color-bg-secondary)] min-h-[80px] resize-none"
            placeholder="Describe what you're looking for..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full rounded bg-pink-600 px-4 py-2 font-bold text-white shadow-md transition-colors duration-200 hover:bg-pink-700 disabled:opacity-50"
            disabled={loading || !query.trim()}
          >
            {loading ? "Miawing..." : "Search! 🐾"}
          </button>
        </form>
        {error && (
          <p className="animate-shake mt-4 text-center text-pink-300">
            🚫 {error} 🐱
          </p>
        )}
      </div>
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
        {images.map((url, i) => (
          <div
            key={url + i}
            className="cursor-pointer rounded-lg overflow-hidden shadow-lg bg-[var(--color-bg-secondary)] hover:scale-105 transition-transform duration-200"
            onClick={() => setModalUrl(url)}
          >
            <img
              src={url}
              alt="Result"
              className="w-full h-40 object-cover object-center"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {modalUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setModalUrl(null)}
        >
          <div
            className="bg-[var(--color-bg-secondary)] p-4 rounded-lg shadow-lg max-w-2xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalUrl}
              alt="Large preview"
              className="max-h-[70vh] w-auto rounded mb-4"
            />
            <button
              className="rounded bg-pink-600 px-4 py-2 font-bold text-white shadow-md hover:bg-pink-700"
              onClick={() => setModalUrl(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
