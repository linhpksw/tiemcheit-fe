'use client';
import { useState, useEffect } from 'react';
import { BreadcrumbAdmin } from '@/components';
import { Authorization } from '@/components/security';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';
import { LuEraser, LuSave } from 'react-icons/lu';
import { set, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getProductDetailByIdWithAT, updateProduct } from '@/helpers';
import EditDishForm from './EditDishForm';
import EditDishUploader from './EditDishUploader';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

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
        quantity: yup.number().typeError('Nhập sai định dạng').required('Vui lòng nhập số lượng của bạn'),
        description: yup.string().required('Vui lòng nhập mô tả của bạn'),
        ingredients: yup.string().required('Phải chọn ít nhất một nguyên liệu'),
        options: yup.string().required('Phải chọn ít nhất một tùy chọn'),
        ...createIngredientQuantitySchema(selectedIngredients).fields,
    });
};

const formData = {
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    category: {},
    optionList: [],
    imageList: [],
    status: '',
    createAt: '',
    productIngredients: [],
};

const EditProduct = () => {
    //#region Variables
    const { username, adminDishId } = useParams();
    const { user, isLoading } = useUser();

    const [images, setImages] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [schema, setSchema] = useState(createSchema([]));

    const [flag, setFlag] = useState(false);

    useEffect(() => {
        setSchema(createSchema(selectedIngredients));
    }, [selectedIngredients]);

    //#endregion

    //#region useEffect load product data
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const responseData = await getProductDetailByIdWithAT(Number(adminDishId));
                console.log(responseData);
                formData.name = responseData.name;
                if (responseData.imageList.length > 0) {
                    formData.imageList = responseData.imageList.map((image) => image);
                }
                formData.price = responseData.price;
                formData.quantity = responseData.quantity;
                formData.description = responseData.description;
                formData.category.id = responseData.category.id;
                formData.createAt = new Date().toISOString();
                formData.optionList = responseData.optionList.map((option) => {
                    return {
                        id: option.id,
                        name: option.name,
                    };
                });
                formData.productIngredients = responseData.ingredientList.map((productIngredient) => {
                    return {
                        id: productIngredient.ingredient.id,
                        name: productIngredient.ingredient.name,
                        unit: productIngredient.unit,
                    };
                });
                setSelectedIngredients(formData.productIngredients);
                setSelectedOptions(formData.optionList);
                setImages(formData.imageList);

                console.log(formData);
            } catch (error) {
                console.log('Error in fetching product detail: ', error.message);
                throw error;
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, []);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            productCategory: formData.category.id,
            ingredients: selectedIngredients,
            options: selectedOptions,
        },
    });

    //#endregion

    //#region Loading
    if (isLoading || loading) {
        return <div>Loading...</div>;
    }
    //#endregion

    //#region handle submit
    const onSubmit = async (data) => {
        try {
            // Cập nhật dữ liệu form
            formData.name = data.productname;
            formData.price = data.price;
            formData.quantity = data.quantity;
            formData.description = data.description;
            formData.category.id = data.productCategory;
            formData.createAt = new Date().toISOString();
            formData.optionList = selectedOptions.map((option) => option.id);
            formData.productIngredients = selectedIngredients.map((ingredient) => ({
                ingredient: { id: ingredient.id },
                unit: ingredient.unit,
            }));
            formData.imageList = images.map((image) => image.file.name); // Cập nhật danh sách tên ảnh

            // Tạo FormData để upload ảnh
            const imageFormData = new FormData();
            images.forEach((image) => {
                imageFormData.append('images', image.file);
                imageFormData.append('directory', 'dishes');
            });

            // Upload ảnh
            await fetch('/api/upload', {
                method: 'POST',
                body: imageFormData,
            });

            // Cập nhật sản phẩm
            const response = await updateProduct(formData, Number(adminDishId));
            if (response !== null) {
                // Cập nhật trạng thái với dữ liệu đã submit
                setSelectedIngredients(selectedIngredients);
                setSelectedOptions(selectedOptions);
                setImages(images.map((image) => ({ file: image.file, source: getImagePath(image.file.name) })));
            } else {
                console.error('Failed to add product');
            }

            console.log(formData);
        } catch (error) {
            console.error(error);
        }
    };

    //#endregion

    return (
        <Authorization allowedRoles={['ROLE_ADMIN']} username={username}>
            <div className='w-full lg:ps-64'>
                <div className='page-content space-y-6 p-6'>
                    <BreadcrumbAdmin title='Chỉnh sửa món ăn' subtitle='Món ăn' />
                    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 xl:grid-cols-3'>
                        <div>
                            <EditDishUploader
                                setImages={setImages}
                                onSubmit={onSubmit}
                                handleSubmit={handleSubmit}
                                imageList={formData.imageList}
                            />
                        </div>
                        <EditDishForm
                            productData={formData}
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
                                    reset(formData);
                                    // setSelectedIngredients(formData.ingredientList);
                                    // setSelectedOptions(formData.optionList);
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

export default EditProduct;
