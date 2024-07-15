'use client';
import { BreadcrumbAdmin, FeedbackDataTable } from '@/components';
import { useState, useEffect } from 'react';

//data
import { getAllFeedbacks } from '@/helpers';

// export const metadata = {
//   title: "Customers List",
// };

const CustomersList = () => {
	const [feedbackData, setFeedbackData] = useState([]);
	// const [loading, setLoading] = useState(true);

	const columns = [
		{
			key: 'name',
			name: 'Tên',
		},
		{
			key: 'email',
			name: 'Email',
		},
		{
			key: 'sent_date',
			name: 'Ngày gửi',
		},
	];

	useEffect(() => {
		const fetchFeedbackData = async () => {
			try {
				const data = await getAllFeedbacks();

				const feedbackData = data.map((feedback) => {
					const [date, offsetTime] = feedback.sentAt.split('T');
					const [time] = offsetTime.split('.');
					const formattedTime = time.slice(0, 8);

					return {
						id: feedback.id,
						name: feedback.name,
						email: feedback.email,
						sent_date: date,
						sent_time: formattedTime,
						message: feedback.message,
						is_read: feedback.read,
					};
				});

				setFeedbackData(feedbackData);
			} catch (error) {
				console.error('Error fetching feedbacks:', error);
			}
		};

		fetchFeedbackData();
	}, []);

	return (
		<div className="w-full lg:ps-64">
			<div className="page-content space-y-6 p-6">
				<BreadcrumbAdmin title="Đánh giá" subtitle="Đánh giá" />

				<FeedbackDataTable
					rows={feedbackData}
					columns={columns}
					title="Feedbacks"
					buttonText="Add a new Customer"
					buttonLink="/admin/add-customer"
				/>
			</div>
		</div>
	);
};

export default CustomersList;
