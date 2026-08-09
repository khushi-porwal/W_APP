function CouponTable({

    coupons,

    onEdit,

    onDelete,

    onToggleStatus,

}) {

    return (

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="p-4">Code</th>

                        <th>Discount</th>

                        <th>Minimum</th>

                        <th>Maximum</th>

                        <th>Usage</th>

                        <th>Expiry</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        coupons.map((coupon) => (

                            <tr
                                key={coupon._id}
                                className="border-b text-center hover:bg-gray-50"
                            >

                                {/* Coupon Code */}

                                <td className="font-semibold">

                                    {coupon.code}

                                </td>

                                {/* Discount */}

                                <td>

                                    {coupon.discountPercentage}%

                                </td>

                                {/* Minimum Amount */}

                                <td>

                                    ₹{coupon.minimumAmount}

                                </td>

                                {/* Maximum Discount */}

                                <td>

                                    ₹{coupon.maxDiscount}

                                </td>

                                {/* Usage */}

                                <td>

                                    {coupon.usedCount} / {coupon.usageLimit}

                                </td>

                                {/* Expiry */}

                                <td>

                                    {new Date(
                                        coupon.expiryDate
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}

                                </td>

                                {/* Status */}

                                <td>

                                    <button
                                        onClick={() => onToggleStatus?.(coupon._id)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition cursor-pointer
                                        ${
                                            coupon.isActive
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-red-100 text-red-700 hover:bg-red-200"
                                        }`}
                                    >

                                        {coupon.isActive
                                            ? "Active"
                                            : "Inactive"}

                                    </button>

                                </td>

                                {/* Actions */}

                                <td>

                                    <div className="flex justify-center gap-2">

                                        <button
                                            onClick={() => onEdit(coupon)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                        >

                                            Edit

                                        </button>

                                        <button
                                            onClick={() => onDelete(coupon)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >

                                            Delete

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default CouponTable;