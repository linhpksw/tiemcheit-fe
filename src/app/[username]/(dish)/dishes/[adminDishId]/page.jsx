'use client';
import { notFound, useParams } from 'next/navigation';
import { BreadcrumbAdmin, DishDetailsSwiper, ProductDetailView } from '@/components';
import { useProductDetail } from '@/hooks';
import { use, useEffect, useState } from 'react';
import { getProductDetailByIdWithAT } from '@/helpers';

const DishDetails = () => {
	const params = useParams();
	const [productData, setProductData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchProduct = async () => {
			setIsLoading(false);
			try {
				const product = await getProductDetailByIdWithAT(Number(params.adminDishId));
				setProductData(product);
				console.log(product);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(true);
			}
		};
		fetchProduct(), [params.adminDishId];
	});

	if (!isLoading) {
		return <></>;
	}
	if (!productData) notFound();

	return (
		<div className='w-full lg:ps-64'>
			<div className='page-content space-y-6 p-6'>
				<BreadcrumbAdmin title={productData.name} subtitle='Dishes' link='/admin/dishes' />

				<div className='grid gap-6 lg:grid-cols-2'>
					<div className='rounded-lg border border-default-200 p-6'>
						<DishDetailsSwiper images={productData.imageList} />
					</div>
					<div className='rounded-lg border border-default-200 p-6'>
						<ProductDetailView dish={productData} showButtons />
					</div>
				</div>
			</div>
		</div>
	);
};

export default DishDetails;
