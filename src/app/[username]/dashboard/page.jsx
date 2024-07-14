'use client';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';
import { Authorization } from '@/components/security';
import Link from 'next/link';
import Image from 'next/image';
import { LuChevronRight } from 'react-icons/lu';
import { cn, toAlphaNumber, toSentenceCase } from '@/utils';
import { BestSellingProductCard, BreadcrumbAdmin, OrderDataTable } from '@/components';
import { orderRows } from '../(order)/orders/page';
import { categoriesData, dishesData } from '@/assets/data';
import { SalesChart } from '@/components/charts';
import PieChart from '@/components/charts/PieChart';
import { useEffect, useState } from 'react';
import {
	getAllCategories,
	getAllProducts,
	getDeliveredOrdersAmount,
	getOrdersAmountByStatus,
	getRevenue,
} from '@/helpers';

const salesData = {
	2023: {
		January: 150,
		February: 200,
		March: 300,
		April: 250,
		May: 400,
		June: 350,
		July: 500,
		August: 450,
		September: 300,
		October: 350,
		November: 400,
		December: 550,
	},
	2024: {
		January: 200,
		February: 250,
		March: 350,
		April: 300,
		May: 450,
		June: 400,
		July: 550,
		August: 500,
		September: 350,
		October: 400,
		November: 450,
		December: 600,
	},
};

