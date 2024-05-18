"use client";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks";
import { calculateDiscount } from "@/helpers";

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
    throw new Error("useShopContext must be used within an ShopProvider");
  }
  return context;
};

const ShopProvider = ({ children }) => {
  const [state, setState] = useLocalStorage("__Yum_Next_Session__", INIT_STATE);

  const addToCart = (dish, quantity) => {
    const cartItems = state.cartItems;
    if (isInCart(dish)) {
      return;
    }
    cartItems.push({
      id: state.cartItems.length + 1,
      dish: dish,
      quantity: quantity,
      dish_id: dish.id,
    });
    updateState({ cartItems });
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

  const isInCart = (dish) => {
    return (
      state.cartItems.find(
        (wishlistDish) => wishlistDish?.dish_id == dish?.id
      ) != null
    );
  };

  const isInWishlist = (dish) => {
    return (
      state.wishlists.find((wishlistDish) => wishlistDish?.id == dish?.id) !=
      null
    );
  };

  const updateQuantityForDish = (dish, quantity) => {
    updateState({
      cartItems: state.cartItems.map((cartItem) => {
        if (cartItem.dish_id == dish.id) {
          return {
            ...cartItem,
            quantity: quantity,
          };
        }
        return cartItem;
      }),
    });
  };

  const toggleToWishlist = (dish) => {
    let wishlists = state.wishlists;
    if (isInWishlist(dish)) {
      wishlists = wishlists.filter((p) => p.id != dish.id);
    } else {
      wishlists.push(dish);
    }
    updateState({ wishlists });
  };

  const updateState = (changes) => setState({ ...state, ...changes });

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
