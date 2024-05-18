"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { PasswordFormInput, TextFormInput } from "@/components";
import {
    googleIconImg,
    facebookIconImg,
} from "@/assets/data/images";
import Link from "next/link";
import Image from "next/image";

const RegisterForm = () => {
    const registerFormSchema = yup.object({
        fullName: yup.string().required("Vui lòng nhập họ và tên"),
        email: yup
            .string()
            .email("Hãy nhập đúng định dạng email")
            .required("Vui lòng nhập email"),
        password: yup.string().required("Vui lòng nhập mật khẩu"),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(registerFormSchema),
        defaultValues: {
            fullName: "Coder Vui Tính",
            email: "coder@tiemcheit.com",
            password: "123",
        },
    });

    return (
        <form onSubmit={handleSubmit(() => null)}>

            <div className="lg:flex lg:gap-4">
                <TextFormInput
                    name="fullname"
                    control={control}
                    type="text"
                    placeholder="Nhập họ và tên"
                    containerClassName="mb-6"
                    label="Họ và tên"
                    fullWidth
                />

                <TextFormInput
                    name="username"
                    control={control}
                    type="text"
                    placeholder="Nhập tên tài khoản"
                    containerClassName="mb-6"
                    label="Tên tài khoản"
                    fullWidth
                />


            </div>

            <div className="lg:flex lg:gap-4">
                <TextFormInput
                    name="phone"
                    control={control}
                    type="phone"
                    placeholder="Nhập số điện thoại"
                    containerClassName="mb-6"
                    label="Số điện thoại"
                    fullWidth
                />
                <TextFormInput
                    name="email"
                    control={control}
                    type="email"
                    placeholder="Enter your email"
                    containerClassName="mb-6"
                    label="Email"
                    fullWidth
                />

            </div>

            <div className="lg:flex lg:gap-4">
                <PasswordFormInput
                    name="password"
                    control={control}
                    label="Mật khẩu"
                    containerClassName="mb-6"
                    fullWidth

                />

                <PasswordFormInput
                    name="confirmPassword"
                    control={control}
                    label="Xác nhận mật khẩu"
                    containerClassName="mb-6"
                    fullWidth
                />
            </div>

            <button
                type="submit"
                className="w-full rounded-lg bg-primary px-6 py-3 text-base capitalize text-white transition-all hover:bg-primary-600"
            >
                Đăng ký ngay
            </button>

            {/* Social login */}
            <div className="my-3 flex items-center justify-center gap-4">
                <Image
                    height={32}
                    width={32}
                    alt="social-login-google"
                    src={googleIconImg}
                    className="h-8 w-8"
                />
                <Image
                    height={32}
                    width={32}
                    alt="social-login-facebook"
                    src={facebookIconImg}
                    className="h-8 w-8"
                />
            </div>

            <p className="mt-auto text-center text-default-950">
                Bạn đã có tài khoản?{" "}
                <Link href="/auth/login" className="ms-1 text-primary hover:text-primary-600">
                    <span className="font-medium">Đăng nhập</span>
                </Link>
            </p>
        </form>
    );
};

export default RegisterForm;
