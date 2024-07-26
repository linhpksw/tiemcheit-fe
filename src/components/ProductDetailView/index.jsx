'use client';
import dynamic from 'next/dynamic';
import { BiFoodTag } from 'react-icons/bi';
import { FaStar, FaStarHalfStroke } from 'react-icons/fa6';
import { LuEye } from 'react-icons/lu';
import { kebabToTitleCase } from '@/utils';
import { calculatedPrice, getRestaurantById } from '@/helpers';
import { currentCurrency } from '@/common';
const OrderInteraction = dynamic(() => import('./OrderInteraction'));

const ProductDetailView = async ({ dish, showButtons }) => {
	console.log(dish);
	const isOutOfStock = dish.ingredientList.some((ing) => ing.unit > ing.ingredient.quantity);

	return (
		<div>
			<div className='mb-1 flex flex-wrap items-end justify-between font-medium text-default-800'>
				<h1 className='text-4xl'>{dish.name}</h1>
				<h3 className='text-4xl'>
					{currentCurrency}
					{dish.price}
				</h3>
			</div>

			<p className='mb-4 text-sm text-default-500'>{dish.description}</p>
			<div className='mb-5 flex gap-2'></div>

			{dish.status != 'disabled' ? (
				!isOutOfStock ? (
					<>
						{dish.optionList &&
							Array.isArray(dish.optionList) &&
							dish.optionList.length > 0 &&
							dish.optionList.map((option, optionId) => {
								const sortedOptionValues = option.optionValues.sort((a, b) => a.id - b.id);

								return (
									<div key={optionId} className='mb-8 flex items-center gap-3'>
										<h4 className='text-sm text-default-700'>{option.name}</h4>

										{sortedOptionValues.map((value, valueId) => (
											<div key={option.name + valueId}>
												<input
													type='radio'
													name={optionId}
													id={option.name + valueId}
													value={value.name}
													className='peer hidden'
													disabled={isOutOfStock}
													defaultChecked={valueId === 2}
												/>

												<label
													htmlFor={option.name + valueId}
													className={`flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full bg-default-200 text-center text-sm peer-checked:bg-primary peer-checked:text-white ${isOutOfStock && 'opacity-50 cursor-not-allowed'}`}>
													{value.name}
												</label>
											</div>
										))}
									</div>
								);
							})}

						{/* <OrderInteraction dish={dish} /> */}
					</>
				) : (
					<div className='mb-4 text-red-600 text-xl'>Sản phẩm hiện đã hết hàng.</div>
				)
			) : (
				<div className='mb-4 text-red-600 text-xl'>Sản phẩm hiện đã ngừng kinh doanh.</div>
			)}

			<div className='mb-6'>
				<h4 className='mb-4 text-lg font-medium text-default-700'>Nguyên liệu</h4>
				<div className='rounded-lg border border-default-200 p-3'>
					{dish.ingredientList && dish.ingredientList.length > 0 ? (
						<div className='grid grid-cols-4 gap-4 justify-center'>
							{dish.ingredientList.map((ingredient, idx) => (
								<div key={ingredient.ingredient.name + idx} className='text-center'>
									<h4 className='text-base text-default-700'>{ingredient.ingredient.name}</h4>
									<h5 className='text-sm text-default-500'>{ingredient.unit}</h5>
								</div>
							))}
						</div>
					) : (
						<p className='text-sm text-default-500'>Không có dữ liệu</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductDetailView;
