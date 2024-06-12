  "use client"
  import { useState } from 'react';
  import AddDishForm from "./AddDishForm";
  import DishUploader from "./DishUploader";
  import { BreadcrumbAdmin } from "@/components";
  import { Authorization } from "@/components/security";
  import { useParams } from "next/navigation";
  import { useUser } from "@/hooks";
  import { LuEraser, LuSave } from "react-icons/lu";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { addProduct } from "@/helpers";

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


  const AddProduct = () => {
    const { username } = useParams();
    const { user, isLoading } = useUser();
    const [formData, setFormData] = useState({});
    const [images, setImages] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);


    const { control, handleSubmit, reset } = useForm({
      resolver: yupResolver(credentialsManagementFormSchema),
    })

    const onSubmit = async (data) => {
      const productData = {
        "name": data.productname,
        "imageList": images.map(image => image.file.name),
        "price": data.sellingPrice,
        "quantity": data.quantity,
        "description": data.description,
        "category": {
          "id": data.productCategory
        },
        "createAt": data.createAt,
        "optionId": data.options,
        "ingredientId": JSON.stringify( selectedIngredients.map(ingredient => ingredient.id))
      }
      console.log(productData);
      
      try {
        const response = await addProduct(testData);
        if (response !== null) {
          console.log("Success added");
          reset(); 
          setSelectedIngredients([]); 
        } else {
          console.error("Failed to add product");
        }
      } catch (error) {
        console.error("Error adding product:", error);
      }
    };

    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <Authorization allowedRoles={['ROLE_CUSTOMER']} username={username}>
        <div className="w-full lg:ps-64">
            <div className="page-content space-y-6 p-6">
              <BreadcrumbAdmin title="Thêm món ăn" subtitle="Món ăn" />
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-3">
                <div>
                <DishUploader setImages={setImages} onSubmit={onSubmit} handleSubmit={handleSubmit}  />
                </div>
                <AddDishForm 
                      setFormData={setFormData} 
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
                      setSelectedIngredients([]);
                      setIsCheckAll(false);
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

  export default AddProduct;
