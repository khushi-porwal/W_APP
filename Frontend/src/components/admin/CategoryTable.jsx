function CategoryTable({

    categories,

    onEdit,

    onDelete,

}) {

    return (

        <table className="w-full bg-white shadow rounded-lg overflow-hidden">

            <thead className="bg-gray-100">

                <tr>

                    <th className="p-4">Image</th>

                    <th>Name</th>

                    <th>Description</th>

                    <th>Status</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {

                    categories.map((category) => (

                        <tr
                            key={category._id}
                            className="border-b text-center hover:bg-gray-50"
                        >

                            <td className="p-3">

                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-16 h-16 object-cover rounded-lg mx-auto"
                                />

                            </td>

                            <td>

                                {category.name}

                            </td>

                            <td>

                                {category.description}

                            </td>

                            <td>

                                {

                                    category.isActive

                                        ? "🟢 Active"

                                        : "🔴 Inactive"

                                }

                            </td>

                            <td>

                                <button
                                    onClick={() => onEdit(category)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => onDelete(category)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

    );

}

export default CategoryTable;