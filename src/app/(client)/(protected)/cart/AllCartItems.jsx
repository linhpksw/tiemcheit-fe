"use client";
import { ShoppingCartCard } from "@/components";
import { useShoppingContext } from "@/context";

const AllCartItems = () => {
  const { cartItems } = useShoppingContext();

  return (
    <>
      {cartItems.map((item) => {
        const dish = item.dish;
        return dish && <ShoppingCartCard key={item.id} dish={dish} />;
      })}
    </>
  );
};

export default AllCartItems;
