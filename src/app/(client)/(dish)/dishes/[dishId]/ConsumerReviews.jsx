"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaCircle, FaStar, FaStarHalfAlt } from "react-icons/fa";
// import cn from "classnames";
import { get } from "react-hook-form";
import { getReviewsOfProduct } from "@/helpers";
import { getImagePath } from "@/utils";
import { avatar1Img } from "@/assets/data";

const ConsumerReview = ({ id }) => {
    const [consumerReviews, setConsumerReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flag, setFlag] = useState(false);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchReviews = async () => {
            const response = await getReviewsOfProduct(id);
            setConsumerReviews(response);
        };
        fetchReviews();
        setLoading(false);
    }, [flag]);

    if (loading) {
        return <p>Loading...</p>;
    }
    const totalReviews = consumerReviews.length;
    const averageRating =
        (
            consumerReviews.reduce((sum, review) => sum + review.ratingValue, 0) /
            totalReviews
        ).toFixed(1) === "NaN"
            ? 0
            : (
                consumerReviews.reduce((sum, review) => sum + review.ratingValue, 0) /
                totalReviews
            ).toFixed(1);

    const ratingCounts = consumerReviews.reduce((acc, review) => {
        acc[review.ratingValue] = (acc[review.ratingValue] || 0) + 1;
        return acc;
    }, {});

    const stars = [5, 4, 3, 2, 1];

    const filteredReviews =
        filter === "all"
            ? consumerReviews
            : consumerReviews.filter(
                (review) => Math.floor(review.ratingValue) === parseInt(filter)
            );

    return (
        <div>
            <h4 className="mb-4 text-xl font-semibold text-default-800">
                Đánh giá của khách hàng
            </h4>
            <div className="grid items-center gap-5 lg:grid-cols-4">
                <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 py-8">
                    <div className="mb-4 text-6xl font-semibold text-default-800 flex items-center">
                        <div>{averageRating}</div>
                        <FaStar size={36} className="text-yellow-400 m-3" />
                    </div>
                    <h4 className="text-base font-medium text-default-700">
                        Đánh giá{" "}
                        <span className="font-normal text-default-500">
                            ({totalReviews})
                        </span>
                    </h4>
                </div>
                <div className="md:col-span-3 xl:col-span-2">
                    {stars.map((star, index) => {
                        const count = ratingCounts[star] || 0;
                        const percentage = (count / totalReviews) * 100;
                        return (
                            <div
                                key={index}
                                className="mb-3 grid items-center gap-2 md:grid-cols-12"
                            >
                                <div className="flex gap-1.5 md:col-span-3 lg:justify-center">
                                    {Array.from({ length: star }).map((_, i) => (
                                        <FaStar key={i} size={18} className="text-yellow-400" />
                                    ))}
                                    {Array.from({ length: 5 - star }).map((_, i) => (
                                        <FaStar key={i} size={18} className="text-default-200" />
                                    ))}
                                </div>
                                <div className="md:col-span-7">
                                    <div className="flex h-1 w-full overflow-hidden rounded-full bg-default-200">
                                        <div
                                            className="flex flex-col justify-center overflow-hidden rounded bg-primary"
                                            style={{ width: `${percentage}%` }}
                                            role="progressbar"
                                            aria-valuenow={percentage}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="font-normal text-default-500">
                                        ({count})
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="pt-10">
                <div className="mb-4 flex gap-2">
                    {["all", 5, 4, 3, 2, 1].map((star) => (
                        <button
                            key={star}
                            className={`px-3 py-1 border rounded ${filter === star ? "bg-primary text-white" : "bg-default-200 text-default-800"}`}
                            onClick={() => setFilter(star)}
                        >
                            {star === "all" ? (
                                "Tất cả"
                            ) : (
                                <div className="flex items-center">
                                    {star}
                                    <FaStar size={18} className="text-yellow-300 m-1" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review, idx) => (
                        <div
                            key={review.id}
                            className={`py-5 ${filteredReviews.length !== idx + 1 && "border-b border-default-200"}`}
                        >
                            <div className="mb-3 flex items-center">
                                <Image
                                    src={getImagePath(review.user.image) || avatar1Img}
                                    alt="avatar"
                                    height={48}
                                    width={48}
                                    className="me-4 h-12 w-12 rounded-full"
                                />
                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <h4 className="text-sm font-medium text-default-800">
                                            {review.user.fullname}
                                        </h4>
                                        <FaCircle size={5} className="text-default-400" />
                                        <h4 className="text-sm font-medium text-default-400">
                                            {review.updatedTime.split("T")[0]}
                                        </h4>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {Array.from(new Array(Math.floor(review.ratingValue))).map(
                                            (_val, idx) => (
                                                <FaStar
                                                    key={idx}
                                                    className="text-base text-yellow-400"
                                                />
                                            )
                                        )}
                                        {!Number.isInteger(review.ratingValue) && (
                                            <FaStarHalfAlt size={18} className="text-yellow-400" />
                                        )}
                                        {review.ratingValue < 5 &&
                                            Array.from(
                                                new Array(5 - Math.ceil(review.ratingValue))
                                            ).map((_val, idx) => (
                                                <FaStar
                                                    key={idx}
                                                    size={16}
                                                    className="text-default-200"
                                                />
                                            ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-default-600">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p>Không có đánh giá nào.</p>
                )}
            </div>
        </div>
    );
};

export default ConsumerReview;
