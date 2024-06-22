"use client";
import Image from "next/image";
import Link from "next/link";
import { LuEye, LuPencil, LuLock, LuDiff, LuEraser } from "react-icons/lu";
import { DemoFilterDropdown } from "@/components/filter";
import GoToAddButton from "./GoToAddButton";
import { cn, toSentenceCase } from "@/utils";
import { currentCurrency } from "@/common";
import {
	deleteIngredient,
	getAllIngredients,
	updateIngredient,
} from "@/helpers"; // Ensure you have this helper to fetch and update the data
import { useEffect, useState } from "react";
import { getImagePath } from "@/utils";
import RestockModal from "../ui/RestockModal";

const IngredientDataTable = ({
	user,
	columns,
	title,
	buttonText,
	buttonLink,
}) => {
	const sortFilterOptions = ["Ascending", "Descending", "Trending", "Recent"];
	const { username } = user.data;
	const [ingredientsData, setIngredientsData] = useState([]);
	const [flag, setFlag] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [quantity, setQuantity] = useState("");
	const [selectedIngredient, setSelectedIngredient] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const ingredient = await getAllIngredients();
			setIngredientsData(ingredient);
		};
		fetchData();
	}, [flag]);
	console.log(ingredientsData);

	const handleStatusChange = async (ingredient, newStatus) => {
		try {
			const updatedIngredient = {
				...ingredient,
				status: newStatus,
				description: ingredient.description || "",
			};

			await updateIngredient(updatedIngredient, ingredient.id);
			setFlag(!flag);
		} catch (error) {
			console.error("Failed to update ingredient status: ", error);
		}
	};

	const handleOpenModal = (ingredient) => {
		setSelectedIngredient(ingredient);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setQuantity("");
		setSelectedIngredient(null);
	};

	const handleRestock = async () => {
		if (selectedIngredient && quantity !== "") {
			try {
				const updatedIngredient = {
					...selectedIngredient,
					quantity: selectedIngredient.quantity + parseInt(quantity, 10),
				};
				await updateIngredient(updatedIngredient, selectedIngredient.id);
				setFlag(!flag);
				handleCloseModal();
			} catch (error) {
				console.error("Failed to restock ingredient:", error);
			}
		}
	};

	return (
		<>
			<div className="overflow-hidden px-6 py-4">
				<div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
					<h2 className="text-xl font-semibold text-default-800">{title}</h2>
					<div className="flex flex-wrap items-center gap-4">
						<DemoFilterDropdown
							filterType="Sort"
							filterOptions={sortFilterOptions}
						/>
						<GoToAddButton buttonText={buttonText} buttonLink={buttonLink} />
					</div>
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
								{ingredientsData.map((row, idx) => (
									<tr
										key={row.id}
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
																src={require(
																	`../../../public/ingredients/${row.image}`
																)}
																height={48}
																width={48}
																alt="no image"
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
															href={`/${username}/ingredients/${row.id}`}
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
											} else if (column.key === "status") {
												return (
													<td
														key={tableData + idx}
														className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500"
													>
														{row.quantity === 0 && (
															<span className="text-red-500 ml-2">
																Hết hàng
															</span>
														)}
														{row.quantity <= 20 && row.quantity > 0 && (
															<span className="text-orange-500 ml-2">
																Sắp hết hàng
															</span>
														)}
														{row.quantity > 20 && (
															<span className="text-green-500 ml-2">
																Còn hàng
															</span>
														)}
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
														<Link href={`/${username}/ingredients/${row.id}`}>
															<LuPencil
																size={20}
																className="cursor-pointer transition-colors hover:text-primary"
															/>
														</Link>

														<LuDiff
															size={20}
															className={`cursor-pointer transition-colors hover:text-primary ${row.status === "disabled" ? "text-primary" : ""}`}
															onClick={() => handleOpenModal(row)}
														/>

														<LuLock
															size={20}
															className={`cursor-pointer transition-colors hover:text-red-500 ${row.status === "disabled" ? "text-red-500" : ""}`}
															onClick={() =>
																handleStatusChange(
																	row,
																	row.status === "disabled"
																		? "active"
																		: "disabled"
																)
															}
														/>
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
			<RestockModal
				show={showModal}
				handleClose={handleCloseModal}
				handleSave={handleRestock}
				quantity={quantity}
				setQuantity={setQuantity}
			/>
		</>
	);
};

export default IngredientDataTable;
