import {
    ArrowLeft,
    Check,
    MapPin,
    Plus,
    ShoppingBag,
    Truck,
    X,
} from "lucide-react";

import {
    useContext,
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import Navbar from "../../../components/common/Navbar";

import {
    CartContext,
} from "../../../context/CartContext";

import {
    addAddress,
    getMyAddresses,
} from "../../../services/addressService";

import {
    placeOrder,
} from "../../../services/orderService";


const initialAddressForm = {
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
};


function Checkout() {
    const {
        cartItems,
        totalItems,
        totalAmount,
        fetchCart,
    } = useContext(CartContext);

    const navigate = useNavigate();


    // ==========================================
    // ADDRESS STATE
    // ==========================================

    const [addresses, setAddresses] =
        useState([]);

    const [
        selectedAddress,
        setSelectedAddress,
    ] = useState("");

    const [
        addressLoading,
        setAddressLoading,
    ] = useState(true);

    const [
        showAddressForm,
        setShowAddressForm,
    ] = useState(false);

    const [
        addressForm,
        setAddressForm,
    ] = useState(initialAddressForm);

    const [
        addingAddress,
        setAddingAddress,
    ] = useState(false);


    // ==========================================
    // ORDER STATE
    // ==========================================

    const [
        paymentMethod,
        setPaymentMethod,
    ] = useState("CashOnDelivery");

    const [couponCode, setCouponCode] =
        useState("");

    const [placingOrder, setPlacingOrder] =
        useState(false);


    // ==========================================
    // FETCH ADDRESSES
    // ==========================================

    const fetchAddresses = async () => {
        try {
            setAddressLoading(true);

            const response =
                await getMyAddresses();

            console.log(
                "ADDRESS RESPONSE:",
                response
            );

            const addressList =
                response?.data?.addresses || [];

            setAddresses(addressList);

            const defaultAddress =
                addressList.find(
                    (address) =>
                        address.isDefault
                );

            if (defaultAddress) {
                setSelectedAddress(
                    defaultAddress._id
                );
            } else if (
                addressList.length > 0
            ) {
                setSelectedAddress(
                    addressList[0]._id
                );
            }
        } catch (error) {
            console.error(
                "FETCH ADDRESS ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to fetch addresses"
            );
        } finally {
            setAddressLoading(false);
        }
    };


    // ==========================================
    // FETCH ON PAGE LOAD
    // ==========================================

    useEffect(() => {
        fetchAddresses();
    }, []);


    // ==========================================
    // HANDLE ADDRESS INPUT
    // ==========================================

    const handleAddressChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setAddressForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };


    // ==========================================
    // ADD NEW ADDRESS
    // ==========================================

    const handleAddAddress = async (
        event
    ) => {
        event.preventDefault();

        const {
            fullName,
            phone,
            street,
            city,
            state,
            pincode,
            country,
        } = addressForm;

        if (
            !fullName.trim() ||
            !phone.trim() ||
            !street.trim() ||
            !city.trim() ||
            !state.trim() ||
            !pincode.trim() ||
            !country.trim()
        ) {
            toast.error(
                "Please fill all address fields"
            );

            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            toast.error(
                "Phone number must contain 10 digits"
            );

            return;
        }

        if (!/^[0-9]{6}$/.test(pincode)) {
            toast.error(
                "Pincode must contain 6 digits"
            );

            return;
        }

        try {
            setAddingAddress(true);

            const response = await addAddress(
                addressForm
            );

            toast.success(
                response.message ||
                    "Address added successfully"
            );

            const newAddress =
                response?.data;

            setAddressForm(
                initialAddressForm
            );

            setShowAddressForm(false);

            await fetchAddresses();

            if (newAddress?._id) {
                setSelectedAddress(
                    newAddress._id
                );
            }
        } catch (error) {
            console.error(
                "ADD ADDRESS ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to add address"
            );
        } finally {
            setAddingAddress(false);
        }
    };


    // ==========================================
    // PLACE ORDER
    // ==========================================

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error(
                "Please select a delivery address"
            );

            return;
        }

        if (cartItems.length === 0) {
            toast.error(
                "Your cart is empty"
            );

            return;
        }

        try {
            setPlacingOrder(true);

            const orderData = {
                address: selectedAddress,
                paymentMethod,
            };

            if (couponCode.trim()) {
                orderData.couponCode =
                    couponCode
                        .trim()
                        .toUpperCase();
            }

            console.log(
                "ORDER DATA:",
                orderData
            );

            const response = await placeOrder(
                orderData
            );

            console.log(
                "PLACE ORDER RESPONSE:",
                response
            );

            toast.success(
                response.message ||
                    "Order placed successfully"
            );

            await fetchCart();

            navigate(
                `/order-success/${response.data._id}`
            );
        } catch (error) {
            console.error(
                "PLACE ORDER ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to place order"
            );
        } finally {
            setPlacingOrder(false);
        }
    };


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(price);
    };


    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
                    >
                        <ArrowLeft size={18} />

                        Back to cart
                    </Link>


                    <div className="mt-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Secure checkout
                        </p>

                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                            Checkout
                        </h1>

                        <p className="mt-3 text-slate-600">
                            Complete your delivery and
                            payment details.
                        </p>
                    </div>


                    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                        <div className="space-y-6">
                            {/* ADDRESS SECTION */}

                            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-950">
                                            Delivery address
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Select where you
                                            want your order
                                            delivered.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowAddressForm(
                                                true
                                            )
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <Plus size={17} />

                                        Add address
                                    </button>
                                </div>


                                {addressLoading ? (
                                    <div className="mt-6 space-y-3">
                                        {[1, 2].map(
                                            (item) => (
                                                <div
                                                    key={
                                                        item
                                                    }
                                                    className="h-36 animate-pulse rounded-2xl bg-slate-100"
                                                />
                                            )
                                        )}
                                    </div>
                                ) : addresses.length ===
                                  0 ? (
                                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                                        <MapPin
                                            size={30}
                                            className="mx-auto text-slate-400"
                                        />

                                        <p className="mt-3 font-semibold text-slate-950">
                                            No address added
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Add a delivery
                                            address to continue.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        {addresses.map(
                                            (address) => {
                                                const isSelected =
                                                    selectedAddress ===
                                                    address._id;

                                                return (
                                                    <button
                                                        key={
                                                            address._id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedAddress(
                                                                address._id
                                                            )
                                                        }
                                                        className={`relative rounded-2xl border p-5 text-left transition ${
                                                            isSelected
                                                                ? "border-slate-950 bg-slate-50 ring-1 ring-slate-950"
                                                                : "border-slate-200 hover:border-slate-400"
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-white">
                                                                <Check
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                            </span>
                                                        )}

                                                        <div className="flex items-center gap-2">
                                                            <MapPin
                                                                size={
                                                                    18
                                                                }
                                                                className="text-slate-500"
                                                            />

                                                            <p className="font-bold text-slate-950">
                                                                {
                                                                    address.fullName
                                                                }
                                                            </p>
                                                        </div>

                                                        {address.isDefault && (
                                                            <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                                Default
                                                            </span>
                                                        )}

                                                        <p className="mt-4 text-sm leading-6 text-slate-600">
                                                            {
                                                                address.street
                                                            }
                                                            <br />

                                                            {
                                                                address.city
                                                            }
                                                            ,{" "}
                                                            {
                                                                address.state
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                address.pincode
                                                            }
                                                            <br />

                                                            {
                                                                address.country
                                                            }
                                                        </p>

                                                        <p className="mt-3 text-sm font-medium text-slate-700">
                                                            {
                                                                address.phone
                                                            }
                                                        </p>
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </section>


                            {/* PAYMENT METHOD */}

                            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <h2 className="text-xl font-bold text-slate-950">
                                    Payment method
                                </h2>

                                <div className="mt-6 space-y-3">
                                    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 p-5">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="CashOnDelivery"
                                            checked={
                                                paymentMethod ===
                                                "CashOnDelivery"
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setPaymentMethod(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <div>
                                            <p className="font-semibold text-slate-950">
                                                Cash on
                                                Delivery
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Pay when your
                                                order arrives.
                                            </p>
                                        </div>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 p-5">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Razorpay"
                                            checked={
                                                paymentMethod ===
                                                "Razorpay"
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setPaymentMethod(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <div>
                                            <p className="font-semibold text-slate-950">
                                                Online payment
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Secure payment
                                                using Razorpay.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </section>


                            {/* COUPON */}

                            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <h2 className="text-xl font-bold text-slate-950">
                                    Coupon code
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Have a coupon? Add it to
                                    your order.
                                </p>

                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(event) =>
                                        setCouponCode(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter coupon code"
                                    className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
                                />
                            </section>
                        </div>


                        {/* ORDER SUMMARY */}

                        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
                            <h2 className="text-xl font-bold text-slate-950">
                                Order summary
                            </h2>

                            <div className="mt-6 space-y-4">
                                {cartItems.map(
                                    (cartItem) => (
                                        <div
                                            key={
                                                cartItem._id
                                            }
                                            className="flex items-center justify-between gap-4 text-sm"
                                        >
                                            <span className="line-clamp-1 text-slate-600">
                                                {
                                                    cartItem
                                                        .product
                                                        .name
                                                }{" "}
                                                ×{" "}
                                                {
                                                    cartItem.quantity
                                                }
                                            </span>

                                            <span className="shrink-0 font-semibold text-slate-950">
                                                {formatPrice(
                                                    cartItem
                                                        .product
                                                        .price *
                                                        cartItem.quantity
                                                )}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="mt-6 border-t border-slate-200 pt-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">
                                        Items
                                    </span>

                                    <span className="font-semibold">
                                        {totalItems}
                                    </span>
                                </div>

                                <div className="mt-4 flex justify-between text-sm">
                                    <span className="text-slate-600">
                                        Subtotal
                                    </span>

                                    <span className="font-semibold">
                                        {formatPrice(
                                            totalAmount
                                        )}
                                    </span>
                                </div>

                                <div className="mt-4 flex justify-between text-sm">
                                    <span className="text-slate-600">
                                        Delivery
                                    </span>

                                    <span className="font-semibold text-emerald-600">
                                        Free
                                    </span>
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5">
                                    <span className="font-bold">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold">
                                        {formatPrice(
                                            totalAmount
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 rounded-2xl bg-slate-50 p-4">
                                <Truck
                                    size={20}
                                    className="shrink-0 text-slate-600"
                                />

                                <p className="text-xs leading-5 text-slate-500">
                                    Your final amount will be
                                    securely validated by the
                                    server before the order is
                                    created.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handlePlaceOrder
                                }
                                disabled={
                                    placingOrder ||
                                    !selectedAddress
                                }
                                className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {placingOrder
                                    ? "Placing order..."
                                    : `Place order • ${formatPrice(
                                          totalAmount
                                      )}`}
                            </button>
                        </aside>
                    </div>
                </div>


                {/* ADD ADDRESS MODAL */}

                {showAddressForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm">
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-950">
                                        Add delivery address
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Enter your delivery
                                        details.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAddressForm(
                                            false
                                        )
                                    }
                                    className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
                                >
                                    <X size={21} />
                                </button>
                            </div>

                            <form
                                onSubmit={
                                    handleAddAddress
                                }
                                className="mt-7 grid gap-5 sm:grid-cols-2"
                            >
                                {[
                                    [
                                        "fullName",
                                        "Full name",
                                    ],
                                    [
                                        "phone",
                                        "Phone number",
                                    ],
                                    [
                                        "city",
                                        "City",
                                    ],
                                    [
                                        "state",
                                        "State",
                                    ],
                                    [
                                        "pincode",
                                        "Pincode",
                                    ],
                                    [
                                        "country",
                                        "Country",
                                    ],
                                ].map(
                                    ([name, label]) => (
                                        <div key={name}>
                                            <label className="text-sm font-semibold text-slate-700">
                                                {label}
                                            </label>

                                            <input
                                                type="text"
                                                name={name}
                                                value={
                                                    addressForm[
                                                        name
                                                    ]
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
                                            />
                                        </div>
                                    )
                                )}

                                <div className="sm:col-span-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Street address
                                    </label>

                                    <textarea
                                        name="street"
                                        value={
                                            addressForm.street
                                        }
                                        onChange={
                                            handleAddressChange
                                        }
                                        rows={3}
                                        className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={addingAddress}
                                    className="sm:col-span-2 rounded-xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {addingAddress
                                        ? "Adding address..."
                                        : "Save address"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

export default Checkout;