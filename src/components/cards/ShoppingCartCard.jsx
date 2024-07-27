import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { LuXCircle } from 'react-icons/lu';
import { currentCurrency } from '@/common';
import { calculatedCartPrice } from '@/helpers';
import { useShoppingContext } from '@/context';
import { formatCurrency } from '@/utils';
const ProductQuantityToggler = dynamic(
	() => import('@/components/shopping-interactivity/ProductQuantityToggler'),
	{
		ssr: false,
	}
);

const ShoppingCartCard = ({ dish }) => {
	// const { name, id, image, price, sale } = dish;
	const { id, product } = dish;

	const { cartItems, removeFromCart } = useShoppingContext();

	const quantity =
		cartItems.find((item) => item.product.id == product.id)?.quantity ?? 1;

	const discountedPrice = calculatedCartPrice(dish);

	const handleRemoveClick = () => {
		removeFromCart(dish);
	};

	return (
		<tr className={product.status !== 'active' ? 'bg-gray-200' : ''}>
			<td className="whitespace-nowrap px-5 py-3">
				<div className="flex items-center gap-2">
					<button onClick={handleRemoveClick}>
						<LuXCircle size={20} className="text-default-400" />
					</button>
					<Image
						// src={product.image}
						width={72}
						height={72}
						className="h-18 w-18"
						alt="dish_img"
					/>
					<Link
						href={`/dishes/${id}`}
						className={`text-sm font-medium text-default-800 ${product.status !== 'active' ? 'line-through' : ''}`}
					>
						{product.name}
					</Link>
				</div>
				{product.status !== 'active' && (
					<div className="font-bold">
						<span>Sản phẩm đã ngừng bán. </span>
						<span
							onClick={handleRemoveClick}
							className="text-red-600 cursor-pointer underline"
						>
							Xóa
						</span>
					</div>
				)}
			</td>
			<td className="whitespace-nowrap px-5 py-3 text-sm">
				<h4
					className={`text-base font-semibold text-primary
                        ${product.status !== 'active' ? 'line-through' : ''}`}
				>
					{/* {discountedPrice.toLocaleString('vi-VN', {
						style: 'currency',
						currency: 'VND',
					})} */}
					{formatCurrency(discountedPrice)}
				</h4>
			</td>
			<td className="whitespace-nowrap px-5 py-3">
				{product.status === 'active' && <ProductQuantityToggler dish={dish} />}
			</td>
			<td
				className={`whitespace-nowrap px-5 py-3 text-center text-sm text-default-800
                    ${product.status !== 'active' ? 'line-through' : ''}`}
			>
				{(discountedPrice * quantity).toLocaleString('vi-VN', {
					style: 'currency',
					currency: 'VND',
				})}
			</td>
		</tr>
	);
};

export default ShoppingCartCard;
