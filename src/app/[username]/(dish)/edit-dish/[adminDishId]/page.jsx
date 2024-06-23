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
import { debounce } from "lodash";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { getImagePath } from "@/utils";

const schema = yup.object({
    // productname: yup.string().required("Vui lòng nhập tên sản phẩm của bạn"),
    // productCategory: yup.number().required("Vui lòng chọn loại sản phẩm của bạn"),
    // price: yup
    //   .number()
    //   .typeError("Nhập sai định dạng")
    //   .required("Vui lòng nhập giá bán của bạn"),
    // quantity: yup
    //   .number()
    //   .typeError("Nhập sai định dạng")
    //   .required("Vui lòng nhập số lượng của bạn"),
    // description: yup.string().required("Vui lòng nhập mô tả của bạn"),
    // ingredients: yup.number().min(1, "Phải chọn ít nhất một nguyên liệu"),
    // options: yup.number().min(1, "Phải chọn ít nhất một tùy chọn"),
    // ingredientQuantity: yup.string().required("Vui lòng nhập định lượng của nguyên liệu")
});


const EditProduct = () => {
    //#region Variables
    const { username, adminDishId } = useParams();
    const { user, isLoading } = useUser();
    const [productData, setProductData] = useState({
        name: '',
        price: 0,
        quantity: 0,
        description: '',
        category: {
            id: null,
            name: '',
        },
        ingredientList: [],
        optionList: [],
        imageList: [],
        status: '',
    });
    const [images, setImages] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [files, setFiles] = useState([]);
    const [isFilesSet, setIsFilesSet] = useState(false);
    const [loading, setLoading] = useState(true);
    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });
    //#endregion

    //#region useEffect load product data
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const responseData = await getProductDetailByIdWithAT(Number(adminDishId));
                setProductData({
                    name: responseData.name,
                    price: responseData.price,
                    quantity: responseData.quantity,
                    description: responseData.description,
                    category: {
                        id: responseData.category.id,
                        name: responseData.category.name,
                    },
                    ingredientList: responseData.ingredientList,
                    optionList: responseData.optionList,
                    imageList: responseData.imageList,
                    status: responseData.status,
                });

                setSelectedIngredients(responseData.ingredientList);
                setSelectedOptions(responseData.optionList);
                setImages(responseData.imageList);

            } catch (error) {
                console.log('Error in fetching product detail: ', error.message);
                throw error;
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, []);

    //#endregion

    //#region Loading
    if (isLoading) {
        return <div></div>;
    }
    if (loading) {
        return <div></div>;
    }
    //#endregion

    //#region handle submit
    const onSubmit = async (data) => {
        console.log(images);
        console.log(data);
        try {
            const product = {
                name: data.productname,
                imageList: images.map((image) => image),
                price: data.price,
                category: {
                    id: data.productCategory || productData.category.id,
                },
                quantity: data.quantity,
                createAt: new Date().toISOString(),
                description: data.description,
                optionId: selectedOptions.map((option) => option.id),
                productIngredients: selectedIngredients.map((ingredient) => {
                    return {
                        ingredient: {
                            id: ingredient.id,
                        },
                        unit: ingredient.quantity,
                    };
                }),
                status: productData.status,
            };
            console.log(product);

            const formData = new FormData();
            images.forEach((image) => {
                formData.append('images', image.file);
            });
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const response = await updateProduct(product, Number(adminDishId));
            if (response !== null) {
                reset(product);
                setSelectedIngredients(selectedIngredients);
                setSelectedOptions(selectedOptions);
                setImages(images);
            } else {
                console.error('Failed to add product');
            }
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
                                imageList={productData.imageList}
                            />
                        </div>
                        <EditDishForm
                            productData={productData}
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
                                    reset(productData);
                                    setSelectedIngredients(productData.ingredientList);
                                    setSelectedOptions(productData.optionList);
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