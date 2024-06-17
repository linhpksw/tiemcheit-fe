"use client";
import Link from "next/link";
import { useEffect } from "react";
import { AuthFormLayout } from "@/components";
import { useRouter } from "next/navigation";
import { deleteCookie, robustFetch, getCookie, robustFetchWithRT } from "@/helpers";

const Logout = () => {
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        const refreshToken = getCookie('refreshToken');

        if (refreshToken) {
            async function logoutUser() {
                await robustFetchWithRT(`
                ${BASE_URL}/auth/logout`, 'POST',
                    'Đăng xuất thành công...', { token: getCookie('refreshToken') }
                );

                deleteCookie('refreshToken');
                deleteCookie('accessToken');

                router.replace('/auth/logout');
            }

            logoutUser();
        } else {
            router.replace('/auth/login');
        }
    }, [router]);

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
