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
import { useEffect, useState, useCallback } from 'react';
import { LuArrowBigLeft, LuArrowBigRight } from 'react-icons/lu';
import debounce from 'lodash/debounce';
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

	// Local state for input values
	const [saleYearInput, setSaleYearInput] = useState(selectedSaleYear);
	const [revenueYearInput, setRevenueYearInput] = useState(selectedRevenueYear);
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

		const fetchNewOrders = async () => {
			const newOrders = await getOrdersAmountByStatus('Order Received');
			setAnalyticsOverviewData((prevData) =>
				prevData.map((item) => (item.key === 'new_orders' ? { ...item, amount: newOrders } : item))
			);
		};

		const fetchDeliveredOrders = async () => {
			const successfulOrders = await getOrdersAmountByStatus('Delivered');
			setAnalyticsOverviewData((prevData) =>
				prevData.map((item) =>
					item.key === 'successful_orders' ? { ...item, amount: successfulOrders } : item
				)
			);
		};
		const fetchProcessingOrders = async () => {
			const processingOrders = await getOrdersAmountByStatus('Processing');
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
			try {
				const categories = await getAllCategories();
				setCategories(categories);

				const categoryCount = {};
				const categoryIdMap = {};

				categories.forEach((category) => {
					categoryCount[category.id] = 0;
					categoryIdMap[category.name] = category.id;
				});

				const products = await getAllProducts();
				products.forEach((product) => {
					const categoryId = categoryIdMap[product.category.name];
					if (categoryId) {
						categoryCount[categoryId]++;
					}
				});

				const categoryData = categories.map((category) => ({
					id: category.id,
					name: category.name,
					productCount: categoryCount[category.id] || 0,
				}));

				console.log(categoryData);
				setCategoriesData(categoryData);
			} catch (error) {
				console.error('Error fetching categories and products data:', error);
			}
		};

		const fetchBestSellerData = async () => {
			const bestSellers = await getBestSellerTopNth(5);
			setBestSellerData(bestSellers);
		};

		fetchAllRevenue();
		fetchDeliveredOrders();
		fetchNewOrders();
		fetchProcessingOrders();
		fetchProductData();
		fetchCategoriesAndProductsData();
		fetchBestSellerData();
	}, []);

	const fetchSaleDataInYear = useCallback(
		debounce(async (year) => {
			if (year) {
				const sales = await getOrdersAmountByStatusAndYear('Delivered', year);
				const updatedSalesData = { ...salesData };

				for (let i = 0; i < 12; i++) {
					updatedSalesData[Object.keys(updatedSalesData)[i]] = sales[i] || 0;
				}

				setSalesData(updatedSalesData);
			}
		}, 500),
		[salesData]
	);

	const fetchRevenueDataInYear = useCallback(
		debounce(async (year) => {
			if (year) {
				const revenues = await getRevenueByYear(year);
				const updatedRevenuesData = { ...revenueData };

				for (let i = 0; i < 12; i++) {
					updatedRevenuesData[Object.keys(updatedRevenuesData)[i]] = revenues[i] || 0;
				}

				setRevenueData(updatedRevenuesData);
			}
		}, 500),
		[revenueData]
	);

	useEffect(() => {
		fetchSaleDataInYear(selectedSaleYear);
	}, [selectedSaleYear, fetchSaleDataInYear]);

	useEffect(() => {
		fetchRevenueDataInYear(selectedRevenueYear);
	}, [selectedRevenueYear, fetchRevenueDataInYear]);
	//#endregion

	const handleRevenueYearChange = (year) => {
		setSelectedRevenueYear(Number(year));
		setRevenueYearInput(year);
		fetchRevenueDataInYear(Number(year));
	};

	const handleSaleYearChange = (year) => {
		setSelectedSaleYear(Number(year));
		setSaleYearInput(year);
		fetchSaleDataInYear(Number(year));
	};
	const handleRevenueYearInput = (e) => {
		setRevenueYearInput(Number(e.target.value));
	};

	const handleSaleYearInput = (e) => {
		setSaleYearInput(Number(e.target.value));
	};
	const handleRevenueKeyPress = (e) => {
		if (e.key === 'Enter') {
			if (revenueYearInput < 2024) {
				handleRevenueYearChange(2024);
			} else handleRevenueYearChange(revenueYearInput);
		}
	};
	const handleSaleKeyPress = (e) => {
		if (e.key === 'Enter') {
			if (saleYearInput < 2024) {
				handleSaleYearChange(2024);
			} else handleSaleYearChange(saleYearInput);
		}
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
									<p className='text-base font-medium text-default-500'>{overview.name}</p>
								</div>
							);
						})}
					</div>
					<div className='flex flex-wrap items-center justify-between gap-4'>
						<h3 className='text-xl font-semibold text-default-950'>Loại sản phẩm</h3>
						<Link
							href={`/${username}/categories`}
							className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-500'>
							View all <LuChevronRight size={20} />
						</Link>
					</div>
					<div className='flex flex-wrap gap-4'>
						{categoriesData.map((category) => {
							const barHeight = category.productCount * 10;
							return (
								<Link
									key={category.id}
									className='w-full p-4 sm:w-1/2 md:w-1/3 lg:w-1/6 space-y-4 rounded-lg border border-default-200 py-4 text-center transition-colors duration-300 hover:border-primary'
									href={`/${username}/categories/${category.id}`}>
									<div className='relative h-32 overflow-hidden rounded-lg bg-gray-200'>
										<div className='absolute bottom-0 left-0 right-0 h-full bg-gray-300'></div>
										<div
											className='absolute bottom-0 left-0 right-0 bg-primary'
											style={{ height: `${barHeight}%` }}></div>
									</div>
									<div className='mt-2 text-center'>
										<p className='font-medium text-default-600'>{category.name}</p>
										<p className='text-xs text-default-500'>{category.productCount} sản phẩm</p>
									</div>
								</Link>
							);
						})}
					</div>

					<div className=' gap-6 flex-col justify-between overflow-hidden rounded-lg border border-default-200 transition-all duration-300 hover:border-primary '>
						<div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2'>
							<div>
								<div className='flex flex-col items-center mb-4'>
									<h3 className='text-xl font-bold '>Doanh thu theo tháng</h3>
									<div className='flex items-center gap-4 mt-4'>
										<LuArrowBigLeft
											size={30}
											className={`cursor-pointer transition-colors ${selectedRevenueYear <= 2024 ? 'text-gray-400 cursor-not-allowed' : 'hover:text-green-500'}`}
											onClick={() =>
												selectedRevenueYear > 2024 &&
												handleRevenueYearChange(selectedRevenueYear - 1)
											}
											disabled={selectedRevenueYear <= 2024}
										/>
										<div className='flex items-center gap-2'>
											<span>Năm</span>
											<input
												id='year-input'
												type='number'
												className='border border-gray-300 rounded-md px-2 py-1'
												value={revenueYearInput}
												onChange={handleRevenueYearInput}
												min='2024'
												onKeyDown={handleRevenueKeyPress}
											/>
										</div>
										<LuArrowBigRight
											size={30}
											className='cursor-pointer transition-colors hover:text-green-500'
											onClick={() => handleRevenueYearChange(selectedRevenueYear + 1)}
										/>
									</div>
								</div>
								<SalesChart salesData={revenueData} unit={'Đồng'} />
							</div>

							<div>
								<div className='flex flex-col items-center mb-4'>
									<h2 className='text-xl font-bold'>Đơn hàng theo tháng</h2>
									<div className='flex items-center gap-4 mt-4'>
										<LuArrowBigLeft
											size={30}
											className={`cursor-pointer transition-colors ${selectedSaleYear <= 2024 ? 'text-gray-400 cursor-not-allowed' : 'hover:text-green-500'}`}
											onClick={() =>
												selectedSaleYear > 2024 && handleSaleYearChange(selectedSaleYear - 1)
											}
											disabled={selectedSaleYear <= 2024}
										/>
										<div className='flex items-center gap-2'>
											<span>Năm</span>
											<input
												id='year-input'
												type='number'
												className='border border-gray-300 rounded-md px-2 py-1'
												value={saleYearInput}
												onChange={handleSaleYearInput}
												min='2024'
												onKeyDown={handleSaleKeyPress}
											/>
										</div>
										<LuArrowBigRight
											size={30}
											className='cursor-pointer transition-colors hover:text-green-500'
											onClick={() => handleSaleYearChange(selectedSaleYear + 1)}
										/>
									</div>
								</div>
								<SalesChart salesData={salesData} unit='Sản phẩm' />
							</div>
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
							<div className='pt-10'>
								<div className='mb-10 flex flex-wrap items-center justify-between gap-4'>
									<h3 className='text-xl font-semibold text-default-950'>Best Selling Products</h3>
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
