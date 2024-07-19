'use client';

import { ShoppingCartCard } from '@/components';
import { useShoppingContext } from '@/context';

const AllCartItems = () => {
    const { cartItems } = useShoppingContext();
    //console.log(cartItems);
    return (
        <>
            {cartItems.map((item) => {
                return item && <ShoppingCartCard key={item.id} dish={item} />;
            })}
        </>
    );
};

export default AllCartItems;
