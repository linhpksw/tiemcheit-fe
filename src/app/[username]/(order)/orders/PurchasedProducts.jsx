"use client";
import Image from "next/image";
import Link from "next/link";
import { LuEye, LuPencil, LuLock } from "react-icons/lu";
import { currentCurrency } from "@/common";
import { getPurchasedProducts, updateProduct } from "@/helpers"; // Ensure you have this helper to fetch and update the data
import { useEffect, useState } from "react";
import { getImagePath } from "@/utils";

const PurchasedProducts = ({ user, columns, title }) => {
	const { username } = user.data;
	const [productsData, setProductsData] = useState([]);
	const [flag, setFlag] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const product = await getPurchasedProducts(username);
			setProductsData(product);
		};
		fetchData();
	}, [flag]);
	console.log("data: ", productsData);

	const handleStatusChange = async (product, newStatus) => {
		try {
			const updatedProduct = {
				...product,
				status: newStatus,
				description: product.description || "",
			};

			const response = await updateProduct(updatedProduct, product.id);

			setFlag(!flag);
		} catch (error) {
			console.error("Failed to update product status: ", error);
		}
	};

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
										Action
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-default-200">
								{productsData.map((row, idx) => (
									<tr
										key={idx}
										className={`${row.status === "disabled" ? "bg-gray-200 line-through" : ""} ${row.quantity === 0 ? "bg-red-100" : ""}`}
									>
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
											} else if (column.key === "category_name") {
												return (
													<td
														key={tableData + idx}
														className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500"
													>
														{row.category.name}
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
												{row.status === "inactive" ? (
													<>
														<button
															className="cursor-pointer transition-colors hover:text-primary"
															onClick={() =>
																handleStatusChange(row.id, "active")
															}
														>
															Publish
														</button>
														<button
															className="cursor-pointer transition-colors hover:text-red-500"
															onClick={() =>
																handleStatusChange(row.id, "deleted")
															}
														>
															Delete
														</button>
													</>
												) : (
													<>
														<Link
															href={`/${username}/review/${row.id}`}
															className="flex align-middle "
														>
															<LuPencil
																size={20}
																className="cursor-pointer transition-colors hover:text-primary"
															/>
															Đánh giá
														</Link>
													</>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

export default PurchasedProducts;
