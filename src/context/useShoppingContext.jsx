'use client';
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useEffect,
    useState,
} from 'react';
import {
    calculateDiscount,
    robustFetchWithRT,
    robustFetchWithoutAT,
} from '@/helpers';
import { calculatedPrice } from '@/helpers';
import { getCookie, robustFetch } from '@/helpers';
import { useUser } from '@/hooks';

const INIT_STATE = {
    cartItems: [],
    wishlists: [],
    couponCode: null,
    discount: null,
    clearCart: () => { },
    clearWishlist: () => { },
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
    applyCoupon: () => { }, // Add applyCoupon method
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
    let { user } = useUser();

    const fetchCartData = async () => {
        const accessToken = getCookie('accessToken');

        if (!accessToken) {
            return;
        }

        const response = await robustFetch(`${BASE_URL}/cart`, 'GET', '', null);

        setState((prevState) => ({ ...prevState, cartItems: response.data }));
    };

    const fetchWishlistData = async () => {
        const accessToken = getCookie('accessToken');

        if (!accessToken) {
            return;
        }

        const response = await robustFetch(`${BASE_URL}/wishlist`, 'GET', '', null);

        setState((prevState) => ({ ...prevState, wishlists: response.data }));
    };

    useEffect(() => {
        fetchCartData();
        fetchWishlistData();
    }, [user]);

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
            'POST',
            '',
            newCartItem
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
            if (cart.product.status === 'active') {
                //cartDiscount += calculateDiscount(cart.dish) * cart.quantity;
                cartTotal += cart.product.price * cart.quantity;
            }
        });

        const cartAmount = cartTotal - state.discount; // - cartDiscount

        return {
            total: cartTotal,
            totalDiscount: state.discount ? state.discount : 0,
            orderTotal: cartAmount,
        };
    }, [state.cartItems, state.discount]);

    const getCartItemById = (dish) => {
        return state.cartItems.find((item) => item.id == dish.id);
    };

    const removeFromCart = async (dish) => {
        console.log(dish);
        const deleteData = {
            id: dish.id,
        };

        const response = await robustFetch(
            `${BASE_URL}/cart`,
            'DELETE',
            'Xóa thành công',
            deleteData
        );

        setState((prevState) => ({
            ...prevState,
            cartItems: prevState.cartItems.filter((item) => item.id !== dish.id),
        }));
    };

    const isInCart = (dish) => {
        console.log(dish);
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
            'PATCH',
            '',
            updateData
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
            'POST',
            'Thêm vào danh sách yêu thích thành công',
            newWishlistItem
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
            'DELETE',
            'Xóa khỏi danh sách yêu thích thành công',
            deleteData
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

    // apply discount
    const applyCoupon = async (couponCode) => {
        try {
            // reset the discount var
            // setState((prevState) => ({
            //     ...prevState,
            //     discount: 0,
            //     couponCode: null,
            // }));

            const response = await robustFetch(
                `${BASE_URL}/cart/applyDiscount/${couponCode}`,
                'POST'
            );

            console.log(response);

            // Assuming response.data contains the updated cartItems with discount applied
            setState((prevState) => ({
                ...prevState,
                discount: response.data,
                couponCode: couponCode,
            }));
        } catch (error) {
            setState((prevState) => ({
                ...prevState,
                discount: 0,
                couponCode: null,
            }));
            console.error('Failed to apply coupon:', error);
        }
    };

    const removeCoupon = () => {
        setState((prevState) => ({
            ...prevState,
            discount: 0,
            couponCode: null,
        }));
    };

    const updateState = (changes) =>
        setState((prevState) => ({ ...prevState, ...changes }));

    const clearCart = () => {
        setState((prevState) => ({ ...prevState, cartItems: [] }));
    };

    const clearWishlist = () => {
        setState((prevState) => ({ ...prevState, wishlists: [] }));
    };

    return (
        <ShopContext.Provider
            value={useMemo(
                () => ({
                    ...state,
                    fetchCartData,
                    fetchWishlistData,
                    addToCart,
                    toggleToWishlist,
                    isInWishlist,
                    isInCart,
                    removeFromCart,
                    updateQuantityForDish,
                    getCalculatedOrder,
                    getCartItemById,
                    clearCart,
                    clearWishlist,
                    applyCoupon,
                    removeCoupon,
                }),
                [state, isInWishlist, isInCart]
            )}
        >
            {children}
        </ShopContext.Provider>
    );
};
export default ShopProvider;
