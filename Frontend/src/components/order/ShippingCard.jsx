import {
    MapPinned,
    User,
    Phone,
    MapPin,
    Globe,
    Copy,
} from "lucide-react";
import { toast } from "react-hot-toast";

function ShippingCard({ order }) {

    const address = order.address;

    // =========================
    // Copy Address
    // =========================

    const handleCopyAddress = () => {

        const fullAddress = `
${address?.fullName}
${address?.phone}
${address?.street}
${address?.city}, ${address?.state}
${address?.country} - ${address?.pincode}
        `;

        navigator.clipboard.writeText(fullAddress);

        toast.success("Address copied!");

    };

    return (

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">

                        <MapPinned
                            className="text-indigo-600"
                            size={24}
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold">

                            Shipping Address

                        </h2>

                        <p className="text-gray-500 text-sm">

                            Delivery Information

                        </p>

                    </div>

                </div>

                <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >

                    <Copy size={18} />

                    Copy Address

                </button>

            </div>

            {/* Details */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Full Name */}

                <div className="flex items-start gap-3">

                    <User
                        className="text-indigo-600 mt-1"
                        size={20}
                    />

                    <div>

                        <p className="text-sm text-gray-500">

                            Recipient

                        </p>

                        <h3 className="font-semibold">

                            {address?.fullName || "N/A"}

                        </h3>

                    </div>

                </div>

                {/* Phone */}

                <div className="flex items-start gap-3">

                    <Phone
                        className="text-indigo-600 mt-1"
                        size={20}
                    />

                    <div>

                        <p className="text-sm text-gray-500">

                            Phone

                        </p>

                        <h3 className="font-semibold">

                            {address?.phone || "N/A"}

                        </h3>

                    </div>

                </div>

                {/* Street */}

                <div className="md:col-span-2 flex items-start gap-3">

                    <MapPin
                        className="text-indigo-600 mt-1"
                        size={20}
                    />

                    <div>

                        <p className="text-sm text-gray-500">

                            Street Address

                        </p>

                        <h3 className="font-semibold">

                            {address?.street || "N/A"}

                        </h3>

                    </div>

                </div>

                {/* City */}

                <div>

                    <p className="text-sm text-gray-500">

                        City

                    </p>

                    <h3 className="font-semibold">

                        {address?.city || "N/A"}

                    </h3>

                </div>

                {/* State */}

                <div>

                    <p className="text-sm text-gray-500">

                        State

                    </p>

                    <h3 className="font-semibold">

                        {address?.state || "N/A"}

                    </h3>

                </div>

                {/* Country */}

                <div className="flex items-start gap-3">

                    <Globe
                        className="text-indigo-600 mt-1"
                        size={20}
                    />

                    <div>

                        <p className="text-sm text-gray-500">

                            Country

                        </p>

                        <h3 className="font-semibold">

                            {address?.country || "N/A"}

                        </h3>

                    </div>

                </div>

                {/* Pincode */}

                <div>

                    <p className="text-sm text-gray-500">

                        Pincode

                    </p>

                    <h3 className="font-semibold">

                        {address?.pincode || "N/A"}

                    </h3>

                </div>

            </div>

        </div>

    );

}

export default ShippingCard;