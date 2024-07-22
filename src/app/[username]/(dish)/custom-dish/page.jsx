"use client";
import { useState, useEffect } from "react";
import AddDishForm from "./AddDishForm";
import { BreadcrumbAdmin } from "@/components";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";
import { LuEraser, LuPlus, LuSave } from "react-icons/lu";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addProduct, fetchProductById } from "@/helpers";
import { useShoppingContext } from "@/context";
import { getProductDetailByIdWithOutAT } from "@/helpers";

const credentialsManagementFormSchema = yup.object({
	productname: yup.string().required("Vui lòng nhập tên sản phẩm của bạn"),
	quantity: yup
		.number()
		.typeError("Nhập sai định dạng")
		.required("Vui lòng nhập số lượng của bạn"),
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
};

const AddProduct = () => {
	const { username } = useParams();
	const { user, isLoading } = useUser();
	const [selectedIngredients, setSelectedIngredients] = useState([]);
	const [key, setKey] = useState(0);
	const [productId, setProductId] = useState(null);

	const [totalPrice, setTotalPrice] = useState(0);
	const { addToCart, removeFromCart, isInCart, cartItems } =
		useShoppingContext();
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
			if (totalUIC < 3 || totalUIC > 5) {
				alert("Món ăn phải có 3, 4 hoặc 5 UIC.");
				return;
			}
			formData.name = data.productname;
			formData.price = totalPrice;
			formData.quantity = data.quantity;
			formData.description = data.description;
			formData.category = { id: 1 };
			formData.createAt = new Date().toISOString();
			formData.imageList = ["defaultDish.jpg"];
			formData.status = "custom";
			formData.productIngredients = selectedIngredients.map((ingredient) => ({
				ingredient: { id: ingredient.id },
				unit: ingredient.quantity,
			}));

			const response = await addProduct(formData);
			setProductId(response.id); // Assuming the response contains the new product ID
			alert("Thêm sản phẩm thành công");
			handleReset();
		} catch (error) {
			console.error(error);
			alert("Thêm sản phẩm thất bại");
		}
	};

	const addCustomedProductToCart = async () => {
		try {
			if (!productId) {
				alert("Vui lòng lưu sản phẩm trước khi thêm vào giỏ hàng");
				return;
			}
			const productFetched = await getProductDetailByIdWithOutAT(productId);
			await addToCart(productFetched, productFetched.quantity);
			alert("Sản phẩm đã được thêm vào giỏ hàng");
		} catch (error) {
			console.error(error);
			alert("Không thể thêm sản phẩm vào giỏ hàng");
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
					<div className="flex items-center justify-start gap-4">
						<div className="text-lg font-semibold">
							Tổng giá tiền: {totalPrice} VNĐ
						</div>
					</div>
					<div className="flex items-center justify-start gap-4">
						<button
							type="button"
							onClick={handleReset}
							className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-6 py-2.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
						>
							<LuEraser size={20} /> Reset
						</button>
						<button
							type="submit"
							className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500"
						>
							<LuSave size={20} /> Lưu
						</button>
						<button
							type="button"
							onClick={addCustomedProductToCart}
							className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500"
						>
							<LuPlus size={20} /> Thêm vào giỏ
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddProduct;
