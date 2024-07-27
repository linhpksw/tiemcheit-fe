"use client";
import { useState, useEffect } from "react";
import AddDishForm from "./AddDishForm";
import { BreadcrumbAdmin } from "@/components";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";
import { LuEraser, LuSave } from "react-icons/lu";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addProduct, fetchProductById } from "@/helpers";
import { useShoppingContext } from "@/context";
import { getProductDetailByIdWithOutAT } from "@/helpers";
import { toast } from "sonner";

const credentialsManagementFormSchema = yup.object({
	productname: yup.string().required("Vui lòng nhập tên sản phẩm của bạn"),
	description: yup.string().required("Vui lòng nhập mô tả của bạn"),
	ingredients: yup.string().required("Phải chọn ít nhất một nguyên liệu"),
});

const formData = {
	name: "",
	price: 0,
	quantity: 0,
	description: "",
	category: {},
	imageList: [],
	status: "",
	createAt: "",
	optionId: [],
	productIngredients: [],
	user: null,
};

const AddProduct = () => {
	const { username } = useParams();
	const { user, isLoading } = useUser();
	const [selectedIngredients, setSelectedIngredients] = useState([]);
	const [key, setKey] = useState(0);
	const [productId, setProductId] = useState(null);
	const [totalPrice, setTotalPrice] = useState(0);
	const { addToCart } = useShoppingContext();
	const [addToCartChecked, setAddToCartChecked] = useState(false);

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(credentialsManagementFormSchema),
	});

	const handleReset = () => {
		reset();
		setSelectedIngredients([]);
		setKey((prevKey) => prevKey + 1);
		setTotalPrice(0);
	};

	const handleIngredientChange = (ingredients) => {
		setSelectedIngredients(ingredients);
		const price = ingredients.reduce(
			(sum, ingredient) => sum + ingredient.price * ingredient.quantity,
			0
		);
		setTotalPrice(price);
	};

	const onSubmit = async (data) => {
		try {
			const totalUIC = selectedIngredients.reduce(
				(sum, ingredient) => sum + ingredient.quantity,
				0
			);
			if (totalUIC < 5 || totalUIC > 10) {
				alert("Món chè phải từ 5 đến 10 UIC.");
				return;
			}
			formData.name = data.productname;
			formData.price = totalPrice;
			// formData.quantity = data.quantity;
			formData.description = data.description;
			formData.category = { id: 1 };
			formData.createAt = new Date().toISOString();
			formData.imageList = ["defaultDish.jpg"];
			formData.status = "custom";
			formData.productIngredients = selectedIngredients.map((ingredient) => ({
				ingredient: { id: ingredient.id },
				unit: ingredient.quantity,
			}));
			formData.user = { id: user.data.id };

			const response = await addProduct(formData);
			setProductId(response.id);

			if (addToCartChecked) {
				const productFetched = await getProductDetailByIdWithOutAT(response.id);
				await addToCart(productFetched, 1);
				toast.success("Thêm sản phẩm vào giỏ hàng thành công");
			} else {
				toast.success("Thêm sản phẩm vào giỏ hàng thành công");
			}

			handleReset();
		} catch (error) {
			console.error(error);
			alert("Thêm sản phẩm thất bại");
		}
	};

	if (isLoading) {
		return <div>Đang tải...</div>;
	}

	return (
		<div className="w-full lg:ps-64">
			<div className="page-content space-y-6 p-6">
				<BreadcrumbAdmin title="Chè tự chọn" subtitle="Món ăn" />

				<form onSubmit={handleSubmit(onSubmit)} className="m-2">
					<AddDishForm
						control={control}
						handleSubmit={handleSubmit}
						onSubmit={onSubmit}
						selectedIngredients={selectedIngredients}
						setSelectedIngredients={handleIngredientChange}
					/>
					<div className="flex items-center justify-start gap-4 m-3">
						<div className="text-lg font-semibold">
							Tổng giá tiền: {totalPrice} VNĐ
						</div>
					</div>
					<div className="flex items-center justify-start gap-4 m-5">
						<label className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={addToCartChecked}
								onChange={() => setAddToCartChecked(!addToCartChecked)}
								className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
							/>
							<span>Thêm vào giỏ hàng sau khi lưu</span>
						</label>
					</div>
					<div className="flex items-center justify-start gap-4">
						<button
							type="button"
							onClick={handleReset}
							className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-6 py-2.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
						>
							<LuEraser size={20} /> Xóa
						</button>
						<button
							type="submit"
							className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500"
						>
							<LuSave size={20} /> Lưu
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddProduct;
