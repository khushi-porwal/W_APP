import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../../components/common/Navbar";
import { createProduct } from "../../../services/productService";

function AddProduct() {

    // =====================================
    // STATE
    // =====================================

    const [name, setName] = useState("");

    const [price, setPrice] = useState("");

    const [description, setDescription] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [stock, setStock] =
        useState("");

    const [image, setImage] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const navigate = useNavigate();

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
                !price ||
                !description.trim() ||
                !category ||
                !stock ||
                !image
            ) {

                toast.error(
                    "All fields are required"
                );

                return;

            }

            // ===============================
            // CREATE FORM DATA
            // ===============================

            const formData =
                new FormData();

            formData.append(
                "name",
                name
            );

            formData.append(
                "price",
                price
            );

            formData.append(
                "description",
                description
            );

            formData.append(
                "category",
                category
            );

            formData.append(
                "stock",
                stock
            );

            formData.append(
                "image",
                image
            );

            console.log(
                "FORM DATA READY"
            );

            // ===============================
            // API
            // ===============================

            const response =
                await createProduct(
                    formData
                );

            console.log(
                "CREATE PRODUCT RESPONSE:",
                response
            );

            toast.success(
                response.message
            );

            navigate("/products");

        } catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ||

                "Failed to create product"

            );

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

                    <h1 className="text-3xl font-bold">

                        Add Product

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Create a new product for your store.

                    </p>

                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6"
                    >

                        {/* NAME */}

                        <div>

                            <label className="font-semibold">

                                Product Name

                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter product name"
                                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                            />

                        </div>

                        {/* PRICE */}

                        <div>

                            <label className="font-semibold">

                                Price

                            </label>

                            <input
                                type="number"
                                value={price}
                                onChange={(e) =>
                                    setPrice(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter price"
                                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                            />

                        </div>

                        {/* DESCRIPTION */}

                        <div>

                            <label className="font-semibold">

                                Description

                            </label>

                            <textarea
                                rows="4"
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter description"
                                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                            />

                        </div>

                        {/* CATEGORY */}

                        <div>

                            <label className="font-semibold">

                                Category

                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Mobile">
                                    Mobile
                                </option>

                                <option value="Laptop">
                                    Laptop
                                </option>

                                <option value="Electronics">
                                    Electronics
                                </option>

                                <option value="Accessories">
                                    Accessories
                                </option>

                            </select>

                        </div>

                        {/* STOCK */}

                        <div>

                            <label className="font-semibold">

                                Stock

                            </label>

                            <input
                                type="number"
                                value={stock}
                                onChange={(e) =>
                                    setStock(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter stock"
                                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                            />

                        </div>

                        {/* IMAGE */}

                        <div>

                            <label className="font-semibold">

                                Product Image

                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setImage(
                                        e.target.files[0]
                                    )
                                }
                                className="w-full mt-2"
                            />

                            {/* PREVIEW */}

                            {image && (

                                <img
                                    src={URL.createObjectURL(
                                        image
                                    )}
                                    alt="Preview"
                                    className="mt-5 h-48 rounded-2xl object-cover border"
                                />

                            )}

                        </div>

                        {/* BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition disabled:opacity-60"
                        >

                            {loading
                                ? "Creating Product..."
                                : "Create Product"}

                        </button>

                    </form>

                </div>

            </main>

        </>

    );

}

export default AddProduct;