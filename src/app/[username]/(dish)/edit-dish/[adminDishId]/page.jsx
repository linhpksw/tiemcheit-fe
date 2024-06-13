"use client"
import EditDishForm from "./EditDishForm";
import { BreadcrumbAdmin } from "@/components";
import EditDishUploader from "./EditDishUploader";
import React, { useEffect, useState } from 'react';
import { Authorization } from "@/components/security";
import { useParams } from "next/navigation";
import { LuEraser, LuSave } from "react-icons/lu";
import { useForm } from "react-hook-form";

import { useProductDetail } from "@/hooks";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProduct } from "@/helpers";

const credentialsManagementFormSchema = yup.object({
name: yup.string().required("Vui lòng nhập tên sản phẩm của bạn"),
category: yup.string().required("Vui lòng chọn loại sản phẩm của bạn"),
price: yup
  .number()
  .typeError("Nhập sai định dạng")
  .required("Vui lòng nhập giá bán của bạn"),
quantity: yup
  .number()
  .typeError("Nhập sai định dạng")
  .required("Vui lòng nhập số lượng của bạn"),
description: yup.string().required("Vui lòng nhập mô tả của bạn"),
// ingredients: yup
//   .array()
//   .of(yup.string())
//   .min(1, "Vui lòng chọn ít nhất một nguyên liệu")
//   .required("Vui lòng chọn ít nhất một nguyên liệu"),
});

const testData = {
  "name": "Sample Product 2",
  "imageList": [
            "image1_che_ba_mau_1.jpg",
            "image1_che_ba_mau_2.jpg",
            "image1_che_ba_mau_3.jpg"
        ],
  "price": 20000,
  "category":{
    "id":1
  },
  "quantity": 100,
  "createAt": "2024-06-06",
  "description": "This is a sample product description.",
  "optionId": [1,2],
  "ingredientId": [1,2]
}

const EditProduct = () => {
  const { username, adminDishId  } = useParams();
  const { product, isLoading } = useProductDetail(Number(adminDishId));
  const [images, setImages] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(credentialsManagementFormSchema),
  })

  useEffect(() => {
    if (!isLoading && product) {
      // Reset form with product data once product is fetched
      reset({
        ...product.data,
        category:{
          value: product.data.category.id,
          label: product.data.category.name,
        }
      });
      setSelectedIngredients(product.data.ingredientList || []);
    }
  }, [isLoading, product, reset]);
  
  if (isLoading) {
    return <div></div>;
  }
  

  if (!product) notFound();

  const onSubmit = async (data) => {
    const productData = {
      "name": data.name,
      "imageList": images.map(image => image.file.name),
      "price": data.price,
      "quantity": data.quantity,
      "description": data.description,
      "category": {
        "id": data.category
      },
      "createAt": data.createAt,
      "optionId": [1,2],
      "ingredientId": selectedIngredients.map(ingredient => ingredient.id)
    }
    
    console.log(productData);
    
    try {
      const response = await updateProduct(productData,Number(adminDishId));
      if (response !== null) {
        console.log("Success updated product");
        reset(productData)
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Authorization allowedRoles={['ROLE_CUSTOMER']} username={username}>
        <div className="w-full lg:ps-64">
            <div className="page-content space-y-6 p-6">
              <BreadcrumbAdmin title="Thêm món ăn" subtitle="Món ăn" />
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-3">
                <div>
                <EditDishUploader setImages={setImages} onSubmit={onSubmit} handleSubmit={handleSubmit}  />
                </div>
                <EditDishForm 
                  product={product}
                  control={control} 
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  selectedIngredients={selectedIngredients}
                  setSelectedIngredients={setSelectedIngredients}
                />
                <div className="flex items-center justify-end gap-4">
                  <button
                    type="reset"
                    onClick={() => {
                      reset();
                      setSelectedIngredients(product.data.ingredientList);
                      // setIsCheckAll(false);
                    }}
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
      </Authorization>
  );
};

export default EditProduct;
