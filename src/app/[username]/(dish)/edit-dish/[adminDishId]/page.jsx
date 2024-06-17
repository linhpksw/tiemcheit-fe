"use client"
import { useState, useEffect } from 'react';

import { BreadcrumbAdmin } from "@/components";
import { Authorization } from "@/components/security";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";
import { LuEraser, LuSave } from "react-icons/lu";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addProduct, updateProduct } from "@/helpers";
import EditDishForm from './EditDishForm';
import EditDishUploader from './EditDishUploader';
import { useProductDetail } from '@/hooks';
const credentialsManagementFormSchema = yup.object({
  // productname: yup.string().required("Vui lòng nhập tên sản phẩm của bạn"),
  // productCategory: yup.string().required("Vui lòng chọn loại sản phẩm của bạn"),
  // sellingPrice: yup
  //   .number()
  //   .typeError("Nhập sai định dạng")
  //   .required("Vui lòng nhập giá bán của bạn"),
  // quantity: yup
  //   .number()
  //   .typeError("Nhập sai định dạng")
  //   .required("Vui lòng nhập số lượng của bạn"),
  // description: yup.string().required("Vui lòng nhập mô tả của bạn"),
  // // ingredients: yup
  // //   .array()
  // //   .of(yup.string())
  // //   .min(1, "Vui lòng chọn ít nhất một nguyên liệu")
  // //   .required("Vui lòng chọn ít nhất một nguyên liệu"),
});

const EditProduct = () => {
const { username, adminDishId } = useParams();
const { user, isLoading:isUserLoading } = useUser();
const shouldFetchProduct = !isUserLoading && user;
const { product, isLoading: isProductLoading } = useProductDetail(shouldFetchProduct ? adminDishId : "");
const [images, setImages] = useState([]);
const [selectedImage, setSelectedImage] = useState("");
const [uploading, setUploading] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);

const [selectedIngredients, setSelectedIngredients] = useState([]);
const [selectedOptions, setSelectedOptions] = useState([]);


const { control, handleSubmit, reset } = useForm({
  resolver: yupResolver(credentialsManagementFormSchema),
})

const onSubmit = async (data) => {
  try {
    
    const product = {
      "name": data.productname,
      "imageList": images.map(image => image.file.name),
      "price": data.price,
      "category":{
        "id": data.productCategory
      },
      "quantity": data.quantity,
      "createAt": new Date().toISOString(),
      "description": data.description,
      "optionId": selectedOptions.map(option => option.id), 
      "productIngredients":  selectedIngredients.map(ingredient => {
        return {
          "ingredient": 
            {
              "id": ingredient.id
            },
          "unit": ingredient.quantity
        }
      })
    }
    
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image.file); 
    });
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });


    const response = await updateProduct(product,Number(adminDishId));
    if (response !== null) {
      reset(product); 
      setSelectedIngredients(product.productIngredients); 
      setSelectedOptions(product.optionId);
    } else {
      console.error("Failed to add product");
    }
  } catch (error) {
    console.error(error);
  }
};

if (isUserLoading || isProductLoading) {
  return <div>Loading...</div>;
}

const productData = product.data;

return (
  <Authorization allowedRoles={['ROLE_CUSTOMER']} username={username}>
    <div className="w-full lg:ps-64">
        <div className="page-content space-y-6 p-6">
          <BreadcrumbAdmin title="Thêm món ăn" subtitle="Món ăn" />
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-3">
            <div>
            <EditDishUploader 
                    setImages={setImages} 
                    onSubmit={onSubmit} 
                    handleSubmit={handleSubmit} 
                    imageList={productData.imageList}
                    />
            </div>
              <EditDishForm 
                    control={control} 
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    selectedIngredients={selectedIngredients}
                    setSelectedIngredients={setSelectedIngredients}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
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
                    setSelectedIngredients([]);
                    setSelectedOptions([]);
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

export default EditProduct;
