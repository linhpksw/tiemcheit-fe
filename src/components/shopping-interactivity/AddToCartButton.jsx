"use client";
import { cn } from "@/utils";
import { useShoppingContext } from "@/context";
import { LuShoppingCart, LuTrash } from "react-icons/lu";

const AddToCartButton = ({ dish, className }) => {
  const { addToCart, removeFromCart, isInCart } = useShoppingContext();

  return isInCart(dish) ? (
    <button
      className={cn(
        "relative z-10 inline-flex w-full items-center justify-center rounded-lg bg-red-500/20 px-6 py-3 text-center text-sm font-medium text-red-500 shadow-sm transition-all duration-300 hover:bg-red-500 hover:text-white lg:w-auto",
        className
      )}
      onClick={() => removeFromCart(dish)}
    >
      <LuTrash size={18} className="me-2" />
      <span className="line-clamp-1">Remove from Cart</span>
    </button>
  ) : (
    <button
      className={cn(
        "relative z-10 inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-500 lg:w-auto",
        className
      )}
      onClick={() => addToCart(dish, 1)}
    >
      <LuShoppingCart size={18} className="me-2" />
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
