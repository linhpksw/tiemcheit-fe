import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FaStar } from 'react-icons/fa6';
import { currentCurrency } from '@/common';
import { calculatedPrice } from '@/helpers';
import { getImagePath } from '@/utils';

const AddToFavouriteButton = dynamic(() => import('../shopping-interactivity/ProductWishlistToggler'), { ssr: false });
const ProductQuantityToggler = dynamic(() => import('../shopping-interactivity/ProductQuantityToggler'), {
	ssr: false,
});
const AddToCartButton = dynamic(() => import('../shopping-interactivity/AddToCartButton'), { ssr: false });

const ProductGridCard = ({ dish }) => {
	const { image, name, review, id, quantity } = dish;
	const discountedPrice = calculatedPrice(dish);

	return (
		<div className='order-3 overflow-hidden rounded-lg border border-default-200 p-4 transition-all duration-300 hover:border-primary hover:shadow-xl'>
			<div className='group relative divide-y divide-default-200 overflow-hidden rounded-lg'>
				<div className='mx-auto mb-4 relative'>
					<Image
						width={339}
						height={263}
						src={getImagePath(image)}
						alt={name}
						className={`h-full w-full transition-all group-hover:scale-105 ${quantity === 0 ? 'opacity-50' : ''}`}
					/>
					{quantity === 0 && (
						<div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
							<span className='text-red-600 border border-red-600 bg-white p-2 text-2xl font-bold'>
								Hết hàng
							</span>
						</div>
					)}
				</div>
				<div className='pt-2'>
					<div className='mb-4 flex items-center justify-between'>
						<Link
							className='line-clamp-1 text-xl font-semibold text-default-800 after:absolute after:inset-0'
							href={`/dishes/${id}`}>
							{name}
						</Link>

						<AddToFavouriteButton dish={dish} />
					</div>

					{quantity > 0 && (
						<div className='mb-4 flex items-center justify-between text-l'>Số lượng: {dish.quantity}</div>
					)}

					<div className='mb-4 flex items-end justify-between'>
						<h4 className='text-2xl font-semibold leading-9 text-default-900'>
							{currentCurrency}
							{discountedPrice}
						</h4>
					</div>
					{quantity > 0 ? (
						<AddToCartButton dish={dish} />
					) : (
						<div className='mb-4 text-red-600 border-reds text-l' style={{ visibility: 'hidden' }}>
							{/* Sản phẩm hiện đã hết hàng. */}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductGridCard;
