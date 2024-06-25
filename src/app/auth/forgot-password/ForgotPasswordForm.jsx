"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { TextFormInput } from "@/components";
import useForgot from "./useForgot";

const ForgotPasswordForm = () => {
    const { loading, forgot, control } = useForgot();

    return (
        <form onSubmit={forgot}>
            <TextFormInput
                name="email"
                control={control}
                type="text"
                placeholder="Nhập email của bạn"
                label="Email"
                containerClassName="mb-6"
                fullWidth
            />
            <button className="w-full rounded-lg bg-primary px-6 py-3 text-white transition-all hover:bg-primary-600">
                Khôi phục mật khẩu
            </button>
        </form>
    );
};

export default ForgotPasswordForm;
