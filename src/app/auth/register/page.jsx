'use client'
import { AuthFormLayout } from "@/components";
import RegisterForm from "./RegisterForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCookie } from "@/helpers";

const Register = () => {
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
            authTitle="Đăng ký tài khoản"
            helpText="Quá trình đăng ký chỉ mất vài phút."
        >
            <RegisterForm />

        </AuthFormLayout>
    );
};

export default Register;
