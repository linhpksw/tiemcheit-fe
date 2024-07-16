"use client";
import { set, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LuEraser, LuSave } from "react-icons/lu";
import { useState, useEffect } from "react";
import Checkbox from "@/components/Checkbox";
import { toNormalText } from "@/helpers";
import {
	SelectFormInput,
	ProductSelectFormInput,
	TextFormInput,
	ProductTextFormInput,
	ProductTextAreaFormInput,
} from "@/components";

import { getAllCategories, getAllIngredients, getAllOptions } from "@/helpers";
import "react-quill/dist/quill.snow.css";

const AddDishForm = ({
	control,
	selectedIngredients,
	setSelectedIngredients,
}) => {
	const [selectedIngredient, setSelectedIngredient] = useState(null);
	const [ingredients, setIngredients] = useState([]);
	const [ingredientQuantities, setIngredientQuantities] = useState({});
	const [totalPrice, setTotalPrice] = useState(0); // Add totalPrice state
	const [isIngreCheckAll, setIsIngreCheckAll] = useState(false);
	const [isIngreCheck, setIsIngreCheck] = useState([]);
	useEffect(() => {
		const fetchIngredients = async () => {
			try {
				const fetchedIngredients = await getAllIngredients();
				setIngredients(fetchedIngredients);
			} catch (error) {
				console.error("Failed to fetch ingredients: ", error);
			}
		};

		fetchIngredients();
	}, []);

	const handleIngredientSelectAll = (e) => {
		setIsIngreCheckAll(!isIngreCheckAll);
		setIsIngreCheck(selectedIngredients.map((ingredient) => ingredient.id));
		if (isIngreCheckAll) {
			setIsIngreCheck([]);
		}
	};

	const handleIngredientClick = (e) => {
		const { id, checked } = e.target;
		const idNum = Number(id);
		setIsIngreCheck((prev) => {
			let updatedCheck = [];
			if (checked) {
				updatedCheck = [...prev, idNum];
			} else {
				updatedCheck = prev.filter((item) => item !== idNum);
			}
			setIsIngreCheckAll(updatedCheck.length === selectedIngredients.length);
			return updatedCheck;
		});
	};

	const handleIngredientDeleteSelected = () => {
		const remainingIngredients = selectedIngredients.filter(
			(ingredient) => !isIngreCheck.includes(ingredient.id)
		);
		const deletedIngredients = selectedIngredients.filter((ingredient) =>
			isIngreCheck.includes(ingredient.id)
		);

		// Update totalPrice
		const deletedPrice = deletedIngredients.reduce(
			(total, ingredient) =>
				total + (ingredient.price * ingredient.quantity) / 10,
			0
		);
		setTotalPrice((prev) => prev - deletedPrice);

		setSelectedIngredients(remainingIngredients);
		setIsIngreCheck([]);
		setIsIngreCheckAll(false);
	};

	const handleSelect = (selected, arr, selectedArr, setSelectedArr) => {
		const selectedElement = arr.find(
			(element) => element.id === selected.value
		);

		if (selectedElement) {
			const existingIngredient = selectedArr.find(
				(ele) => ele.id === selected.value
			);
			let newSelectedArr;

			if (existingIngredient) {
				const newQuantity = existingIngredient.quantity + 1;
				newSelectedArr = selectedArr.map((ingredient) =>
					ingredient.id === selected.value
						? { ...ingredient, quantity: newQuantity }
						: ingredient
				);
			} else {
				newSelectedArr = [...selectedArr, { ...selectedElement, quantity: 1 }];
			}

			const currentTotal = newSelectedArr.reduce(
				(sum, ingredient) => sum + ingredient.quantity,
				0
			);

			if (currentTotal > 5) {
				alert("Bạn không thể có tổng số lượng UIC lớn hơn 5.");
			} else {
				setSelectedArr(newSelectedArr);
				setIngredientQuantities((prev) => ({
					...prev,
					[selectedElement.id]: existingIngredient
						? existingIngredient.quantity + 1
						: 1,
				}));
				setTotalPrice((prev) => prev + selectedElement.price / 10); // Update totalPrice
			}
		}
	};

	const totalUIC = selectedIngredients.reduce(
		(sum, ingredient) => sum + ingredient.quantity,
		0
	);

	return (
		<div className="xl:col-span-2">
			<style jsx>{`
				.scrollable {
					max-height: 167px;
					overflow-y: auto;
				}
				.fixed-height-form {
					height: 60vh; /* Adjust the height as needed */
					overflow-y: auto;
				}
			`}</style>
			<div className="space-y-6">
				<div className="rounded-lg border border-default-200 p-6">
					<div className="grid gap-6 lg:grid-cols-2">
						<div className="space-y-6 fixed-height-form">
							<div className="space-y-4">
								<ProductTextFormInput
									name="productname"
									type="text"
									label="Tên sản phẩm"
									placeholder="Tên sản phẩm"
									control={control}
									fullWidth
								/>
								<ProductSelectFormInput
									name="ingredients"
									label="Chọn Nguyên Liệu"
									id="ingredient-selection"
									placeholder={"Chọn..."}
									instanceId="ingredient-selection"
									control={control}
									options={
										ingredients &&
										ingredients.map((ing) => ({
											value: ing.id,
											label: ing.name,
										}))
									}
									onChange={(selected) => {
										handleSelect(
											selected,
											ingredients,
											selectedIngredients,
											setSelectedIngredients
										);
										setSelectedIngredient(null);
									}}
									fullWidth
								/>
								{selectedIngredients.length > 0 && (
									<div>
										<div className="flex flex-row justify-between">
											<h3>Nguyên liệu đã chọn</h3>
										</div>
										<div className="space-y-2 mb-4 flex flex-col rounded-lg border border-default-200 p-6 scrollable">
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-2">
													<Checkbox
														id="selectAll"
														type="checkbox"
														name="selectAll"
														handleClick={handleIngredientSelectAll}
														isChecked={isIngreCheckAll}
													/>
													<div>Tất cả ({totalUIC} / 5) </div>
												</div>
												<button
													type="button"
													onClick={handleIngredientDeleteSelected}
													className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-1.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
												>
													<LuEraser size={20} />
													<span>Xóa</span>
												</button>
											</div>
											<hr className="my-4 border-t border-gray-300" />
											{selectedIngredients.map((ingredient) => (
												<div
													key={`ingredient-${ingredient.id}`}
													className="flex items-center space-x-2 justify-between"
												>
													<Checkbox
														key={`ingredient-checkbox-${ingredient.id}`}
														type="checkbox"
														name={toNormalText(ingredient.name)}
														id={ingredient.id.toString()}
														handleClick={handleIngredientClick}
														isChecked={isIngreCheck.includes(ingredient.id)}
													/>
													<div className="flex-1">{ingredient.name}</div>
													<div>{ingredient.quantity}</div>
													<span>UIC</span>
												</div>
											))}
										</div>
									</div>
								)}
							</div>

							{/* Display the total price */}
						</div>
						<div className="space-y-6">
							<ProductTextFormInput
								name="quantity"
								type="number"
								label="Số lượng"
								placeholder="Số lượng"
								control={control}
								fullWidth
							/>
							<ProductTextAreaFormInput
								name="description"
								label="Mô tả"
								placeholder="Mô tả"
								rows={5}
								control={control}
								fullWidth
							/>
							{/* <div className="mt-4">
								<h3>Total Price: {totalPrice}</h3>
							</div> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddDishForm;
