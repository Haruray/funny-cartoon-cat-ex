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
      <div className="mt-8 flex w-full max-w-2xl flex-col items-center">
        <h1 className="mb-4 text-center text-3xl font-bold">
          ✨ Miaw Image Search ✨
        </h1>
        <form
          onSubmit={handleSearch}
          className="flex w-full flex-col items-center"
        >
          <textarea
            className="mb-4 min-h-[80px] w-full resize-none rounded border border-pink-300 bg-[var(--color-bg-secondary)] px-4 py-2 text-white placeholder-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none"
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
      <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {images.map((url, i) => (
          <div
            key={url + i}
            className="cursor-pointer overflow-hidden rounded-lg bg-[var(--color-bg-secondary)] shadow-lg transition-transform duration-200 hover:scale-105"
            onClick={() => setModalUrl(url)}
          >
            <img
              src={url}
              alt="Result"
              className="h-40 w-full object-cover object-center"
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
            className="flex w-full max-w-2xl flex-col items-center rounded-lg bg-[var(--color-bg-secondary)] p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalUrl}
              alt="Large preview"
              className="mb-4 max-h-[70vh] w-auto rounded"
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
