"use client";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks";
import { calculateDiscount } from "@/helpers";
import { calculatedPrice } from "@/helpers";

const INIT_STATE = {
    cartItems: [],
    wishlists: [],
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

const ShopContext = createContext(undefined);

export const useShoppingContext = () => {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error("useShopContext must be used within an ShopProvider");
    }
    return context;
};

export const ShopProvider = ({ children }) => {
    const [state, setState] = useLocalStorage("__Yum_Next_Session__", INIT_STATE);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await fetch("http://localhost:8080/cart/1");
                const data = await response.json();
                setState((prevState) => ({ ...prevState, cartItems: data.data }));
            } catch (error) {
                console.error("Failed to fetch cart data:", error);
            }
        };

        const getCalculatedOrder = useCallback(() => {
            let cartTotal = 0,
                cartDiscount = 0;

            state.cartItems.forEach((cart) => {
                cartDiscount += calculateDiscount(cart.dish) * cart.quantity;
                cartTotal += cart.dish.price * cart.quantity;
            });

            const cartAmount = cartTotal - cartDiscount;
            const tax = cartAmount * 0.18;

            return {
                total: cartTotal,
                totalDiscount: cartDiscount,
                tax: tax,
                orderTotal: cartAmount + tax,
            };
        }, [state.cartItems]);

        const getCartItemById = (dish) => {
            return state.cartItems.find((item) => item.dish_id == dish.id);
        };

        const removeFromCart = (dish) => {
            let cartItems = state.cartItems;
            cartItems = cartItems.filter((cart) => cart.dish_id != dish.id);
            updateState({ cartItems });
        };

        const getCartItemById = (dish) => {
            return state.cartItems.find((item) => item.id == dish.id);
        };

        const removeFromCart = async (dish) => {
            try {
                console.log(dish);
                const response = await fetch(`http://localhost:8080/cart/${dish.id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    setState((prevState) => ({
                        ...prevState,
                        cartItems: prevState.cartItems.filter((item) => item.id !== dish.id),
                    }));
                } else {
                    console.error("Failed to remove from cart:", response.statusText);
                }
            } catch (error) {
                console.error("Error removing from cart:", error);
            }
        };

        return (
            state.cartItems.find((wishlistDish) => wishlistDish?.id == dish?.id) !=
            null
        );
    };

    const isInWishlist = (dish) => {
        return (
            state.wishlists.find((wishlistDish) => wishlistDish?.id == dish?.id) !=
            null
        );
    };

    const updateQuantityForDish = async (dish, quantity) => {
        try {
            const updateData = {
                id: dish.id,
                quantity: quantity,
            };

            // TODO: change when apply token
            const response = await fetch(`http://localhost:8080/cart/1`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                // const updatedCart = await response.json();
                // setState((prevState) => ({
                //   ...prevState,
                //   cartItems: updatedCart,
                // }));

                const updatedCartItem = await response.json();
                setState((prevState) => ({
                    ...prevState,
                    cartItems: prevState.cartItems.map((item) =>
                        item.id === updatedCartItem.data.id ? updatedCartItem.data : item
                    ),
                }));
            } else {
                console.error("Failed to update quantity:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const toggleToWishlist = async (dish) => {
        let wishlists = state.wishlists;
        if (isInWishlist(dish)) {
            wishlists = wishlists.filter((p) => p.id != dish.id);
        } else {
            wishlists.push(dish);
        }
        // Assuming you have an endpoint for wishlists
        try {
            const response = await fetch("/api/wishlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(wishlists),
            });

            if (response.ok) {
                setState((prevState) => ({ ...prevState, wishlists }));
            } else {
                console.error("Failed to update wishlist:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
        }
    };

    const updateState = (changes) =>
        setState((prevState) => ({ ...prevState, ...changes }));

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
                }),
                [state, isInWishlist, isInCart]
            )}
        >
            {children}
        </ShopContext.Provider>
    );
};
export default ShopProvider;
