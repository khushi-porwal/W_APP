import React from "react";

function Categories() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Categories
                </h1>

                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Add Category
                </button>
            </div>
        </div>
    );
}

export default Categories;