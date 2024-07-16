"use client";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";
import { Authorization } from "@/components/security";
import Link from "next/link";
import Image from "next/image";
import { LuChevronRight } from "react-icons/lu";
import { cn, toAlphaNumber } from "@/utils";
import {
	BestSellingProductCard,
	BreadcrumbAdmin,
	OrderDataTable,
} from "@/components";
import { orderRows } from "../(order)/orders/page";
import {
	analyticsOverviewData,
	categoriesData,
	dishesData,
} from "@/assets/data";
import { SalesChart } from "@/components/charts";
import PieChart from "@/components/charts/PieChart";
import { useState, useEffect } from "react";
import { getAlertDishesWithPagination } from "@/helpers";

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

	if (isLoading) {
		return <div></div>;
	}

	const columns = [
		{
			key: "id",
			name: "Order ID",
		},
		{
			key: "dish_id",
			name: "Dish",
		},
		{
			key: "amount",
			name: "Total",
		},
	];

	// Sample sales data
	const salesData = {
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
	};

	// Fixed category data
	const categoryData = [
		{ name: "Beverages", productCount: 50 },
		{ name: "Snacks", productCount: 30 },
		{ name: "Desserts", productCount: 20 },
		{ name: "Meals", productCount: 40 },
	];

	return (
		<Authorization
			allowedRoles={["ROLE_CUSTOMER", "ROLE_ADMIN"]}
			username={username}
		>
			<div className="w-full lg:ps-64">
				<div className="page-content space-y-6 p-6">
					<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6">
						{analyticsOverviewData.map((overview, idx) => {
							// const changeColor =
							// 	overview.change.split(' ')[1] == 'Increase' ? 'text-green-500' : 'text-red-500';
							return (
								<div
									key={overview.name + idx}
									className="flex flex-col justify-between overflow-hidden rounded-lg border border-default-200 p-4 text-center transition-all duration-300 hover:border-primary"
								>
									<h4 className="mb-2 text-2xl font-semibold text-primary">
										{toAlphaNumber(overview.amount)}
									</h4>
									<h6 className="mb-4 text-lg font-medium text-default-950">
										{overview.name}
									</h6>
									{/* <p className={cn('text-sm font-medium', changeColor)}>{overview.change}</p> */}
								</div>
							);
						})}
					</div>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 flex flex-col justify-between overflow-hidden rounded-lg border border-default-200 transition-all duration-300 hover:border-primary ">
						<div className="p-10">
							<SalesChart salesData={salesData} width={300} height={200} />
							<SalesChart salesData={salesData} width={300} height={200} />
						</div>
						<div className="p-10">
							<PieChart data={categoryData} />
						</div>
					</div>
					<div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
						<div className="pb-10">
							<div className="space-y-6">
								<div className="flex flex-wrap items-center justify-between gap-4">
									<h3 className="text-xl font-semibold text-default-950">
										Category
									</h3>
									<Link
										href={`/${username}/categories`}
										className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-500"
									>
										View all <LuChevronRight size={20} />
									</Link>
								</div>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
									{categoriesData.slice(0, 4).map((category) => (
										<Link
											key={category.id}
											href=""
											className="space-y-4 rounded-lg border border-default-200 py-4 text-center transition-colors duration-300 hover:border-primary"
										>
											<div>
												<Image
													src={category.image}
													width={56}
													height={56}
													className="mx-auto h-full max-w-full"
													alt="tea"
												/>
											</div>
											<h5 className="text-lg text-default-600">
												{category.name}
											</h5>
										</Link>
									))}
								</div>
							</div>

							<div className="pt-10">
								<div className="mb-10 flex flex-wrap items-center justify-between gap-4">
									<h3 className="text-xl font-semibold text-default-950">
										Best Selling Products
									</h3>
									<Link
										href="/dishes"
										className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-500"
									>
										View all <LuChevronRight size={20} />
									</Link>
								</div>
								<div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
									{dishesData
										.filter((dish) => dish.is_popular)
										.slice(0, 3)
										.map((dish) => (
											<BestSellingProductCard key={dish.id} product={dish} />
										))}
								</div>
							</div>
							<div className="pt-10">
								<div className="mb-10 flex flex-wrap items-center justify-between gap-4">
									<h3 className="text-xl font-semibold text-default-950">
										Sản phẩm hết nguyên liệu
									</h3>
									<Link
										href={`/${username}/out-dish-list`}
										className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-500"
									>
										Xem tất cả <LuChevronRight size={20} />
									</Link>
								</div>
								<div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
									{alertProductsData.map((dish) => (
										<BestSellingProductCard key={dish.id} product={dish} />
									))}
								</div>
							</div>
						</div>

						<div className="pb-10 ">
							{/* <OrderDataTable columns={columns} rows={orderRows} title='Recent Orders' /> */}
						</div>
					</div>
				</div>
			</div>
		</Authorization>
	);
};

export default Dashboard;
