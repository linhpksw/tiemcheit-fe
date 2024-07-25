'use client';
import Link from 'next/link';
import { LuDot } from 'react-icons/lu';
import { BreadcrumbAdmin, OrderDetailsCard, OrderDetailsDataTable } from '@/components';
import TotalPayment from './TotalPayment';
import OrderProgress from './OrderProgress';
import { useEffect, useState } from 'react';
import { robustFetch } from '@/helpers';
import { formatISODate } from '@/utils/format-date';
import { useUser } from '@/hooks';
import DropdownMenu from '@/components/ui/DropdownMenu';
import DialogCancelOrder from '@/components/ui/DialogCancelOrder';

const orderStatus = [
	'Order Received',
	'Processing',
	'Out for Delivery',
	'Delivered',
	'Order Confirmed',
	'Order Canceled',
];

const OrderDetails = ({ params }) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	const { user } = useUser();
	console.log(user);
	const [order, setOrder] = useState(null);
	const [orderDetails, setOrderDetails] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalPrice, setTotalPrice] = useState(0);
	const [refresh, setRefresh] = useState(false);
	const fetchData = async () => {
		try {
			const baseURL = `${BASE_URL}/orders/${params.orderId}`;
			const response = await robustFetch(baseURL, 'GET', '', null);
			setOrder(response.data);
			setOrderDetails(response.data.orderDetails);
			// Calculate total price when order details are fetched
			const calculatedPrice = response.data.orderDetails.reduce(
				(acc, item) => acc + item.price * item.quantity,
				0
			);
			setTotalPrice(calculatedPrice);
		} catch (err) {
			console.error('Error fetching order details:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) fetchData();
	}, [user, refresh]); // Re-run the effect when 'id' changes

	const excludedStatuses = ['Order Confirmed', 'Order Canceled', 'Order Refunded'];

	const handleConfirmReceived = async () => {
		try {
			const response = await robustFetch(`${BASE_URL}/orders/${params.orderId}/confirm`, 'PATCH', null, null);

			// Refresh the order details after updating the status
			setRefresh((prev) => !prev);
		} catch (error) {
			console.error('Error:', error);
		}
	};
	const handleCancelOrder = async (data) => {
		try {
			const response = await robustFetch(
				`${BASE_URL}/orders/${params.orderId}/cancel?reason=${data.reason}`,
				'PATCH',
				'Cancel order successfully',
				null
			);

			// Refresh the order details after updating the status
			setRefresh((prev) => !prev);
		} catch (error) {
			console.error('Error:', error);
		}
	};
	const columns = [
		{
			key: 'name',
			name: 'Món chè',
		},
		{
			key: 'price',
			name: 'Giá tiền',
		},
		{
			key: 'quantity',
			name: 'Số lượng',
		},
	];

	if (loading) {
		return <h6 className='hidden text-base text-default-950 lg:flex'>Loading...</h6>;
	}

	return (
		<div className='w-full lg:ps-64'>
			<div className='page-content space-y-6 p-6'>
				<BreadcrumbAdmin title='Thông tin đơn hàng' subtitle='Đơn hàng' link='/admin/orders' />
				<div className='rounded-lg border border-default-200'>
					<div className='flex flex-wrap items-center gap-3 border-b border-default-200 p-6'>
						{order && <h4 className='text-xl font-medium text-default-900'>Đơn hàng #{order.id}</h4>}
						<div className='flex flex-wrap items-center gap-3'>
							<LuDot />
							<h4 className='text-sm text-default-600'>{formatISODate(order.orderDate)}</h4>
						</div>
						<div className='flex flex-wrap items-center gap-3'>
							<LuDot />
							<h4 className='text-sm text-default-600'>{order.orderDetails.length} Món</h4>
						</div>
						<div className='ms-auto'>
							{order.orderStatus === 'Order Received' && (
								<DialogCancelOrder updateStatus={handleCancelOrder} />
								// <button
								// 	type='button'
								// 	onClick={handleConfirmReceived}
								// 	className='px-10 rounded-lg border bg-red-500/10 py-3 text-center text-sm font-medium text-red-500 shadow-sm transition-all duration-500 hover:bg-red-500 hover:text-white'>
								// 	Cancel Order
								// </button>
							)}
							{order.orderStatus === 'Delivered' && (
								<button
									type='button'
									onClick={handleConfirmReceived}
									className='rounded-lg border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500'>
									Đã nhận hàng
								</button>
							)}
							<Link href='/admin/orders' className='ml-4 text-base font-medium text-primary'>
								Trở về
							</Link>
						</div>
					</div>
					<div className='p-6'>
						<div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
							<div className='md:col-span-2 xl:col-span-3'>
								{excludedStatuses.includes(order.orderStatus) && <div>{order.orderStatus}</div>}
								{!excludedStatuses.includes(order.orderStatus) && (
									<OrderProgress
										status={order.orderStatus}
										refresh={fetchData}
										orderId={order.id}
										isAdmin={user.data.roles[0].name === 'ADMIN'}
									/>
								)}
								<OrderDetailsDataTable columns={columns} rows={orderDetails} />
								{order.message && (
									<div className='rounded-lg border border-default-200 mt-4'>
										<div className='border-b border-default-200 px-4 py-2'>
											<h4 className='text-lg font-medium text-default-800'>Ghi chú :</h4>
										</div>
										<div className='px-4'>
											<div className='flex justify-between border-b border-default-200 py-2'>
												<p className=' text-md text-default-600'>{order.message}</p>
											</div>
										</div>
									</div>
								)}
							</div>
							<div className='md:col-span-2 xl:col-span-1'>
								<TotalPayment
									currentCurrency={totalPrice.toFixed(0)}
									discount={order.discountPrice ? order.discountPrice : 0}
								/>
								<div className='m-5'></div>
								<div className='rounded-lg border border-default-200'>
									<div className='border-b border-default-200 px-4 py-2'>
										<h4 className='text-lg font-medium text-default-800'>Địa chỉ giao hàng :</h4>
									</div>
									<div className='px-4'>
										<div className='flex justify-between border-b border-default-200 py-2'>
											<p className=' text-md text-default-600'>{order.shippingAddress}</p>
										</div>
									</div>
								</div>
								<div className='m-5'></div>
								<div className='rounded-lg border border-default-200'>
									<div className='border-b border-default-200 px-4 py-2'>
										<h4 className='text-lg font-medium text-default-800'>Thông tin khách hàng :</h4>
									</div>
									<div className='px-4'>
										<h4 className='mb-1 text-base font-medium text-default-800'>Tên :</h4>
										<p className='mb-4 text-sm text-default-600'>{order.user.fullname}</p>
										<h4 className='mb-1 text-base font-medium text-default-800'>Địa chỉ :</h4>
										<p className='mb-4 text-sm text-default-600'>
											{order.user.addresses[0].address}
										</p>
										<h4 className='mb-1 text-base font-medium text-default-800'>Địa chỉ email :</h4>
										<p className='mb-4 text-sm text-default-600'>{order.user.email}</p>
										<h4 className='mb-1 text-base font-medium text-default-800'>Số điện thoại :</h4>
										<p className='mb-4 text-sm text-default-600'>{order.user.phone}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;