const Dashboard = () => {
	const { username } = useParams();
	const { user, isLoading } = useUser();
	const [selectedYear, setSelectedYear] = useState(2024);
	const [productStatusData, setProductStatusData] = useState([]);
	const [categoriesData, setCategoriesData] = useState([]);

	const [analyticsOverviewData, setAnalyticsOverviewData] = useState([
		{
			key: 'total_revenue',
			name: 'Total Revenue',
			amount: 0, // Set initial amount to 0
			// change: '10% Increase',
		},
		{
			key: 'new_orders',
			name: 'New Orders',
			amount: 0,
			// change: '50% Increase',
		},
		{
			key: 'received_orders',
			name: 'Received Orders',
			amount: 0,
			// change: '34% Increase',
		},
		{
			key: 'successful_orders',
			name: 'Successful Orders',
			amount: 0,
			// change: '8% Decrease',
		},
	]);

	useEffect(() => {
		const fetchAllRevenue = async () => {
			const revenue = await getRevenue();
			// Update the Total Revenue amount in the overview data
			setAnalyticsOverviewData((prevData) =>
				prevData.map((item) => (item.key === 'total_revenue' ? { ...item, amount: revenue } : item))
			);
		};

		const fetchDeliveredOrders = async () => {
			const successfulOrders = await getOrdersAmountByStatus('delivered');
			setAnalyticsOverviewData((prevData) =>
				prevData.map((item) =>
					item.key === 'successful_orders' ? { ...item, amount: successfulOrders } : item
				)
			);
		};
		const fetchProcessingOrders = async () => {
			const processingOrders = await getOrdersAmountByStatus('processing');
			setAnalyticsOverviewData((prevData) =>
				prevData.map((item) => (item.key === 'new_orders' ? { ...item, amount: processingOrders } : item))
			);
		};
		const fetchProductData = async () => {
			const products = await getAllProducts();
			const statusCount = products.reduce((acc, product) => {
				const status = product.status;
				if (!acc[status]) {
					acc[status] = 0;
				}
				acc[status]++;
				return acc;
			}, {});
			const statusData = Object.keys(statusCount).map((status) => ({
				name: toSentenceCase(status),
				productCount: statusCount[status],
			}));
			setProductStatusData(statusData);
		};

		const fetchCategoriesAndProductsData = async () => {
			const categories = await getAllCategories();
			const categoryCount = {};
			categories.forEach((category) => {
				categoryCount[category.name] = 0;
			});
			const products = await getAllProducts();
			products.forEach((product) => {
				categoryCount[product.category.name]++;
			});
			const categoryData = Object.keys(categoryCount).map((category) => ({
				name: category,
				productCount: categoryCount[category],
			}));
			setCategoriesData(categoryData);
		};

		fetchAllRevenue();
		fetchDeliveredOrders();
		fetchProcessingOrders();
		fetchProductData();
		fetchCategoriesAndProductsData();
	}, []);

	const handleYearChange = (year) => {
		setSelectedYear(year);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Authorization allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']} username={username}>
			<div className='w-full lg:ps-64'>
				<div className='page-content space-y-6 p-6'>
					<div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6'>
						{analyticsOverviewData.map((overview, idx) => {
							// const changeColor =
							// 	overview.change.split(' ')[1] == 'Increase' ? 'text-green-500' : 'text-red-500';
							return (
								<div
									key={overview.key + idx}
									className='flex flex-col justify-between overflow-hidden rounded-lg border border-default-200 p-4 text-center transition-all duration-300 hover:border-primary'>
									<h4 className='mb-2 text-2xl font-semibold text-primary'>
										{toAlphaNumber(overview.amount)}
									</h4>
									<h6 className='mb-4 text-lg font-medium text-default-950'>{overview.name}</h6>
									{/* <p className={cn('text-sm font-medium', changeColor)}>{overview.change}</p> */}
								</div>
							);
						})}
					</div>
					<div className='grid grid-cols-1 gap-6 lg:grid-cols-2 flex flex-col justify-between overflow-hidden rounded-lg border border-default-200 transition-all duration-300 hover:border-primary '>
						<div className='p-10'>
							<SalesChart salesData={salesData[selectedYear]} width={300} height={200} />
							<SalesChart salesData={salesData[selectedYear]} width={300} height={200} />
						</div>
						<div className='p-10 flex justify-center'>
							<div>
								<div className='mb-6'>
									<PieChart
										data={productStatusData}
										height={250}
										width={250}
										colors={[
											'rgba(16, 185, 129, 1)',
											'rgba(234, 179, 8, 1)',
											'rgba(107, 114, 128, 1)',
										]}
									/>
								</div>
								<div>
									<PieChart data={categoriesData} height={250} width={250} />
								</div>
							</div>
						</div>
					</div>
					<div className='grid grid-cols-1 gap-6 2xl:grid-cols-2'>
						<div className='pb-10'>
							<div className='space-y-6'>
								<div className='flex flex-wrap items-center justify-between gap-4'>
									<h3 className='text-xl font-semibold text-default-950'>Category</h3>
									<Link
										href={`/${username}/categories`}
										className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-500'>
										View all <LuChevronRight size={20} />
									</Link>
								</div>
								<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4'>
									{categoriesData.slice(0, 4).map((category) => (
										<Link
											key={category.id}
											href=''
											className='space-y-4 rounded-lg border border-default-200 py-4 text-center transition-colors duration-300 hover:border-primary'>
											<div>
												<Image
													src={category.image}
													width={56}
													height={56}
													className='mx-auto h-full max-w-full'
													alt='tea'
												/>
											</div>
											<h5 className='text-lg text-default-600'>{category.name}</h5>
										</Link>
									))}
								</div>
							</div>

							<div className='pt-10'>
								<div className='mb-10 flex flex-wrap items-center justify-between gap-4'>
									<h3 className='text-xl font-semibold text-default-950'>Best Selling Products</h3>
									<Link
										href='/dishes'
										className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-500'>
										View all <LuChevronRight size={20} />
									</Link>
								</div>
								<div className='grid grid-cols-2 gap-6 lg:grid-cols-3'>
									{dishesData
										.filter((dish) => dish.is_popular)
										.slice(0, 3)
										.map((dish) => (
											<BestSellingProductCard key={dish.id} product={dish} />
										))}
								</div>
							</div>
						</div>

						<div className='pb-10 '>
							{/* <OrderDataTable columns={columns} rows={orderRows} title='Recent Orders' /> */}
						</div>
					</div>
				</div>
			</div>
		</Authorization>
	);
};

export default Dashboard;
