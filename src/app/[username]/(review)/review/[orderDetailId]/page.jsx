"use client";
import React, { useState } from "react";
import StarRatings from "react-star-ratings";
import { addReview } from "@/helpers/data";
import { useParams } from "next/navigation";

const AddReviewPage = () => {
	const { username, orderDetailId } = useParams();

	const [review, setReview] = useState("");
	const [stars, setStars] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		// setError(null);

		const response = await addReview(orderDetailId, {
			comment: review,
			ratingValue: stars,
		});
		console.log(response);

		setLoading(false);
	};

	const changeRating = (newRating) => {
		setStars(newRating);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">
				Add Review for Order {orderDetailId}
			</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="stars"
						className="block text-sm font-medium text-gray-700"
					>
						Rating
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
						className="block text-sm font-medium text-gray-700"
					>
						Review
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
				<div>
					<button
						type="submit"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
						disabled={loading}
					>
						{loading ? "Submitting..." : "Submit Review"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddReviewPage;
