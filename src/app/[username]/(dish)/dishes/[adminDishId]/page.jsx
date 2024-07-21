'use client';
import { notFound, useParams } from 'next/navigation';
import { BreadcrumbAdmin, DishDetailsSwiper, ProductDetailView } from '@/components';
import { useProductDetail } from '@/hooks';
import { use, useEffect, useState } from 'react';
import { getProductDetailByIdWithAT } from '@/helpers';

const formData = {
	name: '',
	price: 0,
	quantity: 0,
	description: '',
	category: {},
	optionList: [],
	imageList: [],
	status: '',
	ingredientList: [],
};

const DishDetails = () => {
	const { adminDishId } = useParams();
	const [productData, setProductData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchProduct = async () => {
			setIsLoading(true);
			try {
				const product = await getProductDetailByIdWithAT(adminDishId);
				formData.name = product.name;
				if (product.imageList.length > 0) {
					formData.imageList = product.imageList.map((image) => image);
				}
				formData.price = product.price;
				formData.quantity = product.quantity;
				formData.description = product.description;
				formData.category.id = product.category.id;
				formData.optionList = product.optionList.map((option) => {
					return {
						id: option.id,
						name: option.name,
						value: option.optionValues.map((optionValue) => {
							return {
								id: optionValue.id,
								name: optionValue.name,
							};
						}),
					};
				});
				formData.ingredientList = product.ingredientList.map((productIngredient) => {
					return {
						id: productIngredient.ingredient.id,
						name: productIngredient.ingredient.name,
						unit: productIngredient.unit,
					};
				});
				setProductData(formData);
				console.log(productData);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchProduct();
	}, [adminDishId]);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!productData) notFound();

	return (
		<div className='w-full lg:ps-64'>
			<div className='page-content space-y-6 p-6'>
				<BreadcrumbAdmin title={productData.name} subtitle='Dishes' link='/admin/dishes' />

				<div className='grid gap-6 lg:grid-cols-2'>
					<div className='rounded-lg border border-default-200 p-6'>
						<DishDetailsSwiper images={formData.imageList} />
					</div>
					<div className='rounded-lg border border-default-200 p-6'>
						<ProductDetailView dish={formData} showButtons />
					</div>
				</div>
			</div>
		</div>
	);
};

export default DishDetails;
