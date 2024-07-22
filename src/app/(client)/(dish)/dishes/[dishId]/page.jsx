'use client';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { FaCircle, FaStar, FaStarHalfStroke } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { Breadcrumb, DishDetailsSwiper, ProductDetailView, ProductGridCard } from '@/components';
import { cn } from '@/utils';
import { useProductDetail, useProductByCategory } from '@/hooks';
import ConsumerReview from './ConsumerReviews';
import {
	getAllProductsByCatetoryId,
	getProductDetailByIdWithOutAT,
	getProductByFilter,
	robustFetchWithoutAT,
} from '@/helpers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const ProductDetail = () => {
	const { dishId } = useParams();
	const [productsData, setProduct] = useState(null);
	const [relativeProducts, setRelativeProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const filter = {
		categories: null,
		status: 'active',
	};

	useEffect(() => {
		const fetchProductData = async () => {
			try {
				setIsLoading(true);
				const response = await getProductDetailByIdWithOutAT(dishId);
				console.log(response);
				setProduct(response);
				filter.categories = response.category.id;
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProductData();
	}, [dishId]);

	useEffect(() => {
		const fetchRelativeProductData = async () => {
			try {
				setIsLoading(true);
				const response = await robustFetchWithoutAT(
					`${BASE_URL}/products/filter?categories=${productsData.category.id}&status=active`,
					'GET',
					null
				);
				setRelativeProducts(response.data);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};
		if (productsData) {
			fetchRelativeProductData();
		}
	}, [productsData]);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!productsData) {
		return notFound();
	}

	return (
		<>
			<Breadcrumb title={productsData.name} subtitle='Details' />
			<section className='py-6 lg:py-10'>
				<div className='container'>
					<div className='grid gap-6 lg:grid-cols-2'>
						<DishDetailsSwiper images={productsData.imageList} />

						<ProductDetailView dish={productsData} showButtons />
					</div>
				</div>
			</section>
			<section className='py-6 lg:py-10'>
				<div className='container'>
					<h4 className='mb-4 text-xl font-semibold text-default-800'>Bạn có thể thích...</h4>
					<div className='mb-10 grid gap-5 sm:grid-cols-4'>
						{relativeProducts != null &&
							relativeProducts.slice(0, 4).map((dish, idx) => <ProductGridCard key={idx} dish={dish} />)}
					</div>

					<ConsumerReview id={productsData.id} />
				</div>
			</section>
		</>
	);
};

export default ProductDetail;
