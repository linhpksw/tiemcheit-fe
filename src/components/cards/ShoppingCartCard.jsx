import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { LuXCircle } from 'react-icons/lu';
import { currentCurrency } from '@/common';
import { calculatedCartPrice } from '@/helpers';
import { useShoppingContext } from '@/context';
const ProductQuantityToggler = dynamic(() => import('@/components/shopping-interactivity/ProductQuantityToggler'), {
    ssr: false,
});

const ShoppingCartCard = ({ dish }) => {
    // const { name, id, image, price, sale } = dish;
    const { id, product } = dish;

    const { cartItems, removeFromCart } = useShoppingContext();

    const quantity = cartItems.find((item) => item.product.id == product.id)?.quantity ?? 1;

    const discountedPrice = calculatedCartPrice(dish);

    const handleRemoveClick = () => {
        removeFromCart(dish);
    };

    return (
        <tr>
            <td className='whitespace-nowrap px-5 py-3'>
                <div className='flex items-center gap-2'>
                    <button onClick={handleRemoveClick}>
                        <LuXCircle size={20} className='text-default-400' />
                    </button>
                    <Image
                        //src={product.image}
                        width={72}
                        height={72}
                        className='h-18 w-18'
                        alt='dish_img'
                    />
                    <Link href={`/dishes/${id}`} className='text-sm font-medium text-default-800'>
                        {product.name}
                    </Link>
                </div>
            </td>
            <td className='whitespace-nowrap px-5 py-3 text-sm'>
                <h4 className='text-base font-semibold text-primary'>
                    {discountedPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </h4>

                {/* {sale && (
          <h4 className="ms-2 text-sm text-default-500 line-through">
            {price}
            {currentCurrency}
          </h4>
        )} */}
            </td>
            <td className='whitespace-nowrap px-5 py-3'>
                <ProductQuantityToggler dish={dish} />
            </td>
            <td className='whitespace-nowrap px-5 py-3 text-center text-sm text-default-800'>
                {(discountedPrice * quantity).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                })}
            </td>
        </tr>
    );
};

export default ShoppingCartCard;
