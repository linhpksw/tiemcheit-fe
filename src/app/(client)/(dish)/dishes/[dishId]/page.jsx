"use client";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { FaCircle, FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { useState, useEffect } from "react";
import {
	Breadcrumb,
	DishDetailsSwiper,
	ProductDetailView,
	ProductGridCard,
} from "@/components";
import { cn } from "@/utils";
import { getProductDetailById, getAllReviews } from "@/helpers";
import { use } from "react";
import { useProductDetail, useProductByCategory } from "@/hooks";
import ConsumerReview from "./ConsumerReviews";

const ProductDetail = () => {
	const params = useParams();
	const { product: productDetail, isLoading: isProductLoading } =
		useProductDetail(params.dishId);
	const shouldFetchRelatedProducts = !isProductLoading && productDetail;
	const { product: relativeProducts, isLoading: isRelativeProductLoading } =
		useProductByCategory(
			shouldFetchRelatedProducts ? productDetail.data.category.id : null
		);

	if (isProductLoading || isRelativeProductLoading) {
		return <div>Loading...</div>;
	}

	if (!productDetail) {
		return <div>Product not found.</div>;
	}
	const productsData = productDetail.data;

	const relativeProductData = relativeProducts.data;

	return (
		<>
			<Breadcrumb title={productsData.name} subtitle="Details" />

			<section className="py-6 lg:py-10">
				<div className="container">
					<div className="grid gap-6 lg:grid-cols-2">
						<DishDetailsSwiper images={productsData.imageList} />

						<ProductDetailView dish={productsData} showButtons />
					</div>
				</div>
			</section>
			<section className="py-6 lg:py-10">
				<div className="container">
					<h4 className="mb-4 text-xl font-semibold text-default-800">
						Bạn có thể thích...
					</h4>
					<div className="mb-10 grid gap-5 sm:grid-cols-4">
						{relativeProductData.slice(0, 4).map((dish, idx) => (
							<ProductGridCard key={idx} dish={dish} />
						))}
					</div>

					<ConsumerReview id={productsData.id} />
				</div>
			</section>
		</>
	);
};

export default ProductDetail;
