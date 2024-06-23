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
import { consumerReviews, dishesData } from "@/assets/data";
import { getProductDetailByIdWithAT } from "@/helpers";
import { use } from "react";
import { useProductDetail, useProductByCategory } from "@/hooks";
import ConsumerReview from "./ConsumerReviews";



const ProductDetail = () => {
    const params = useParams();
    const { product: productDetail, isLoading: isProductLoading } = useProductDetail(params.dishId);
    const shouldFetchRelatedProducts = !isProductLoading && productDetail;
    const { product: relativeProducts, isLoading: isRelativeProductLoading } = useProductByCategory(shouldFetchRelatedProducts ? productDetail.data.category.id : null);

    if (isProductLoading || isRelativeProductLoading) {
        return <div>Loading...</div>;
    }

    const productsData = productDetail ? productDetail.data : {};
    const relativeProductData = relativeProducts ? relativeProducts.data : [];

    if (!productsData) {
        return notFound();
    }

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

                    <DishRatingRepresentation />

                    <div className="pt-10">
                        <h4 className="text-base font-medium text-default-800">
                            Consumer Review
                        </h4>

                        {consumerReviews.map((review, idx) => (
                            <div
                                key={review.id}
                                className={cn(
                                    "py-5",
                                    consumerReviews.length !== idx + 1 &&
                                    "border-b border-default-200"
                                )}
                            >
                                <div className="mb-3 flex items-center">
                                    <Image
                                        src={review.reviewer_image}
                                        alt="avatar"
                                        height={48}
                                        width={48}
                                        className="me-4 h-12 w-12 rounded-full"
                                    />
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <h4 className="text-sm font-medium text-default-800">
                                                {review.reviewer_name}
                                            </h4>
                                            <FaCircle size={5} className="text-default-400" />
                                            <h4 className="text-sm font-medium text-default-400">
                                                Just now
                                            </h4>
                                        </div>
                                        <div className="flex gap-1.5">
                                            {Array.from(new Array(Math.floor(review.stars))).map(
                                                (_val, idx) => (
                                                    <FaStar
                                                        key={idx}
                                                        className="text-base text-yellow-400"
                                                    />
                                                )
                                            )}
                                            {!Number.isInteger(review.stars) && (
                                                <FaStarHalfStroke
                                                    size={18}
                                                    className="text-yellow-400"
                                                />
                                            )}
                                            {review.stars < 5 &&
                                                Array.from(new Array(5 - Math.ceil(review.stars))).map(
                                                    (_val, idx) => (
                                                        <FaStar
                                                            key={idx}
                                                            size={16}
                                                            className="text-default-200"
                                                        />
                                                    )
                                                )}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-default-600">{review.review}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductDetail;

