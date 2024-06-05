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
  clearCart: () => {},
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
    //       "accessToken"
    //     );

    //     setState((prevState) => ({ ...prevState, cartItems: response.data }));
    //   } catch (error) {
    //     console.error("Failed to fetch cart data:", error);
    //   }
    // };

    const fetchCartData = async () => {
      const response = await robustFetch(
        `${BASE_URL}/cart`,
        "GET",
        "",
        null,
        "accessToken"
      );

      setState((prevState) => ({ ...prevState, cartItems: response.data }));
    };

    fetchCartData();
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
      "accessToken"
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
      "accessToken"
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
      state.wishlists.find((wishlistDish) => wishlistDish?.id == dish?.id) !=
      null
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
      "accessToken"
    );

    setState((prevState) => ({
      ...prevState,
      cartItems: prevState.cartItems.map((item) =>
        item.id === response.data.id ? response.data : item
      ),
    }));
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
