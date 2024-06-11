'use client'
import LoginForm from "./LoginForm";
import { AuthFormLayout } from "@/components";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCookie } from "@/helpers";
import { set } from "react-hook-form";

const Login = () => {
    const router = useRouter();

    useEffect(() => {
        const accessToken = getCookie('accessToken');

        if (accessToken) {
            setTimeout(() => {
                router.push('/');
            }, 0);
        }
    }, []);

    return (
        <AuthFormLayout
            authTitle="Đăng nhập"
            helpText="Nhập tài khoản và mật khẩu của bạn để truy cập tiệm chè IT."
        >
            <LoginForm />
        </AuthFormLayout>
    );
};

export default Login;
