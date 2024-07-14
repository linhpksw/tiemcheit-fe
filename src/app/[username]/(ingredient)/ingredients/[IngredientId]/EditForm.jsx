"use client";
import { TextFormInput } from "@/components";

const EditForm = ({ control, handleSubmit, onSubmit }) => {
    return (
        <div className="xl:col-span-2">
            <div className="rounded-lg border border-default-200 p-6">
                <div className="space-y-6">
                    <TextFormInput
                        name="ingredientName"
                        type="text"
                        label="Tên nguyên liệu"
                        placeholder="Tên nguyên liệu"
                        control={control}
                        fullWidth
                    />
                    <TextFormInput
                        name="price"
                        type="number"
                        label="Giá"
                        placeholder="Giá"
                        control={control}
                        fullWidth
                    />
                    <TextFormInput
                        name="quantity"
                        type="number"
                        label="Số lượng(gram)"
                        placeholder="Số lượng"
                        control={control}
                        fullWidth
                    />
                </div>
            </div>
        </div>
    );
};

export default EditForm;
