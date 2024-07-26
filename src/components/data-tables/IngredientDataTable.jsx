"use client";
import Image from "next/image";
import Link from "next/link";
import {
	LuEye,
	LuPencil,
	LuLock,
	LuDiff,
	LuEraser,
	LuSearch,
} from "react-icons/lu";
import { DemoFilterDropdown } from "@/components/filter";
import GoToAddButton from "./GoToAddButton";
import { currentCurrency } from "@/common";
import {
	deleteIngredient,
	getIngredientWithPaginationAndFilter,
	updateIngredient,
} from "@/helpers"; // Ensure you have this helper to fetch and update the data
import { useEffect, useState } from "react";
import { getIngredientImagePath } from "@/utils";
import RestockModal from "../ui/RestockModal";
import IngredientFilterDropDown from "../filter/IngredientFilterDropDown";

const sortColumns = [
	{
		key: "id",
		name: "Thời điểm tạo",
	},
	{
		key: "ingredientName",
		name: "Tên",
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

const directionColumns = [
	{
		key: "asc",
		name: "Tăng",
	},
	{
		key: "desc",
		name: "Giảm",
	},
];
const IngredientDataTable = ({
	user,
	columns,
	title,
	buttonText,
	buttonLink,
}) => {
	const { username } = user.data;
	const [ingredientsData, setIngredientsData] = useState([]);
	const [flag, setFlag] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [quantity, setQuantity] = useState("");
	const [selectedIngredient, setSelectedIngredient] = useState(null);
	const directionSortFilterOptions = directionColumns;
	const fields = sortColumns;
	const [sortField, setSortField] = useState(fields[0].key);
	const [sortDirection, setSortDirection] = useState(
		directionSortFilterOptions[1].key
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			const filters = {
				id: null,
				name: searchQuery,
				price: null,
				quantity: null,
				name2: null,
				direction: sortDirection,
			};

			if (sortField === "name") {
				filters.name = searchQuery || "";
			}
			if (sortField === "ingredientName") {
				filters.name2 = "";
			}
			if (sortField === "id") {
				filters.id = "";
			}
			if (sortField === "price") {
				filters.price = "";
			}
			if (sortField === "quantity") {
				filters.quantity = "";
			}
			const ingredientPage = await getIngredientWithPaginationAndFilter(
				currentPage,
				pageSize,
				filters
			);
			setIngredientsData(ingredientPage.content);
			setTotalPages(ingredientPage.totalPages);
		};
		fetchData();
	}, [flag, currentPage, sortField, sortDirection, searchQuery]);
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
	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
		setCurrentPage(0);
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

	const renderPageButtons = () => {
		const buttons = [];
		for (let i = 0; i < totalPages; i++) {
			buttons.push(
				<button
					key={i}
					onClick={() => setCurrentPage(i)}
					className={`px-4 py-2 mx-1 text-sm rounded ${i === currentPage ? "bg-primary text-white" : "bg-default-200"}`}
				>
					{i + 1}
				</button>
			);
		}
		return buttons;
	};

	return (
		<>
			<div className="overflow-hidden px-6 py-4">
				<div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
					<h2 className="text-xl font-semibold text-default-800">{title}</h2>
					<div className="flex flex-wrap items-center gap-6">
						<div className="hidden lg:flex">
							<div className="relative hidden lg:flex">
								<input
									type="search"
									className="block w-64 rounded-full border-default-200 bg-default-50 py-2.5 pe-4 ps-12 text-sm text-default-600 focus:border-primary focus:ring-primary"
									placeholder="Tìm kiếm nguyên liệu"
									value={searchQuery}
									onChange={handleSearchChange}
								/>
								<span className="absolute start-4 top-2.5">
									<LuSearch size={20} className="text-default-600" />
								</span>
							</div>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-4">
						<IngredientFilterDropDown
							filterOptions={fields}
							onChange={setSortField}
							value={fields[0].name}
						/>
						<IngredientFilterDropDown
							filterOptions={directionSortFilterOptions}
							onChange={setSortDirection}
							value={directionSortFilterOptions[1].name}
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
										Thao tác
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-default-200">
								{ingredientsData.map((row, idx) => (
									<tr
										key={row.id}
										className={`${row.status === "disabled" ? "bg-gray-200" : ""} ${row.quantity === 0 ? "bg-red-100" : ""}`}
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
																src={getIngredientImagePath(row.image)}
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
														{row.status === "disabled" ? (
															<span className="text-red-500">Đã bị khóa</span>
														) : (
															<>
																{row.quantity === 0 && (
																	<span className="text-red-400 ml-2">
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
															</>
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
						<div className="flex justify-center mt-4">
							{renderPageButtons()}
						</div>
					</div>
				</div>
			</div>
			{showModal && (
				<RestockModal
					show={showModal}
					handleClose={handleCloseModal}
					handleSave={handleRestock}
					quantity={quantity}
					setQuantity={setQuantity}
				/>
			)}
		</>
	);
};

export default IngredientDataTable;
