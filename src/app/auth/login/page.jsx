'use client'
import LoginForm from "./LoginForm";
import { AuthFormLayout } from "@/components";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCookie } from "@/helpers";
import { jwtDecode } from 'jwt-decode';


const Login = () => {
    const getDecodedToken = (token) => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    };

    const getScopes = (token) => {
        const decoded = getDecodedToken(token);
        return decoded ? decoded.scope.split(' ') : [];
    };

    const router = useRouter();

    useEffect(() => {
        const accessToken = getCookie('accessToken');
        const refreshToken = getCookie('refreshToken');

        const token = accessToken ? accessToken : refreshToken;

        if (token) {
            const scopes = getScopes(accessToken);
            const decoded = getDecodedToken(accessToken);
            const isAdmin = scopes.includes('ROLE_ADMIN');
            const username = decoded.sub;

            if (isAdmin) {
                setTimeout(() => {
                    router.push(`/${username}/dashboard`);
                }, 0);
                return;
            } else {
                setTimeout(() => {
                    router.push('/');
                }, 0);
            }
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
