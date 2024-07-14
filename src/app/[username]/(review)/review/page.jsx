"use client"
import React from "react";
import { useRouter, useSearchParams } from 'next/navigation';
// import AddReview from "./AddReview";

const ReviewPage = () => {
    const router = useRouter();
    const search = useSearchParams();

    const username = search.get('username');
    const orderDetailId = search.get('orderDetailId');

    // const { username, orderDetailId } = router.query;

    if (!username || !orderDetailId) {
        return <p>Loading...</p>;
    }

    return <AddReview username={username} orderDetailId={orderDetailId} />;
};

export default ReviewPage;
