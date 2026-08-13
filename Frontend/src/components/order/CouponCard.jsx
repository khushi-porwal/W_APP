import { Gift, Tag, IndianRupee } from "lucide-react";

function CouponCard({ order }) {
  // =========================
  // No Coupon Applied
  // =========================

  if (!order.coupon) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Gift
              size={24}
              className="text-gray-500"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Coupon
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              No coupon was applied to this order.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Coupon Applied
  // =========================

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">

      {/* Header */}

      <div className="flex items-center gap-4 mb-6">

        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">

          <Gift
            size={24}
            className="text-green-600"
          />

        </div>

        <div>

          <h2 className="text-xl font-bold">
            Coupon Applied
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Discount applied to this order
          </p>

        </div>

      </div>

      {/* Coupon Information */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Coupon Code */}

        <div className="flex items-center gap-3">

          <Tag
            size={20}
            className="text-indigo-600"
          />

          <div>

            <p className="text-sm text-gray-500">
              Coupon Code
            </p>

            <p className="text-lg font-bold">
              {order.coupon}
            </p>

          </div>

        </div>

        {/* Discount */}

        <div className="flex items-center gap-3">

          <IndianRupee
            size={20}
            className="text-green-600"
          />

          <div>

            <p className="text-sm text-gray-500">
              Amount Saved
            </p>

            <p className="text-lg font-bold text-green-600">
              ₹{Number(order.discountAmount || 0).toFixed(2)}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CouponCard;