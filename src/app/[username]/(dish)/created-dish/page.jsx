"use client";

import { BreadcrumbAdmin, OrderDataTable } from "@/components";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks";

import CreatedDishes from "./CreatedDishes";

const OrderList = () => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

	const { user, isLoading } = useUser();

	const [quantity, setQuantity] = useState("");

	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			<div className="w-full lg:ps-64">
				<div className="page-content space-y-6 p-6">
					<BreadcrumbAdmin title="Món chè đã tạo" subtitle="Đã tạo" />

					<CreatedDishes
						columns={[
							{
								key: "name",
								name: "Tên sản phẩm",
							},
							{
								key: "price",
								name: "Giá",
							},
						]}
						title={"Món chè đã tạo"}
						user={user}
					/>
				</div>
			</div>
		</>
	);
};

export default OrderList;
