import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import CategoryTable from "../../../components/admin/CategoryTable";
import CategoryModal from "../../../components/admin/CategoryModal";

import {
  getAllCategories,
  deleteCategory,
} from "../../../services/categoryService";
import DeleteCategoryModal from "../../../components/admin/DeleteCategoryModal";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteCategoryData, setDeleteCategoryData] = useState(null);

  // =========================
  // Fetch Categories
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(search, page, 5);

      setCategories(response.data.categories);

      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search, page]);

  // =========================
  // Delete Category
  // =========================

  const handleDelete = async (category) => {

    try {

        const response = await deleteCategory(category._id);

        toast.success(response.message);

        setDeleteOpen(false);

        setDeleteCategoryData(null);

        fetchCategories();

    }

    catch(error){

        toast.error(

            error.response?.data?.message ||

            "Failed to delete category"

        );

    }

};

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>

        <button
          onClick={() => {
            setSelectedCategory(null);

            setOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Category
        </button>
      </div>

      {/* Search */}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            setPage(1);
          }}
          className="w-80 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Categories */}

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold">No Categories Found</h2>

          <p className="text-gray-500 mt-2">Create your first category.</p>
        </div>
      ) : (
        <>
          <CategoryTable
            categories={categories}
            onEdit={(category) => {
              setSelectedCategory(category);

              setOpen(true);
            }}
            onDelete={(category) => {
              setDeleteCategoryData(category);

              setDeleteOpen(true);
            }}
          />

          {/* Pagination */}

          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal */}

      <CategoryModal
        open={open}
        setOpen={setOpen}
        fetchCategories={fetchCategories}
        selectedCategory={selectedCategory}
      />


      <DeleteCategoryModal

    open={deleteOpen}

    setOpen={setDeleteOpen}

    category={deleteCategoryData}

    onDelete={handleDelete}

/>
    </div>
  );
}

export default Categories;
