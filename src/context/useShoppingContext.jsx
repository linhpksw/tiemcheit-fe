"use client";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useEffect,
    useState,
} from "react";
import { calculateDiscount } from "@/helpers";
import { calculatedPrice } from "@/helpers";
import { getCookie, robustFetch } from "@/helpers";

const INIT_STATE = {
    cartItems: [],
    wishlists: [],
    clearCart: () => { },
    addToCart: () => { },
    toggleToWishlist: () => { },
    isInWishlist: () => false,
    isInCart: () => false,
    removeFromCart: () => { },
    updateQuantityForDish: () => { },
    getCalculatedOrder: () => {
        return {
            orderTotal: 0,
            tax: 0,
            total: 0,
            totalDiscount: 0,
        };
    },
    getCartItemById: () => undefined,
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ShopContext = createContext(undefined);

export const useShoppingContext = () => {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error("useShopContext must be used within a ShopProvider");
    }
    return context;
};

const ShopProvider = ({ children }) => {
    const [state, setState] = useState(INIT_STATE);

    useEffect(() => {
        // const fetchCartData = async () => {
        //   try {
        //     const response = await robustFetch(
        //       `${BASE_URL}/cart`,
        //       "GET",
        //       "",
        //       null,
        //     );

        //     setState((prevState) => ({ ...prevState, cartItems: response.data }));
        //   } catch (error) {
        //     console.error("Failed to fetch cart data:", error);
        //   }
        // };

        const fetchCartData = async () => {
            const accessToken = getCookie("accessToken");

            if (!accessToken) {
                return;
            }

            const response = await robustFetch(
                `${BASE_URL}/cart`,
                "GET",
                "",
                null,
            );

            setState((prevState) => ({ ...prevState, cartItems: response.data }));
        };

        const fetchWishlistData = async () => {
            const accessToken = getCookie("accessToken");

            if (!accessToken) {
                return;
            }

            const response = await robustFetch(
                `${BASE_URL}/wishlist`,
                "GET",
                "",
                null,
            );

            setState((prevState) => ({ ...prevState, wishlists: response.data }));
        };

        fetchCartData();
        fetchWishlistData();
    }, []);

    const addToCart = async (dish, quantity) => {
        if (isInCart(dish)) {
            return;
        }

        const newCartItem = {
            product: dish,
            quantity: quantity,
        };

        const response = await robustFetch(
            `${BASE_URL}/cart`,
            "POST",
            "",
            newCartItem,
        );

        setState((prevState) => ({
            ...prevState,
            cartItems: [...prevState.cartItems, response.data],
        }));
    };

    const getCalculatedOrder = useCallback(() => {
        let cartTotal = 0,
            cartDiscount = 0;

        state.cartItems.forEach((cart) => {
            //cartDiscount += calculateDiscount(cart.dish) * cart.quantity;
            cartTotal += cart.product.price * cart.quantity;
        });

        const cartAmount = cartTotal; // - cartDiscount

        return {
            total: cartTotal,
            totalDiscount: cartDiscount,
            orderTotal: cartAmount,
        };
    }, [state.cartItems]);

    const getCartItemById = (dish) => {
        return state.cartItems.find((item) => item.id == dish.id);
    };

    const removeFromCart = async (dish) => {
        const deleteData = {
            id: dish.id,
        };

        const response = await robustFetch(
            `${BASE_URL}/cart`,
            "DELETE",
            "Xóa thành công",
            deleteData,
        );

        setState((prevState) => ({
            ...prevState,
            cartItems: prevState.cartItems.filter((item) => item.id !== dish.id),
        }));
    };

    const isInCart = (dish) => {
        return state.cartItems.find((item) => item.product?.id == dish?.id) != null;
    };

    const isInWishlist = (dish) => {
        return (
            state.wishlists.find(
                (wishlistDish) => wishlistDish?.product.id == dish?.id
            ) != null
        );
    };

    const updateQuantityForDish = async (dish, quantity) => {
        const updateData = {
            id: dish.id,
            quantity: quantity,
        };

        const response = await robustFetch(
            `${BASE_URL}/cart`,
            "PATCH",
            "",
            updateData,
        );

        setState((prevState) => ({
            ...prevState,
            cartItems: prevState.cartItems.map((item) =>
                item.id === response.data.id ? response.data : item
            ),
        }));
    };

    const addToWishlist = async (dish) => {
        if (isInWishlist(dish)) {
            return;
        }

        const newWishlistItem = {
            product: dish,
        };

        const response = await robustFetch(
            `${BASE_URL}/wishlist`,
            "POST",
            "Thêm vào danh sách yêu thích thành công",
            newWishlistItem,
        );

        setState((prevState) => ({
            ...prevState,
            wishlists: [...prevState.wishlists, response.data],
        }));
    };

    const removeFromWishlist = async (dish) => {
        const deleteData = {
            product: dish,
        };

        const response = await robustFetch(
            `${BASE_URL}/wishlist`,
            "DELETE",
            "Xóa khỏi danh sách yêu thích thành công",
            deleteData,
        );

        setState((prevState) => ({
            ...prevState,
            wishlists: prevState.wishlists.filter(
                (item) => item.product.id !== dish.id
            ),
        }));
    };

    const toggleToWishlist = async (dish) => {
        let wishlists = state.wishlists;
        if (isInWishlist(dish)) {
            removeFromWishlist(dish);
        } else {
            addToWishlist(dish);
        }
    };

    const updateState = (changes) =>
        setState((prevState) => ({ ...prevState, ...changes }));

    const clearCart = () => {
        setState((prevState) => ({ ...prevState, cartItems: [] }));
    };

    return (
        <ShopContext.Provider
            value={useMemo(
                () => ({
                    ...state,
                    addToCart,
                    toggleToWishlist,
                    isInWishlist,
                    isInCart,
                    removeFromCart,
                    updateQuantityForDish,
                    getCalculatedOrder,
                    getCartItemById,
                    clearCart,
                }),
                [state, isInWishlist, isInCart]
            )}
        >
            {children}
        </ShopContext.Provider>
    );
};
export default ShopProvider;
