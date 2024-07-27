'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa6';
import { LuBanknote, LuCalendar, LuChevronDown, LuEye, LuWallet } from 'react-icons/lu';
import OngoingOrderCalendar from './OngoingOrderCalendar';
import { BreadcrumbAdmin, OrderDataTable } from '@/components';
import { toEnglish, toSentenceCase } from '@/utils';
import OrderStatistics from './OrderStatistics';
import { currentCurrency } from '@/common';
import { useState, useEffect, useMemo } from 'react';
import { robustFetch } from '@/helpers';
import { useUser } from '@/hooks';
import { DemoFilterDropdown } from '@/components';
import Datepicker from 'react-tailwindcss-datepicker';
import { formatISODate, formatDate } from '@/utils/format-date';
import { cn } from '@/utils';
import { useParams } from 'next/navigation';
import { dictionary } from '@/utils';
import PurchasedProducts from './PurchasedProducts';

const statusFilterOptions = [
	'Tất cả',
	'Nhận đơn',
	'Chờ hủy đơn',
	'Hủy đơn',
	'Xử lý',
	'Đang vận chuyển',
	'Đã giao',
	'Đã nhận hàng',
];

const statusStyleColor = [
	'',
	'bg-yellow-500/10 text-yellow-500',
	'bg-slate-500/10 text-slate-500',
	'bg-stone-500/10 text-stone-500',
	'bg-cyan-300/10 text-cyan-300',
	'bg-cyan-600/10 text-cyan-600',
	'bg-orange-500/10 text-orange-500',
	'bg-green-500/10 text-green-500',
];
const OrderList = () => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

	const { user, isLoading } = useUser();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);
	const [filters, setFilters] = useState({
		startDate: null,
		endDate: null,
		status: 'All',
	});
	const [hasCancelPendingOrders, setHasCancelPendingOrders] = useState(false); // New state
	const fetchOrders = async (filters) => {
		setLoading(true);
		try {
			let baseURL = `${BASE_URL}/orders`;
			if (user?.data?.roles[0]?.name === 'ADMIN') baseURL = `${BASE_URL}/orders/admin`;

			const params = new URLSearchParams();
			if (filters.startDate) params.append('startDate', formatDate(filters.startDate));
			if (filters.endDate) params.append('endDate', formatDate(filters.endDate));
			if (filters.status && filters.status !== 'All') params.append('status', filters.status);

			const query = params.toString();
			const fullURL = query ? `${baseURL}/filter?${query}` : baseURL;
			const response = await robustFetch(fullURL, 'GET', '', null);
			setOrders(response.data);

			// Check for "Cancel Pending" orders
			const hasCancelPending = response.data.some((order) => order.orderStatus === 'Cancel Pending');
			setHasCancelPendingOrders(hasCancelPending);
		} catch (err) {
			console.error('Error fetching order details:', err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (user) fetchOrders(filters);
	}, [user, filters, refresh]);

	useEffect(() => {
		setTimeout(function () {
			if (hasCancelPendingOrders) {
				alert('Có những đơn hàng có trạng thái "Hủy đang chờ xử lý"');
			}
		}, 500);
	}, [hasCancelPendingOrders]);

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
	};

	const columns = [
		{ key: 'orderDate', name: 'Ngày mua hàng' },
		{ key: 'id', name: 'Mã đơn hàng' },
		{ key: 'product', name: 'Các món chè' },
		{ key: 'amount', name: 'Tổng tiền' },
		{ key: 'orderStatus', name: 'Trạng thái' },
	];

	// check box field
	const [selectedOrders, setSelectedOrders] = useState([]);

	const handleCheckboxChange = (orderId) => {
		setSelectedOrders((prevSelected) =>
			prevSelected.includes(orderId) ? prevSelected.filter((id) => id !== orderId) : [...prevSelected, orderId]
		);
		console.log(selectedOrders);
	};
	const updateStatus = async (selectedOrders) => {
		try {
			const baseURL = `${BASE_URL}/orders/status?status=Processing`;
			const response = await robustFetch(baseURL, 'PATCH', 'Success Updated', selectedOrders);
			setRefresh((prev) => !prev);
		} catch (err) {
			console.error('Error fetching order details:', err);
		} finally {
		}
	};
	const updateOrderStatus = () => {
		// Function to update order status to "Processing"
		updateStatus(selectedOrders);
		setSelectedOrders([]);
	};

	const statistics = useMemo(() => {
		const totalItems = orders.reduce(
			(acc, order) => acc + order.orderDetails.reduce((sum, item) => sum + item.quantity, 0),
			0
		);
		const totalSpending = orders.reduce(
			(acc, order) => acc + order.orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0),
			0
		);
		const satisfactionLevel =
			(orders.filter((order) => order.orderStatus === 'Đã nhận hàng').length / orders.length) * 100;

		return {
			totalItems,
			totalSpending,
			satisfactionLevel,
		};
	}, [orders]);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='w-full lg:ps-64 bg-'>
			<div className='page-content space-y-6 p-6'>
				<BreadcrumbAdmin title='Danh sách đơn hàng' subtitle='Đơn hàng' />
				<div className='grid gap-6 xl:grid-cols-12'>
					<div className='xl:col-span-9'>
						<div className='space-y-6'>
							{user.data.roles[0].name === 'ADMIN' && (
								<div className='grid gap-6 sm:grid-cols-2'>
									<OrderStatistics
										title='Số lượng món đã đặt'
										stats={statistics.totalItems}
										icon={LuBanknote}
										variant='bg-primary/20 text-primary'
									/>
									<OrderStatistics
										title='Tổng chi tiêu'
										stats={`${currentCurrency}${statistics.totalSpending}`}
										icon={LuWallet}
										variant='bg-yellow-500/20 text-yellow-500'
									/>
								</div>
							)}
							<div className='grid grid-cols-1'>
								<div className='rounded-lg border border-default-200 bg-cy'>
									<div className=' p-6 bg-'>
										<div className='flex flex-wrap items-center gap-4 sm:justify-between lg:flex-nowrap'>
											<h2 className='text-xl font-semibold text-default-800'>Lịch sử mua hàng</h2>

											<div className='flex items-center justify-start gap-2'>
												{user.data.roles[0].name === 'ADMIN' && (
													<button
														className={`rounded bg-blue-500 px-4 py-2 text-white text-nowrap ${
															selectedOrders.length === 0
																? 'opacity-50 cursor-not-allowed'
																: ''
														}`}
														onClick={updateOrderStatus}
														disabled={selectedOrders.length === 0}>
														Xử lý đơn hàng
													</button>
												)}
												<DemoFilterDropdown
													filterType='Status'
													filterOptions={statusFilterOptions}
													onChange={(status) =>
														handleFilterChange({ ...filters, status: toEnglish(status) })
													}
													value={dictionary(filters.status)}
												/>
												<Datepicker
													value={{
														startDate: filters.startDate,
														endDate: filters.endDate,
													}}
													onChange={({ startDate, endDate }) =>
														handleFilterChange({
															...filters,
															startDate,
															endDate,
														})
													}
													popoverDirection='down'
													useRange={false}
													inputClassName='w-[300px] rounded-md focus:ring-0 border'
												/>
											</div>
										</div>
									</div>
									<div className='relative overflow-x-auto w-'>
										<div className='inline-block min-w-full align-middle bg-pr'>
											<div className='overflow-hidden'>
												<table className='w-full divide-y divide-default-200'>
													<thead className='bg-default-100'>
														<tr className='text-start'>
															{user.data.roles[0].name === 'ADMIN' && (
																<th className='whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800'></th>
															)}

															{columns.map((column) => (
																<th
																	key={column.key}
																	className='whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800'>
																	{column.name}
																</th>
															))}
														</tr>
													</thead>
													<tbody className='divide-y divide-default-200'>
														{orders.map((row, idx) => {
															const dish = row.orderDetails[0].product;
															const numOfDish = row.orderDetails.length;
															const total = row.orderDetails.reduce(
																(acc, item) => acc + item.price * item.quantity,
																0
															);
															const isSelected = selectedOrders.includes(row.id);
															return (
																<tr
																	key={idx}
																	className={isSelected ? 'bg-blue-100' : ''}>
																	{user.data.roles[0].name === 'ADMIN' && (
																		<td className='px-6 py-4'>
																			{row.orderStatus === 'Order Received' && (
																				<span className='rounded-md px-3 py-1 text-xs font-medium'>
																					<input
																						type='checkbox'
																						className='rounded-full scale-150'
																						checked={isSelected}
																						onChange={() =>
																							handleCheckboxChange(row.id)
																						}
																					/>
																				</span>
																			)}
																		</td>
																	)}

																	{columns.map((column) => {
																		const tableData = row[column.key];
																		if (column.key == 'product') {
																			const firstProduct =
																				row.orderDetails[0].product;
																			return (
																				<td
																					key={column.key}
																					className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800'>
																					<div className='flex items-center gap-4'>
																						<div className='shrink'>
																							<div className='h-18 w-18'>
																								<Image
																									//src={dish?.images[0] ?? ''}
																									className='h-full max-w-full'
																									width={72}
																									height={72}
																									alt={
																										firstProduct?.name ??
																										''
																									}
																								/>
																							</div>
																						</div>
																						<div className='grow'>
																							<p className='mb-1 text-sm text-default-500'>
																								{firstProduct?.name}
																							</p>
																						</div>
																					</div>
																					{numOfDish !== 1 && (
																						<p className='mt-2 text-xs text-default-500'>
																							{row.orderDetails.length -
																								1}{' '}
																							more dishes...
																						</p>
																					)}
																				</td>
																			);
																		} else if (column.key == 'orderStatus') {
																			const colorClassName =
																				statusStyleColor[
																					statusFilterOptions.indexOf(
																						dictionary(tableData)
																					)
																				];
																			return (
																				<td
																					key={column.key}
																					className='px-6 py-4'>
																					<span
																						className={cn(
																							'rounded-md px-3 py-1 text-xs font-medium',
																							colorClassName
																						)}>
																						{dictionary(tableData)}
																					</span>
																				</td>
																			);
																		} else if (column.key == 'id') {
																			return (
																				<td
																					key={column.key}
																					className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500 hover:text-primary-500'>
																					<Link
																						href={`/${user.data.username}/orders/${row.id}`}>
																						{row.id}
																					</Link>
																				</td>
																			);
																		} else if (column.key == 'orderDate') {
																			return (
																				<td
																					key={column.key}
																					className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500'>
																					{formatISODate(tableData)}
																				</td>
																			);
																		} else {
																			return (
																				<td
																					key={column.key}
																					className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500'>
																					{total}
																					{column.key == 'amount' &&
																						currentCurrency}
																				</td>
																			);
																		}
																	})}
																</tr>
															);
														})}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>
							{user.data.roles[0].name === 'CUSTOMER' && (
								<PurchasedProducts
									columns={[
										{
											key: 'image',
											name: 'Image',
										},
										{
											key: 'name',
											name: 'Dish Name',
										},
										{
											key: 'price',
											name: 'Price',
										},
									]}
									title={'Sản phẩm đã mua'}
									user={user}
								/>
							)}
						</div>
					</div>
					{/* <div className='xl:col-span-3'>
                        <div className='rounded-lg border border-default-200'>
                            <div className='p-6'>
                                <div className='mb-6'>
                                    <h2 className='mb-4 text-xl font-semibold text-default-800'>Ongoing Orders</h2>
                                    <div className='relative'>
                                        <span className='absolute start-2.5 top-1/2 -translate-y-1/2'>
                                            <LuCalendar size={16} className='text-default-700' />
                                        </span>
                                        <span className='absolute end-2.5 top-1/2 -translate-y-1/2'>
                                            <LuChevronDown size={16} className='text-default-700' />
                                        </span>

                                        <OngoingOrderCalendar />
                                    </div>
                                </div>
                                {Object.keys(orderProgressData).map((status, idx) => {
                                    return (
                                        <div className='mb-6' key={status + idx}>
                                            <div className='mb-4 flex flex-wrap items-center justify-between gap-4'>
                                                <h2 className='mb-0.5 text-xl font-semibold text-default-800'>
                                                    {toSentenceCase(status)}
                                                </h2>
                                                <Link href='/admin/orders/9f36ca'>
                                                    <LuEye size={18} />
                                                </Link>
                                            </div>
                                            <div className='flex flex-col gap-4'>
                                                {orderProgressData[status].map(async (order, index) => {
                                                    order.order = await getOrderById(order.order_id);
                                                    const dish = await getDishById(order.order?.dish_id ?? 0);
                                                    return (
                                                        <div
                                                            key={order.order_id + index}
                                                            className='flex items-center gap-4 rounded-lg bg-primary/10 p-2'>
                                                            <div className='flex h-16 w-16 items-center justify-center'>
                                                                <Image
                                                                    src={dish?.images[0] ?? ''}
                                                                    height={64}
                                                                    width={64}
                                                                    alt='food'
                                                                />
                                                            </div>
                                                            <div className='w-full'>
                                                                <h6 className='mb-1 flex items-center justify-between text-base font-medium text-default-900'>
                                                                    {dish?.name}
                                                                    <p className='me-1 text-xs font-medium text-default-400'>
                                                                        {order.time}
                                                                    </p>
                                                                </h6>
                                                                <p className='font-medium text-default-600'>
                                                                    {order.order_id.toUpperCase()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div> */}
				</div>
			</div>
		</div>
	);
};

export default OrderList;
