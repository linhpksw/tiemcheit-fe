'use-client';
import React, { useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { robustFetch } from '@/helpers';
import { toast } from 'sonner';

const orderStatus = [
	'Order Received',
	'Processing',
	'Out for Delivery',
	'Delivered',
	'Order Confirmed',
	'Order Canceled',
];

const OrderProgress = ({ orderId, status, refresh, isAdmin }) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	const [currentStatusIndex, setCurrentStatusIndex] = useState(orderStatus.indexOf(status));

	const updateStatus = async (option) => {
		try {
			const baseURL = `${BASE_URL}/orders/${orderId}/status?status=${option}`;
			console.log(baseURL);
			const response = await robustFetch(baseURL, 'PATCH', 'Success Updated', null);
			refresh();
		} catch (err) {
			console.error('Error fetching order details:', err);
		} finally {
		}
	};

	const handleStatusClick = (index) => {
		if (isAdmin && (index === currentStatusIndex + 1 || index <= currentStatusIndex)) {
			updateStatus(orderStatus[index]);
			setCurrentStatusIndex(index);
		} else if (isAdmin) {
			toast.error(`Cannot update status of order`, { position: 'bottom-right', duration: 2000 });
		}
	};

	let progressBarWidth = (currentStatusIndex * 100) / (orderStatus.length - 3);
	if (orderStatus[currentStatusIndex] === 'Delivered') {
		progressBarWidth = 100;
	}

	return (
		<div className='relative my-10'>
			<div className='mx-28 -mb-6 hidden md:flex'>
				<div className='flex h-1.5 w-full overflow-hidden rounded-full bg-default-200'>
					<div
						style={{ width: `${progressBarWidth}%` }}
						className='flex flex-col justify-center rounded-full bg-primary'
					/>
				</div>
			</div>
			<div className='absolute inset-y-0 start-1/2 flex -translate-x-1/2 md:hidden'>
				<div className='absolute inset-y-0 start-1/2 flex h-full w-1.5 -translate-x-1/2 overflow-hidden rounded-full bg-default-200'>
					<div className='absolute bottom-1/2 start-1/2 top-0 flex w-1.5 -translate-x-1/2 flex-col justify-center overflow-hidden rounded-full bg-primary' />
				</div>
			</div>

			<div className='relative z-10 grid grid-cols-4 items-center justify-between'>
				{orderStatus.map(
					(statusText, index) =>
						index <= 3 && (
							<div key={index} className='flex flex-col items-center justify-center'>
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-full ${index <= currentStatusIndex ? 'bg-primary text-white' : 'bg-default-200'}`}
									onClick={() => handleStatusClick(index)}
									style={{
										cursor: isAdmin && index === currentStatusIndex + 1 ? 'pointer' : 'default',
									}}>
									{index < currentStatusIndex ? (
										<LuCheck />
									) : (
										<span className='text-sm font-medium'>{index + 1}</span>
									)}
								</div>
								<h4 className='mt-3 rounded-lg bg-default-100 p-2 text-sm text-default-800 shadow md:bg-transparent md:shadow-none'>
									{statusText}
								</h4>
							</div>
						)
				)}
			</div>
		</div>
	);
};

export default OrderProgress;
