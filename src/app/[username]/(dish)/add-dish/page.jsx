'use client';
import { useState, useEffect, useRef } from 'react';
import AddDishForm from './AddDishForm';
import DishUploader from './DishUploader';
import { BreadcrumbAdmin } from '@/components';
import { Authorization } from '@/components/security';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';
import { LuEraser, LuSave } from 'react-icons/lu';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addProduct } from '@/helpers';

const createIngredientQuantitySchema = (ingredients) => {
	const schemaFields = ingredients.reduce((acc, ingredient) => {
		acc[`ingredientQuantity${ingredient.id}`] = yup
			.number()
			.required('Vui lòng nhập định lượng của nguyên liệu')
			.positive('Định lượng phải là một số dương')
			.integer('Định lượng phải là một số nguyên')
			.typeError('Định lượng phải là một số');
		return acc;
	}, {});

	return yup.object().shape(schemaFields);
};

const createSchema = (selectedIngredients) => {
	return yup.object({
		productname: yup.string().required('Vui lòng nhập tên sản phẩm của bạn'),
		productCategory: yup.number().required('Vui lòng chọn loại sản phẩm của bạn'),
		price: yup.number().typeError('Nhập sai định dạng').required('Vui lòng nhập giá bán của bạn'),
		// quantity: yup
		//     .number()
		//     .typeError("Nhập sai định dạng")
		//     .required("Vui lòng nhập số lượng của bạn"),
		description: yup.string().required('Vui lòng nhập mô tả của bạn'),
		ingredients: yup.string().required('Phải chọn ít nhất một nguyên liệu'),
		options: yup.string().required('Phải chọn ít nhất một tùy chọn'),
		...createIngredientQuantitySchema(selectedIngredients).fields,
	});
};

const productData = {
	name: '',
	price: 0,
	// quantity: 0,
	description: '',
	category: {},
	imageList: [],
	status: '',
	createAt: '',
	optionList: [],
	productIngredients: [],
};

const AddProduct = () => {
	const { username } = useParams();
	const { user, isLoading } = useUser();
	const [images, setImages] = useState([]);
	const [selectedIngredients, setSelectedIngredients] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [key, setKey] = useState(0);

	const [schema, setSchema] = useState(createSchema([]));

	useEffect(() => {
		setSchema(createSchema(selectedIngredients));
	}, [selectedIngredients]);

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data) => {
		try {
			productData.name = data.productname;
			productData.price = data.price;
			// productData.quantity = data.quantity;
			productData.description = data.description;
			productData.category = { id: data.productCategory };
			productData.createAt = new Date().toISOString();
			productData.optionList = selectedOptions.map((option) => option.id);
			productData.imageList = images.map((image) => `dishes/${image.file.name}`);

			productData.status = 'inactive';
			productData.productIngredients = selectedIngredients.map((ingredient) => ({
				ingredient: { id: ingredient.id },
				unit: ingredient.unit,
			}));

			images.forEach(async (image) => {
				const imageFormData = new FormData();
				imageFormData.append('file', image.file);
				imageFormData.append('directory', 'dishes');

				await fetch('/api/s3-upload', { method: 'POST', body: imageFormData });
			});

			await addProduct(productData);
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Authorization allowedRoles={['ROLE_ADMIN']} username={username}>
			<div className='w-full lg:ps-64'>
				<div className='page-content space-y-6 p-6'>
					<BreadcrumbAdmin title='Thêm món ăn' subtitle='Món ăn' />
					<form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 xl:grid-cols-3'>
						<div>
							<DishUploader setImages={setImages} onSubmit={onSubmit} handleSubmit={handleSubmit} />
						</div>
						<AddDishForm
							control={control}
							handleSubmit={handleSubmit}
							onSubmit={onSubmit}
							selectedIngredients={selectedIngredients}
							setSelectedIngredients={setSelectedIngredients}
							selectedOptions={selectedOptions}
							setSelectedOptions={setSelectedOptions}
						/>
						<div className='flex items-center justify-start gap-4'>
							<button
								type='submit'
								className='flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500'>
								<LuSave size={20} /> Lưu
							</button>
							<button
								type='reset'
								onClick={() => {
									reset();
									setSelectedIngredients([]);
									setSelectedOptions([]);
									setImages([]);
									setKey((prevKey) => prevKey + 1);
								}}
								className='flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-6 py-2.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white'>
								<LuEraser size={20} /> Reset
							</button>
						</div>
					</form>
				</div>
			</div>
		</Authorization>
	);
};

export default AddProduct;
