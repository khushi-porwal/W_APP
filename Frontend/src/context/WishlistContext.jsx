import { createContext, useContext, useState, useEffect } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "../services/wishlistService";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchWishlist = async () => {
        if (!user) {
            setWishlistItems([]);
            return;
        }
        try {
            setLoading(true);
            const res = await getWishlist();
            // Data format: array of wishlist objects containing product object
            if (res?.success) {
                setWishlistItems(res.data || []);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const addItemToWishlist = async (productId) => {
        if (!user) {
            toast.error("Please login to save items to your wishlist!");
            return false;
        }
        try {
            const res = await addToWishlist(productId);
            if (res?.success) {
                toast.success("Added to wishlist ❤️");
                await fetchWishlist();
                return true;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to add to wishlist";
            toast.error(msg);
            return false;
        }
    };

    const removeItemFromWishlist = async (productId) => {
        if (!user) return false;
        try {
            const res = await removeFromWishlist(productId);
            if (res?.success) {
                toast.success("Removed from wishlist");
                setWishlistItems((prev) =>
                    prev.filter((item) => (item.product?._id || item.product) !== productId)
                );
                return true;
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to remove item";
            toast.error(msg);
            return false;
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(
            (item) => (item.product?._id || item.product) === productId
        );
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                loading,
                fetchWishlist,
                addItemToWishlist,
                removeItemFromWishlist,
                isInWishlist,
                wishlistCount: wishlistItems.length,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
