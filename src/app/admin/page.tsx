"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Image {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  keywords: string;
  createdAt: string;
  updatedAt: string;
}

interface ImageFormData {
  imageUrl: string;
  title: string;
  description: string;
  keywords: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ImageFormData>({
    imageUrl: "",
    title: "",
    description: "",
    keywords: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Verify admin access
  useEffect(() => {
    const adminCode = localStorage.getItem("admin_code");
    if (!adminCode) {
      router.replace("/entry");
      return;
    }

    // Verify admin code
    const verifyAdmin = async () => {
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: adminCode }),
      });
      const data = await res.json();
      if (!data.valid || !data.admin) {
        router.replace("/entry");
      } else {
        fetchImages();
      }
    };

    verifyAdmin();
  }, [router]);

  // Fetch images
  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/images");
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();
      setImages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to load images. Please try again!");
      setLoading(false);
    }
  };

  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for creating a new image
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      imageUrl: "",
      title: "",
      description: "",
      keywords: "",
    });
    setShowModal(true);
  };

  // Open modal for editing an existing image
  const openEditModal = (image: Image) => {
    setEditingId(image.id);
    setFormData({
      imageUrl: image.imageUrl,
      title: image.title,
      description: image.description,
      keywords: image.keywords,
    });
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        // Update existing image
        const res = await fetch(`/api/images/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed to update image");
      } else {
        // Create new image
        const res = await fetch("/api/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed to create image");
      }

      // Refresh images list and close modal
      fetchImages();
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to save image. Please try again!");
    }
  };

  // Delete an image
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const res = await fetch(`/api/images/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete image");

        fetchImages();
      } catch (error) {
        console.error("Error deleting image:", error);
        setError("Failed to delete image. Please try again!");
      }
    }
  };

  return (
    <div className="min-h-screen p-6 text-[var(--color-text)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">✨ Miaw Admin Dashboard</h1>
          <button
            onClick={openCreateModal}
            className="rounded bg-pink-600 px-4 py-2 font-bold text-white shadow-md transition-colors hover:bg-pink-700"
          >
            ➕ Add New Image
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded bg-red-500/20 p-3 text-center text-pink-300">
            🚫 {error}
          </p>
        )}

        {loading ? (
          <div className="text-center">
            <p className="text-xl">🐱 Loading images...</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-[var(--color-bg-secondary)] shadow-md">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="border-b border-pink-500/20">
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Keywords</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {images.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">
                      No images found 😿 Add your first image!
                    </td>
                  </tr>
                ) : (
                  images.map((image) => (
                    <tr
                      key={image.id}
                      className="border-b border-pink-500/10 hover:bg-[var(--color-accent)]"
                    >
                      <td className="p-3">
                        <div className="h-20 w-20 overflow-hidden rounded">
                          <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/cat.png";
                            }}
                          />
                        </div>
                      </td>
                      <td className="p-3">{image.title}</td>
                      <td className="max-w-[200px] overflow-hidden p-3 text-ellipsis">
                        {image.description}
                      </td>
                      <td className="p-3">{image.keywords}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => openEditModal(image)}
                            className="rounded bg-blue-600 px-3 py-1 text-white transition-colors hover:bg-blue-700"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(image.id)}
                            className="rounded bg-red-600 px-3 py-1 text-white transition-colors hover:bg-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-[var(--color-bg-secondary)] p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">
              {editingId ? "✏️ Edit Image" : "✨ Add New Image"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-1 block">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full rounded border border-pink-300 bg-transparent px-3 py-2 text-white placeholder-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded border border-pink-300 bg-transparent px-3 py-2 text-white placeholder-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  placeholder="Image title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded border border-pink-300 bg-transparent px-3 py-2 text-white placeholder-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  placeholder="Describe this image"
                  rows={3}
                />
              </div>
              <div className="mb-6">
                <label className="mb-1 block">Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full rounded border border-pink-300 bg-transparent px-3 py-2 text-white placeholder-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  placeholder="cat,cute,funny"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded border border-pink-300 px-4 py-2 text-pink-300 transition-colors hover:bg-pink-300/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-pink-600 px-4 py-2 text-white transition-colors hover:bg-pink-700"
                >
                  {editingId ? "Update" : "Add"} Image 🐾
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
