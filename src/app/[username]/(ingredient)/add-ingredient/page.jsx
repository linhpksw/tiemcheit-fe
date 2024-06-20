"use client";
import { useState } from "react";
import AddIngredientForm from "./AddIngredientForm";
import IngredientUploader from "./IngredientUploader";
import { BreadcrumbAdmin } from "@/components";
import { Authorization } from "@/components/security";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";
import { LuEraser, LuSave } from "react-icons/lu";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addIngredient } from "@/helpers";

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

const AddIngredient = () => {
	const { username } = useParams();
	const { user, isLoading } = useUser();
	const [images, setImages] = useState([]); // State for single image
	// const [ingredientImage, setIngredientImage] = useState(null);
	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(credentialsManagementFormSchema),
	});

	const onSubmit = async (data) => {
		try {
			const formData = new FormData();
			images.forEach((image) => {
				console.log(image.file.name);
				formData.append("images", image.file);
			});
			formData.append("directory", "ingredients");

			const newIngredient = {
				name: data.ingredientName,
				image: images.map((image) => image.file.name)[0],
				price: data.price,
				quantity: data.quantity,
				storeId: 1,
			};
			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const response = await addIngredient(newIngredient);
			if (response !== null) {
				reset();
			} else {
				console.error("Failed to add ingredient");
			}
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}
	return (
		<Authorization allowedRoles={["ROLE_ADMIN"]} username={username}>
			<div className="w-full lg:ps-64">
				<div className="page-content space-y-6 p-6">
					<BreadcrumbAdmin title="Thêm nguyên liệu" subtitle="Nguyên liệu" />
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="grid gap-6 xl:grid-cols-3"
					>
						<div>
							<IngredientUploader
								setImages={setImages}
								onSubmit={onSubmit}
								handleSubmit={handleSubmit}
							/>
						</div>
						<AddIngredientForm
							control={control}
							handleSubmit={handleSubmit}
							onSubmit={onSubmit}
						/>
						<div className="flex items-center justify-start gap-4">
							<button
								type="submit"
								className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500"
							>
								<LuSave size={20} /> Lưu
							</button>
							<button
								type="reset"
								onClick={() => {
									reset();
									// Reset image state on form reset
								}}
								className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-6 py-2.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
							>
								<LuEraser size={20} /> Xóa
							</button>
						</div>
					</form>
				</div>
			</div>
		</Authorization>
	);
};

export default AddIngredient;
