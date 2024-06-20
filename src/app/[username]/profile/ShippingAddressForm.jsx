"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextFormInput } from "@/components";

const ShippingAddressForm = () => {
    const shippingAddressFormSchema = yup.object({
        saddress: yup.string().required("Please enter your Address"),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(shippingAddressFormSchema),
    });
    return (
        <form
            onSubmit={handleSubmit(() => { })}
            className="rounded-lg border border-default-200 p-6 flex flex-col gap-6"
        >
            <h4 className="text-xl font-medium text-default-900">
                Địa chỉ giao hàng
            </h4>

            <TextFormInput
                name="saddress"
                label="Địa chỉ"
                type="text"
                placeholder="Nhập địa chỉ của bạn..."
                control={control}
                fullWidth
            />

            <div>
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-600"
                >
                    Lưu thay đổi
                </button>
            </div>

        </form>
    );
};

export default ShippingAddressForm;
