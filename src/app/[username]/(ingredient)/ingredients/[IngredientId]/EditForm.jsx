"use client";
import { useEffect, useState } from "react";
import { TextFormInput } from "@/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useParams } from "next/navigation";
import {
	fetchIngredientById,
	getIngredientById,
	updateIngredient,
} from "@/helpers";
import e from "cors";

const credentialsManagementFormSchema = yup.object({
	ingredientName: yup
		.string()
		.required("Vui lòng nhập tên nguyên liệu của bạn"),
	price: yup
		.number()
		.positive("Giá tiền phải là số dương")
		.required("Vui lòng nhập giá tiền"),
	quantity: yup
		.number()
		.positive("Số lượng phải là số dương")
		.required("Vui lòng nhập số lượng"),
});

const EditForm = () => {
	const { id } = useParams();
	console.log(id);
	const [ingredient, setIngredient] = useState(null);
	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(credentialsManagementFormSchema),
	});
	const router = useRouter();

	useEffect(() => {
		const loadIngredient = async () => {
			try {
				const data = await getIngredientById(id);
				setIngredient(data);
				reset({
					ingredientName: data.name,
					price: data.price,
					quantity: data.quantity,
				});
			} catch (error) {
				console.error("Failed to fetch ingredient", error);
			}
		};
		loadIngredient();
	}, [id, reset]);

	const onSubmit = async (formData) => {
		try {
			const updatedIngredient = {
				id,
				name: formData.ingredientName,
				price: formData.price,
				quantity: formData.quantity,
			};

			const response = await updateIngredient(updatedIngredient);
			if (response) {
				router.push("/ingredients");
			} else {
				console.error("Failed to update ingredient");
			}
		} catch (error) {
			console.error("Error updating ingredient", error);
		}
	};

	if (!ingredient) {
		return <div>Loading...</div>;
	}

	return (
		<div className="xl:col-span-2">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="rounded-lg border border-default-200 p-6">
					<div className="space-y-6">
						<TextFormInput
							name="ingredientName"
							type="text"
							label="Tên nguyên liệu"
							placeholder="Tên nguyên liệu"
							control={control}
							fullWidth
						/>
						<TextFormInput
							name="price"
							type="number"
							label="Giá"
							placeholder="Giá"
							control={control}
							fullWidth
						/>
						<TextFormInput
							name="quantity"
							type="number"
							label="Số lượng(gram)"
							placeholder="Số lượng"
							control={control}
							fullWidth
						/>
					</div>
				</div>
			</form>
		</div>
	);
};
export default EditForm;
