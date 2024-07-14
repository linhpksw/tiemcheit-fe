"use client";
import { useEffect, useState } from "react";
import EditForm from "./EditForm.jsx";
import EditUploader from "./EditUploader.jsx";
import { BreadcrumbAdmin } from "@/components";
import { Authorization } from "@/components/security";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";
import { LuEraser, LuSave } from "react-icons/lu";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getIngredientById, updateIngredient } from "@/helpers";

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

const EditIngredient = () => {
    const { ingredientId, username } = useParams();
    const { user, isLoading } = useUser();
    const [ingredient, setIngredient] = useState(null);
    const [images, setImages] = useState([]);
    const [initImages, setInitImages] = useState(null);
    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(credentialsManagementFormSchema),
    });

    useEffect(() => {
        const loadIngredient = async () => {
            try {
                const data = await getIngredientById(ingredientId);
                setIngredient(data);
                reset({
                    ingredientName: data.name,
                    price: data.price,
                    quantity: data.quantity,
                });
                setInitImages(`../../../../public/ingredients/${data.image}`);
            } catch (error) {
                console.error("Failed to fetch ingredient", error);
            }
        };
        loadIngredient();
    }, [ingredientId, reset]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            images.forEach((image) => {
                if (image.file) {
                    formData.append("images", image.file);
                }
            });
            formData.append("directory", "ingredients");

            const updatedIngredient = {
                ingredientId,
                name: data.ingredientName,
                image: images[images.length - 1].file.name,
                price: data.price,
                quantity: data.quantity,
            };

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const response = await updateIngredient(updatedIngredient, ingredientId);
            if (response) {
                reset();
            } else {
                console.error("Failed to update ingredient");
            }
        } catch (error) {
            console.error("Error updating ingredient", error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!ingredient) {
        return <div>Loading ingredient details...</div>;
    }

    return (
        <Authorization allowedRoles={["ROLE_ADMIN"]} username={username}>
            <div className="w-full lg:ps-64">
                <div className="page-content space-y-6 p-6">
                    <BreadcrumbAdmin
                        title="Cập nhật nguyên liệu"
                        subtitle="Nguyên liệu"
                    />
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid gap-6 xl:grid-cols-3"
                    >
                        <div>
                            <EditUploader
                                initImages={initImages}
                                setImages={setImages}
                                onSubmit={onSubmit}
                                handleSubmit={handleSubmit}
                            />
                        </div>
                        <EditForm
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
                                    setImages([]);
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

export default EditIngredient;
