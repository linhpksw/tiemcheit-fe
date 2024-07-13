import React from "react";
import { useRouter } from "next/router";
import AddReview from "./AddReview";

const ReviewPage = () => {
	const router = useRouter();
	const { username, orderDetailId } = router.query;

	if (!username || !orderDetailId) {
		return <p>Loading...</p>;
	}

	return <AddReview username={username} orderDetailId={orderDetailId} />;
};

export default ReviewPage;
