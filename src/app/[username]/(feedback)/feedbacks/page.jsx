'use client';
import { BreadcrumbAdmin, FeedbackDataTable } from '@/components';
import { useState, useEffect } from 'react';

import * as yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//data
import { getAllFeedbacks } from '@/helpers';

// export const metadata = {
//   title: "Customers List",
// };

const CustomersList = () => {
	const [feedbackData, setFeedbackData] = useState([]);
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	// const [loading, setLoading] = useState(true);

	const dateFilterSchema = yup.object({
		filterByDateStart: yup
			.date()
			.max(new Date(), 'Ngày bắt đầu không thể ở tương lai')
			.nullable()
			.test(
				'start-before-end',
				'Ngày bắt đầu phải nằm trước ngày kết thúc',
				function (value) {
					const { filterByDateEnd } = this.parent;
					if (!value || !filterByDateEnd) {
						return true; // If one of the dates is missing, validation passes, assuming other rules handle emptiness appropriately
					}
					return (
						yup.date().isValid(value) &&
						yup.date().isValid(filterByDateEnd) &&
						value <= filterByDateEnd
					);
				}
			),

		filterByDateEnd: yup
			.date()
			.max(new Date(), 'Ngày kết thúc không thể ở tương lai')
			.nullable()
			.test(
				'end-after-start',
				'Ngày kết thúc phải nằm sau hoặc trùng với ngày bắt đầu',
				function (value) {
					const { filterByDateStart } = this.parent;
					if (!value || !filterByDateStart) {
						return true; // Validation logic is similar to above
					}
					return (
						yup.date().isValid(value) &&
						yup.date().isValid(filterByDateStart) &&
						value >= filterByDateStart
					);
				}
			),
	});

	const { control } = useForm({
		resolver: yupResolver(dateFilterSchema),
		mode: 'onChange',
		defaultValues: {
			filterByDateStart: new Date(),
			filterByDateEnd: new Date(),
		},
	});

	const startDateValue = useWatch({ control, name: 'filterByDateStart' });
	const endDateValue = useWatch({ control, name: 'filterByDateEnd' });

	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	};

	const isValidDateRange = (startDate, endDate) => {
		if (!startDate || !endDate) return false; // Ensure both dates are present

		const start = new Date(startDate);
		const end = new Date(endDate);
		const now = new Date();

		// Check if dates are in the future
		if (start > now || end > now) {
			return false;
		}

		// Check if end date is after or on the same day as start date
		if (end < start) {
			return false;
		}

		return true;
	};

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

	useEffect(() => {
		if (
			startDateValue &&
			endDateValue &&
			isValidDateRange(startDateValue, endDateValue)
		) {
			async function fetchFeedbackData() {
				const formattedStartDate = formatDate(startDateValue);
				const formattedEndDate = formatDate(endDateValue);
				const URL = `${BASE_URL}/feedback?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

				console.log(URL);

				try {
					const data = await getAllFeedbacks(URL);

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
					console.error('Error fetching logs:', error);
				}
			}

			fetchFeedbackData();
		}
	}, [startDateValue, endDateValue]);

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
					control={control}
				/>
			</div>
		</div>
	);
};

export default CustomersList;
