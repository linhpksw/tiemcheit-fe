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
  import axios from "axios";
  import fs from "fs/promises";
  import path from "path";
  import Link from "next/link";

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
    const AddProduct = () => {
      const { username } = useParams();
      const { user, isLoading } = useUser();

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
          
          const newProduct = {
            "name": data.productname,
            "imageList": [
                      "image1_che_ba_mau_1.jpg",
                      "image1_che_ba_mau_2.jpg",
                      "image1_che_ba_mau_3.jpg"
                  ],
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

          console.log(newProduct);

          // const base64Images = await Promise.all(images.map(async (image) => {
          //   const base64 = await fileToBase64(image.file);
          //   return {
          //     filename: image.file.name,
          //     base64: base64,
          //   };
          // }));

          const response = await addProduct(newProduct);
          if (response !== null) {
            console.log("Success added");
            reset(); 
            setSelectedIngredients([]); 
            setSelectedOptions([]);
          } else {
            console.error("Failed to add product");
          }
        } catch (error) {
          console.error(error);
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

    export const getServerSideProps = async () => {
      const props = { dirs: [] };
      try {
        const dirs = await fs.readdir(path.join(process.cwd(), "/public/images"));
        props.dirs = dirs;
        return { props };
      } catch (error) {
        return { props };
      }
    };

    export default AddProduct;
