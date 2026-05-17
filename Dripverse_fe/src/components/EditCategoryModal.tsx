import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: any;
}

const EditCategoryModal = ({ isOpen, onClose, category }: EditCategoryModalProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category && isOpen) {
      setName(category.name || "");
      setDescription(category.description || "");
      setImageUrl(category.imageUrl || "");
      setPreview(category.imageUrl || null);
      setSelectedFile(null);
      setError(null);
    }
  }, [category, isOpen]);

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/upload/image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Image upload failed");
      return res.text();
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (payload: { name: string; description: string; imageUrl: string }) =>
      fetchWithAuth(`/categories/${category.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleClose();
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to update category.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageUrl("");
    } else {
      setPreview(imageUrl || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    setError(null);

    let finalImageUrl = imageUrl;
    if (selectedFile) {
      try {
        finalImageUrl = await uploadImageMutation.mutateAsync(selectedFile);
      } catch {
        setError("Image upload failed. Please try again.");
        return;
      }
    }

    updateCategoryMutation.mutate({ name: name.trim(), description: description.trim(), imageUrl: finalImageUrl });
  };

  const handleClose = () => {
    onClose();
  };

  const isPending = uploadImageMutation.isPending || updateCategoryMutation.isPending;

  if (!isOpen || !category) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl p-8 shadow-2xl glass border border-white/10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors text-xl leading-none bg-transparent border-none cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg">
            <span className="text-white text-2xl font-bold">✎</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Edit Category</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Update the details of the category.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="edit-cat-name" className="block text-sm font-medium text-gray-300 mb-1">
              Category Name <span className="text-blue-500">*</span>
            </label>
            <input
              id="edit-cat-name"
              type="text"
              placeholder="e.g. Hoodies, T-Shirts…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-cat-desc" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="edit-cat-desc"
              rows={3}
              placeholder="Short description of this category…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category Image
            </label>

            {/* File upload */}
            <label
              htmlFor="edit-cat-image-file"
              className="flex flex-col items-center justify-center w-full border-2 border-dashed border-white/20 rounded-lg py-5 cursor-pointer hover:border-blue-500/60 transition-colors bg-white/5"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="h-24 object-contain rounded-lg" />
              ) : (
                <>
                  <span className="text-3xl mb-2">🖼️</span>
                  <span className="text-sm text-gray-400">Click to upload an image</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP</span>
                </>
              )}
              <input
                id="edit-cat-image-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">or paste URL</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Image URL */}
            <input
              id="edit-cat-image-url"
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); setSelectedFile(null); setPreview(e.target.value || null); }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 bg-red-900/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-white/5 border border-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              {isPending ? "Updating…" : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
