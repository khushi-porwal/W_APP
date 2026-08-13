function DeleteCategoryModal({

    open,

    setOpen,

    category,

    onDelete,

}) {

    if (!open || !category) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-[430px] p-6">

                <h2 className="text-2xl font-bold text-red-600">

                    Delete Category

                </h2>

                <p className="mt-4 text-gray-600">

                    Are you sure you want to delete

                    <span className="font-semibold">

                        {" "}{category.name}

                    </span>

                    ?

                </p>

                <p className="text-sm text-gray-400 mt-2">

                    This action cannot be undone.

                </p>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={() => setOpen(false)}
                        className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onDelete(category)}
                        className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteCategoryModal;