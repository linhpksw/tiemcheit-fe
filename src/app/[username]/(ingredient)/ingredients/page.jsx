"use client";
import { BreadcrumbAdmin, IngredientDataTable } from "@/components";

import { Authorization } from "@/components/security";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";
// export const metadata = {
//   title: "Dishes List",
// };

const columns = [
	{
		key: "image",
		name: "Ảnh",
	},
	{
		key: "name",
		name: "Nguyên liệu",
	},
	{
		key: "status",
		name: "Trạng thái",
	},
	{
		key: "price",
		name: "Giá",
	},
	{
		key: "quantity",
		name: "Số lượng",
	},
];

const IngredientList = () => {
	const { username } = useParams();
	const { user, isLoading } = useUser();

	if (isLoading) {
		return <div></div>;
	}

	return (
		<Authorization allowedRoles={["ROLE_ADMIN"]} username={username}>
			<div className="w-full lg:ps-64">
				<div className="page-content space-y-6 p-6">
					<BreadcrumbAdmin title="Ingredient List" subtitle="Ingredients" />

					<div className="grid grid-cols-1">
						<div className="rounded-lg border border-default-200">
							<IngredientDataTable
								user={user}
								columns={columns}
								title="Danh sách nguyên liệu"
								buttonLink={`/${username}/add-ingredient`}
								buttonText="Thêm nguyên liệu"
							/>
						</div>
					</div>
				</div>
			</div>
		</Authorization>
	);
};

export default IngredientList;
