'use client';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';
import { Authorization } from '@/components/security';
import Link from 'next/link';
import Image from 'next/image';
import { LuChevronRight } from 'react-icons/lu';
import { cn, toAlphaNumber, toSentenceCase } from '@/utils';
import { BestSellingProductCard, BreadcrumbAdmin, OrderDataTable } from '@/components';
import { SalesChart } from '@/components/charts';
import PieChart from '@/components/charts/PieChart';
import { useEffect, useState } from 'react';
import {
	getAllCategories,
	getAllIngredients,
	getAllProducts,
	getBestSellerTopNth,
	getDeliveredOrdersAmount,
	getOrdersAmountByStatus,
	getOrdersAmountByStatusAndYear,
	getRevenue,
	getRevenueByYear,
} from '@/helpers';
import { getAlertDishesWithPagination } from '@/helpers';

const status = ['active', 'inactive', 'disabled'];
const Dashboard = () => {
	const { username } = useParams();
	const { user, isLoading } = useUser();
	const [alertProductsData, setAlertProductsData] = useState([]);
	const [flag, setFlag] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const productPage = await getAlertDishesWithPagination(0, 5);
			setAlertProductsData(productPage.content);
		};
		fetchData();
	}, [flag]);

	const [bestSellerData, setBestSellerData] = useState([]);

	const [productStatusData, setProductStatusData] = useState([]);
	const [categoriesData, setCategoriesData] = useState([]);
	const [categories, setCategories] = useState([]);
	const [ingredientsData, setIngredientsData] = useState([]);

	const [selectedSaleYear, setSelectedSaleYear] = useState(2024);
	const [selectedRevenueYear, setSelectedRevenueYear] = useState(2024);
	const columns = [
		{
			key: 'id',
			name: 'Order ID',
		},
		{
			key: 'dish_id',
			name: 'Dish',
		},
		{
			key: 'amount',
			name: 'Total',
		},
	];

	const [analyticsOverviewData, setAnalyticsOverviewData] = useState([
		{
			key: 'total_revenue',
			name: 'Doanh thu',
			amount: 0, // Set initial amount to 0
			// change: '10% Increase',
		},
		{
			key: 'new_orders',
			name: 'Đơn đặt hàng mới',
			amount: 0,
			// change: '50% Increase',
		},
		{
			key: 'received_orders',
			name: 'Đơn đặt hàng đã nhận',
			amount: 0,
			// change: '34% Increase',
		},
		{
			key: 'successful_orders',
			name: 'Đơn đặt hàng thành công',
			amount: 0,
			// change: '8% Decrease',
		},
	]);

	//#region chart data
	const [salesData, setSalesData] = useState({
		'Tháng 1': 0,
		'Tháng 2': 0,
		'Tháng 3': 0,
		'Tháng 4': 0,
		'Tháng 5': 0,
		'Tháng 6': 0,
		'Tháng 7': 0,
		'Tháng 8': 0,
		'Tháng 9': 0,
		'Tháng 10': 0,
		'Tháng 11': 0,
		'Tháng 12': 0,
	});
	const [revenueData, setRevenueData] = useState({
		'Tháng 1': 0,
		'Tháng 2': 0,
		'Tháng 3': 0,
		'Tháng 4': 0,
		'Tháng 5': 0,
		'Tháng 6': 0,
		'Tháng 7': 0,
		'Tháng 8': 0,
		'Tháng 9': 0,
		'Tháng 10': 0,
		'Tháng 11': 0,
		'Tháng 12': 0,
	});
	//#endregion

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
			const statusCount = status.reduce((acc, status) => {
				acc[status] = 0;
				return acc;
			}, {});
			products.forEach((product) => {
				if (statusCount[product.status] !== undefined) {
					statusCount[product.status]++;
				}
			});
			const statusData = Object.keys(statusCount).map((status) => ({
				name: toSentenceCase(status),
				productCount: statusCount[status],
			}));
			setProductStatusData(statusData);
		};

		const fetchCategoriesAndProductsData = async () => {
			const categories = await getAllCategories();
			setCategories(categories);
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

		const fetchBestSellerData = async () => {
			const bestSellers = await getBestSellerTopNth(5);
			setBestSellerData(bestSellers);
		};

		fetchAllRevenue();
		fetchDeliveredOrders();
		fetchProcessingOrders();
		fetchProductData();
		fetchCategoriesAndProductsData();
		fetchBestSellerData();
	}, []);

	//#region Pie chart data
	useEffect(() => {
		const fetchSaleDataInYear = async (year) => {
			const sales = await getOrdersAmountByStatusAndYear('delivered', year);
			const updatedSalesData = { ...salesData };

			for (let i = 0; i < 12; i++) {
				updatedSalesData[Object.keys(updatedSalesData)[i]] = sales[i] || 0;
			}

			setSalesData(updatedSalesData);
		};

		fetchSaleDataInYear(selectedSaleYear);
	}, [selectedSaleYear]);

	useEffect(() => {
		const fetchSaleDataInYear = async (year) => {
			const revenues = await getRevenueByYear(year);
			const updatedRevenuesData = { ...revenueData };

			for (let i = 0; i < 12; i++) {
				updatedRevenuesData[Object.keys(updatedRevenuesData)[i]] = revenues[i] || 0;
			}

			setRevenueData(updatedRevenuesData);
		};

		fetchSaleDataInYear(selectedRevenueYear);
	}, [selectedRevenueYear]);
	//#endregion

	const handleSaleYearChange = (year) => {
		setSelectedSaleYear(year);
	};

	const handleRevenueYearChange = (year) => {
		setSelectedRevenueYear(year);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Authorization allowedRoles={['ROLE_EMPLOYEE', 'ROLE_ADMIN']} username={username}>
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
					<div className='grid grid-cols-1 gap-6 lg:grid-cols-2 flex-col justify-between overflow-hidden rounded-lg border border-default-200 transition-all duration-300 hover:border-primary '>
						<div className='p-10'>
							<SalesChart
								salesData={salesData}
								unit='Sản phẩm'
								label={'Số lượng sản phẩm đã bán'}
								width={300}
								height={200}
							/>
							<SalesChart
								salesData={revenueData}
								unit='đồng'
								label={'Doanh thu theo tháng'}
								width={300}
								height={200}
							/>
						</div>
						<div className='p-10 justify-center grid grid-cols-1 lg:grid-cols-2 gap-8'>
							<div>
								<div className='mb-6'>
									<PieChart
										data={productStatusData}
										height={400}
										width={400}
										colors={[
											'rgba(16, 185, 129, 1)',
											'rgba(234, 179, 8, 1)',
											'rgba(107, 114, 128, 1)',
										]}
										title={'Trạng thái sản phẩm'}
									/>
								</div>
							</div>
							<div>
								<div>
									<PieChart data={categoriesData} height={400} width={400} title={'Loại sản phẩm'} />
								</div>
							</div>
						</div>
					</div>
					<div className='grid grid-cols-1 gap-6 '>
						<div className='pb-10'>
							<div className='space-y-6'>
								<div className='flex flex-wrap items-center justify-between gap-4'>
									<h3 className='text-xl font-semibold text-default-950'>Loại sản phẩm</h3>
									<Link
										href={`/${username}/categories`}
										className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-500'>
										View all <LuChevronRight size={20} />
									</Link>
								</div>
								<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4'>
									{categories.map((category) => (
										<Link
											key={category.id}
											href={`/${username}/categories/${category.id}`}
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
								<div className='grid grid-cols-2 gap-6 lg:grid-cols-5'>
									{bestSellerData.slice(0, 5).map((dish) => (
										<BestSellingProductCard key={dish.id} product={dish} />
									))}
								</div>
							</div>
							<div className='pt-10'>
								<div className='mb-10 flex flex-wrap items-center justify-between gap-4'>
									<h3 className='text-xl font-semibold text-default-950'>Sản phẩm hết nguyên liệu</h3>
									<Link
										href={`/${username}/out-dish-list`}
										className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-500'>
										Xem tất cả <LuChevronRight size={20} />
									</Link>
								</div>
								<div className='grid grid-cols-2 gap-6 lg:grid-cols-5'>
									{alertProductsData.map((dish) => (
										<BestSellingProductCard key={dish.id} product={dish} />
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Authorization>
	);
};

export default Dashboard;
