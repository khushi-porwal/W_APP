import {
    User,
    Mail,
    Phone,
    Calendar,
    BadgeCheck,
} from "lucide-react";

function CustomerCard({ order }) {

    return (

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">

                    <User
                        className="text-indigo-600"
                        size={24}
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold">

                        Customer Information

                    </h2>

                    <p className="text-gray-500 text-sm">

                        Customer details

                    </p>

                </div>

            </div>

            {/* Customer Details */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Name */}

                <div className="flex items-start gap-3">

                    <User
                        size={20}
                        className="text-indigo-600 mt-1"
                    />

                    <div>

                        <p className="text-gray-500 text-sm">

                            Full Name

                        </p>

                        <h3 className="font-semibold text-lg">

                            {order.user?.name || "N/A"}

                        </h3>

                    </div>

                </div>

                {/* Email */}

                <div className="flex items-start gap-3">

                    <Mail
                        size={20}
                        className="text-indigo-600 mt-1"
                    />

                    <div>

                        <p className="text-gray-500 text-sm">

                            Email

                        </p>

                        <h3 className="font-semibold">

                            {order.user?.email || "N/A"}

                        </h3>

                    </div>

                </div>

                {/* Phone */}

                <div className="flex items-start gap-3">

                    <Phone
                        size={20}
                        className="text-indigo-600 mt-1"
                    />

                    <div>

                        <p className="text-gray-500 text-sm">

                            Phone

                        </p>

                        <h3 className="font-semibold">

                            {order.address?.phone || "N/A"}

                        </h3>

                    </div>

                </div>

                {/* Customer ID */}

                <div className="flex items-start gap-3">

                    <BadgeCheck
                        size={20}
                        className="text-indigo-600 mt-1"
                    />

                    <div>

                        <p className="text-gray-500 text-sm">

                            Customer ID

                        </p>

                        <h3 className="font-semibold break-all">

                            {order.user?._id || "N/A"}

                        </h3>

                    </div>

                </div>

                {/* Account Created */}

                <div className="flex items-start gap-3 md:col-span-2">

                    <Calendar
                        size={20}
                        className="text-indigo-600 mt-1"
                    />

                    <div>

                        <p className="text-gray-500 text-sm">

                            Member Since

                        </p>

                        <h3 className="font-semibold">

                            {

                                order.user?.createdAt

                                    ? new Date(
                                          order.user.createdAt
                                      ).toLocaleDateString(
                                          "en-IN",
                                          {
                                              day: "2-digit",
                                              month: "long",
                                              year: "numeric",
                                          }
                                      )

                                    : "N/A"

                            }

                        </h3>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default CustomerCard;