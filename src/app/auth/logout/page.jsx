"use client";
import Link from "next/link";
import { useEffect } from "react";
import { AuthFormLayout } from "@/components";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie, robustFetch } from "@/helpers";
import { mutate } from "swr"
import { jwtDecode } from 'jwt-decode';

const Logout = () => {
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        async function logoutUser() {
            const refreshToken = getCookie('refreshToken');
            const username = refreshToken ? jwtDecode(refreshToken).sub : null;

            if (!refreshToken) return;

            await robustFetch(`
            ${BASE_URL}/auth/logout`, 'POST',
                'Đăng xuất thành công...', { token: refreshToken }
            );

            deleteCookie('refreshToken');
            deleteCookie('accessToken');

            router.replace('/auth/logout');
        }

        logoutUser();
    }, [mutate, router]);

    return (
        <AuthFormLayout
            authTitle="Đăng xuất"
            helpText="Chúng tớ rất tiếc khi bạn rời đi. Hẹn gặp lại bạn!"

        >
            <p className="mt-auto">
                Tiếp tục đặt hàng?{" "}
                <Link href="/auth/login" className="text-primary hover:text-primary-600 transition-all">
                    <span className="font-medium ">Đăng nhập ngay</span>
                </Link>
            </p>
        </AuthFormLayout>
    );
};

export default Logout;
