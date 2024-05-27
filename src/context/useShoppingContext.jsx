'use client';
import { createContext, useCallback, useContext, useMemo, useEffect, useState } from 'react';
import { calculateDiscount } from '@/helpers';

const INIT_STATE = {
    cartItems: [],
    wishlists: [],
    addToCart: () => {},
    toggleToWishlist: () => {},
    isInWishlist: () => false,
    isInCart: () => false,
    removeFromCart: () => {},
    updateQuantityForDish: () => {},
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
        throw new Error('useShopContext must be used within a ShopProvider');
    }
    return context;
};

const ShopProvider = ({ children }) => {
    const [state, setState] = useState(INIT_STATE);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await fetch('http://localhost:8080/cart/6');
                const data = await response.json();
                //console.log(data);
                setState((prevState) => ({ ...prevState, cartItems: data }));
            } catch (error) {
                console.error('Failed to fetch cart data:', error);
            }
        };

        fetchCartData();
    }, []);

    const addToCart = async (dish, quantity) => {
        if (isInCart(dish)) {
            return;
        }
        const newCartItem = {
            id: state.cartItems.length + 1,
            dish: dish,
            quantity: quantity,
            dish_id: dish.id,
        };

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCartItem),
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setState((prevState) => ({
                    ...prevState,
                    cartItems: updatedCart.cartItems,
                }));
            } else {
                console.error('Failed to add to cart:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
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
        return state.cartItems.find((item) => item.dish_id == dish.id);
    };

    const removeFromCart = async (dish) => {
        try {
            const response = await fetch(`/api/cart/${dish.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setState((prevState) => ({
                    ...prevState,
                    cartItems: updatedCart.cartItems,
                }));
            } else {
                console.error('Failed to remove from cart:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const isInCart = (dish) => {
        return state.cartItems.find((wishlistDish) => wishlistDish?.dish_id == dish?.id) != null;
    };

    const isInWishlist = (dish) => {
        return state.wishlists.find((wishlistDish) => wishlistDish?.id == dish?.id) != null;
    };

    const updateQuantityForDish = async (dish, quantity) => {
        try {
            const response = await fetch(`/api/cart/${dish.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity }),
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setState((prevState) => ({
                    ...prevState,
                    cartItems: updatedCart.cartItems,
                }));
            } else {
                console.error('Failed to update quantity:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
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
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(wishlists),
            });

            if (response.ok) {
                setState((prevState) => ({ ...prevState, wishlists }));
            } else {
                console.error('Failed to update wishlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

    const updateState = (changes) => setState((prevState) => ({ ...prevState, ...changes }));

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
            )}>
            {children}
        </ShopContext.Provider>
    );
};
export default ShopProvider;
