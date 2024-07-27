"use client";
import Image from "next/image";
import Link from "next/link";
import { LuEye, LuPencil, LuLock, LuPlus } from "react-icons/lu";
import { currentCurrency } from "@/common";
import {
	getCustomizedDishesOfUser,
	getProductDetailByIdWithOutAT,
} from "@/helpers";
import { useEffect, useState } from "react";
import { getImagePath } from "@/utils";
import QuantityModal from "./QuantityModal";
import IngredientListModal from "./IngredientListModal";
import { useShoppingContext } from "@/context";
import { toast } from "sonner";

const CreatedDishes = ({ user, columns, title }) => {
	const { addToCart } = useShoppingContext();
	const { username } = user.data;
	const [productsData, setProductsData] = useState([]);
	const [flag, setFlag] = useState(false);
	const [showModal1, setShowModal1] = useState(false);
	const [selectedIngredients, setSelectedIngredients] = useState([]);

	const handleOpenModal1 = async (dish) => {
		setSelectedIngredients(dish.ingredientList);
		setShowModal1(true);
	};

	const handleAddToCart = async (dish) => {
		var dish = await getProductDetailByIdWithOutAT(dish.id);
		try {
			await addToCart(dish, 1);
			alert("Đã thêm vào giỏ hàng");
		} catch (error) {
			toast.error("Đã xảy ra lỗi");
		}

		setFlag((prevFlag) => !prevFlag);
	};

	const handleCloseModal = () => {
		setShowModal1(false);
	};

	useEffect(() => {
		const fetchData = async () => {
			const product = await getCustomizedDishesOfUser(username);
			setProductsData(product);
		};
		fetchData();
	}, [flag]);

	return (
		<>
			<div className="overflow-hidden px-6 py-4">
				<div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
					<h2 className="text-xl font-semibold text-default-800">{title}</h2>
				</div>
			</div>
			<div className="relative overflow-x-auto">
				<div className="inline-block min-w-full align-middle">
					<div className="overflow-hidden">
						<table className="min-w-full divide-y divide-default-200">
							<thead className="bg-default-100">
								<tr className="text-start">
									{columns.map((column) => (
										<th
											key={column.key}
											className="whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800"
										>
											{column.name}
										</th>
									))}
									<th className="whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800">
										Nguyên liệu
									</th>
									<th className="whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800">
										Thao tác
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-default-200">
								{productsData.map((row, idx) => (
									<tr key={idx}>
										{columns.map((column) => {
											const tableData = row[column.key];
											if (column.key === "image") {
												return (
													<td
														key={tableData + idx}
														className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800"
													>
														<div className="h-12 w-12 shrink">
															<Image
																src={getImagePath(row.image)}
																height={48}
																width={48}
																alt={row.name}
																className="h-full max-w-full"
															/>
														</div>
													</td>
												);
											} else if (column.key === "name") {
												return (
													<td
														key={tableData + idx}
														className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800"
													>
														<Link
															href={`/${username}/dishes/${row.orderDetailId}`}
															className="flex items-center gap-3"
														>
															<p
																className={`text-base text-default-500 transition-all hover:text-primary ${row.status === "disabled" ? "line-through" : ""}`}
															>
																{tableData}
															</p>
														</Link>
													</td>
												);
											} else {
												return (
													<td
														key={tableData + idx}
														className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500"
													>
														{column.key === "price" && currentCurrency}
														{tableData}
													</td>
												);
											}
										})}
										<td className="px-6 py-4">
											<div className="flex gap-3">
												<>
													<button
														onClick={() => handleOpenModal1(row)}
														className="flex align-middle "
													>
														<LuEye
															size={20}
															className="cursor-pointer transition-colors hover:text-primary mr-2"
														/>
														Xem
													</button>
												</>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex gap-3">
												<>
													<button
														onClick={() => handleAddToCart(row)}
														className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500 "
													>
														<LuPlus
															size={20}
															className="cursor-pointer transition-colors hover:text-primary"
														/>
														Thêm vào giỏ
													</button>
												</>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			{showModal1 && (
				<IngredientListModal
					show={showModal1}
					handleClose={handleCloseModal}
					ingredients={selectedIngredients}
				/>
			)}
		</>
	);
};

export default CreatedDishes;
