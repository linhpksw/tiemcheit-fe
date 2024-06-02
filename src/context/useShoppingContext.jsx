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
import { getCookie } from "@/utils";
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

const ShopContext = createContext(undefined);

export const useShoppingContext = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShopContext must be used within a ShopProvider");
  }
  return context;
};

const ShopProvider = ({ children }) => {
  const token = getCookie("accessToken");
  const [state, setState] = useState(INIT_STATE);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch("http://localhost:8080/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = await response.json();
        setState((prevState) => ({ ...prevState, cartItems: data.data }));
      } catch (error) {
        console.error("Failed to fetch cart data:", error);
      }
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

    try {
      const response = await fetch("http://localhost:8080/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(newCartItem),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setState((prevState) => ({
          ...prevState,
          cartItems: [...prevState.cartItems, updatedCart.data],
        }));
      } else {
        console.error("Failed to add to cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
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

  // const getCartItemById = (dish) => {
  //   return state.cartItems.find((item) => item.id == dish.id);
  // };

  const removeFromCart = async (dish) => {
    try {
      const deleteData = {
        id: dish.id,
      };

      console.log(deleteData);

      const response = await fetch(`http://localhost:8080/cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(deleteData),
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
    try {
      const updateData = {
        id: dish.id,
        quantity: quantity,
      };

      // TODO: change when apply token
      const response = await fetch(`http://localhost:8080/cart`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
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
          // getCartItemById,
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
