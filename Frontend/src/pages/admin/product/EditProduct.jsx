import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../../components/common/Navbar";

import {
  getSingleProduct,
  updateProduct,
} from "../../../services/productService";

function EditProduct() {
  // =====================================
  // STATE
  // =====================================

  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================
  // SUBMIT
  // =====================================

  // =====================================
  // FETCH PRODUCT
  // =====================================

  const fetchProduct = async () => {
    try {
      const response = await getSingleProduct(id);

      const product = response.data;

      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setStock(product.stock);

      setPreview(product.image);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load product");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);
  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ===============================
      // VALIDATION
      // ===============================

      if (
        !name.trim() ||
        !description.trim() ||
        price === "" ||
        stock === "" ||
        !category
      ) {
        toast.error("All fields are required");

        setLoading(false);

        return;
      }
      // ===============================
      // CREATE FORM DATA
      // ===============================

      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("stock", stock);

      // Image is optional while updating
      if (image) {
        formData.append("image", image);
      }

      // ===============================
      // API
      // ===============================

      const response = await updateProduct(id, formData);

      toast.success(response.message);

      navigate("/products");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };
  // =====================================
  // UI
  // =====================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold">Edit Product</h1>

          <p className="text-slate-500 mt-2">Update product details.</p>

          {/* FORM */}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* NAME */}

            <div>
              <label className="font-semibold">Product Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* PRICE */}

            <div>
              <label className="font-semibold">Price</label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="font-semibold">Description</label>

              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="font-semibold">Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">Select Category</option>

                <option value="Mobile">Mobile</option>

                <option value="Laptop">Laptop</option>

                <option value="Electronics">Electronics</option>

                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* STOCK */}

            <div>
              <label className="font-semibold">Stock</label>

              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Enter stock"
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* IMAGE */}

            <div>
              <label className="font-semibold">Product Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full mt-2"
              />

              {/* PREVIEW */}

              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="mt-5 h-48 rounded-2xl object-cover border"
                />
              ) : preview ? (
                <img
                  src={preview}
                  alt="Product"
                  className="mt-5 h-48 rounded-2xl object-cover border"
                />
              ) : null}
            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition disabled:opacity-60"
            >
              {loading ? "Updating Product..." : "Update Product"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default EditProduct;
