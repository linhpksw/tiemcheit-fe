"use client";
import { useState } from "react";
import { BreadcrumbAdmin } from "@/components";
import { Authorization } from "@/components/security";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";
import OutOfIngredientDishDataTable from "./OutOfIngredientDishDataTable";
import { FilterProvider } from "@/context";

const columns = [
	{
		key: "image",
		name: "Ảnh",
	},
	{
		key: "name",
		name: "Tên",
	},
	{
		key: "category_name",
		name: "Phân loại",
	},
	{
		key: "price",
		name: "Giá",
	},

	{
		key: "createdAt",
		name: "Thời điểm tạo(yyyy/mm/dd)",
	},
	{
		key: "status",
		name: "Trạng thái",
	},
];

const OutOfIngredientList = () => {
	const { username } = useParams();
	const { user, isLoading } = useUser();

	if (isLoading) {
		return <div></div>;
	}

	return (
		<Authorization allowedRoles={["ROLE_ADMIN"]} username={username}>
			<div className="w-full lg:ps-64">
				<div className="page-content space-y-6 p-6">
					<BreadcrumbAdmin title="Danh sách sản phẩm" subtitle="Dishes" />
					<div>
						<FilterProvider>
							<div className="grid grid-cols-1">
								<div className="rounded-lg border border-default-200 ">
									<OutOfIngredientDishDataTable
										user={user}
										columns={columns}
										title="Sản phẩm hết nguyên liệu"
									/>
								</div>
							</div>
						</FilterProvider>
					</div>
				</div>
			</div>
		</Authorization>
	);
};

export default OutOfIngredientList;
