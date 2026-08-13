import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FolderTree } from "lucide-react";

import { getTopCategories } from "../../services/adminService";

function TopCategories() {

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {

        try {

            const response = await getTopCategories();

            setCategories(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch top categories."
            );

        }

    };

    useEffect(() => {

        fetchCategories();

    }, []);

    return (

        <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="flex items-center gap-2 mb-5">

                <FolderTree className="text-blue-500" />

                <h2 className="text-xl font-bold">

                    Top Categories

                </h2>

            </div>

            {
                categories.length === 0 ? (

                    <p className="text-gray-500">

                        No category sales found.

                    </p>

                ) : (

                    <div className="space-y-4">

                        {
                            categories.map((category) => (

                                <div
                                    key={category.category}
                                    className="flex justify-between items-center border-b pb-3"
                                >

                                    <div>

                                        <h3 className="font-semibold">

                                            {category.category}

                                        </h3>

                                    </div>

                                    <div>

                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">

                                            {category.totalSold} Sold

                                        </span>

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                )
            }

        </div>

    );

}

export default TopCategories;