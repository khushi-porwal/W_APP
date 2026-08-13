import { useState } from "react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { addCategory, updateCategory } from "../../services/categoryService";

function CategoryModal({
  open,

  setOpen,

  fetchCategories,

  selectedCategory,
}) {
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Category name is required");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);

      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      let response;

      if (selectedCategory) {
        response = await updateCategory(selectedCategory._id, formData);
      } else {
        response = await addCategory(formData);
      }

      toast.success(response.message);

      fetchCategories();

      setOpen(false);

      setName("");

      setDescription("");

      setImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }

    useEffect(() => {
      if (selectedCategory) {
        setName(selectedCategory.name);
        setDescription(selectedCategory.description);
      } else {
        setName("");
        setDescription("");
        setImage(null);
      }
    }, [selectedCategory]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[450px] p-6">
        <h2 className="text-2xl font-bold mb-6">
          {selectedCategory ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Category Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Description</label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Category Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {loading
                ? "Saving..."
                : selectedCategory
                  ? "Update Category"
                  : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;
