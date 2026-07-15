import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import toast from "react-hot-toast";

import { AuthContext } from "./AuthContext";

import {
    deleteCart,
    getCart,
    updateCart,
} from "../services/cartService";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    const [cartItems, setCartItems] = useState([]);

    const [totalItems, setTotalItems] = useState(0);

    const [totalAmount, setTotalAmount] = useState(0);

    const [cartLoading, setCartLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            setTotalItems(0);
            setTotalAmount(0);

            return;
        }

        try {
            setCartLoading(true);

            const response = await getCart();

            setCartItems(
                response.data.cartItems || []
            );

            setTotalItems(
                response.data.totalItems || 0
            );

            setTotalAmount(
                response.data.totalAmount || 0
            );
        } catch (error) {
            console.error(
                "GET CART ERROR:",
                error.response?.data || error
            );

            setCartItems([]);
            setTotalItems(0);
            setTotalAmount(0);
        } finally {
            setCartLoading(false);
        }
    }, [user]);

    const changeCartQuantity = async (
        cartId,
        quantity
    ) => {
        try {
            await updateCart(
                cartId,
                quantity
            );

            await fetchCart();
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Unable to update cart";

            toast.error(message);
        }
    };

    const removeCartItem = async (cartId) => {
        try {
            const response = await deleteCart(
                cartId
            );

            toast.success(response.message);

            await fetchCart();
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Unable to remove cart item";

            toast.error(message);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const value = {
        cartItems,
        totalItems,
        totalAmount,
        cartLoading,
        fetchCart,
        changeCartQuantity,
        removeCartItem,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};