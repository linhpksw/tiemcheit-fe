"use client";
import React, { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";
import { addReview, getProductByOrderDetail } from "@/helpers/data";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { getImagePath } from "@/utils";
import Image from "next/image";
import { BestSellingProductCard } from "@/components";
const AddReviewPage = () => {
	const { username, orderDetailId } = useParams();

	const [review, setReview] = useState("");
	const [stars, setStars] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [product, setProduct] = useState(null);

	useEffect(() => {
		const getProduct = async () => {
			try {
				const productData = await getProductByOrderDetail(orderDetailId);
				setProduct(productData);
			} catch (err) {
				setError("Failed to fetch product data.");
			}
		};

		getProduct();
	}, [orderDetailId]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await addReview(orderDetailId, {
				comment: review,
				ratingValue: stars,
			});
			console.log(response);

			toast.success("Đã thêm đánh giá!");
		} catch (err) {
			setError("Failed to save review. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const changeRating = (newRating) => {
		setStars(newRating);
	};

	return (
		<div className=" w-full lg:ps-64 mb-3">
			<h1 className="text-2xl font-bold m-5">
				Thêm review cho{" "}
				<span className="text-primary-500">
					{product ? product.name : "đơn hàng"}
				</span>
			</h1>
			<div className="flex align-middle justify-center">
				{product ? (
					<BestSellingProductCard product={product} key={product.id} />
				) : (
					<p>Đang tải...</p>
				)}
				<form onSubmit={handleSubmit} className="space-y-4 ml-9">
					<div>
						<label
							htmlFor="stars"
							className="block text-sm font-medium text-gray-700 m-1"
						>
							Đánh giá sao
						</label>
						<StarRatings
							rating={stars}
							starRatedColor="gold"
							starHoverColor="gold"
							changeRating={changeRating}
							numberOfStars={5}
							name="rating"
						/>
					</div>
					<div>
						<label
							htmlFor="review"
							className="block text-sm font-medium text-gray-700 mt-3 mb-1"
						>
							Viết gì đó cho mọi người biết về sản phẩm này
						</label>
						<textarea
							id="review"
							name="review"
							value={review}
							onChange={(e) => setReview(e.target.value)}
							rows="4"
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
							required
						/>
					</div>
					{error && <p className="text-red-500">{error}</p>}
					<div className="flex justify-end">
						<button
							type="submit"
							className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500"
							disabled={loading}
						>
							{loading ? "Đang xử lí..." : "Đăng đánh giá"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddReviewPage;
