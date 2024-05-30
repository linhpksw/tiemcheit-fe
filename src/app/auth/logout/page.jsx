"use client";
import Link from "next/link";
import { useEffect } from "react";
import { AuthFormLayout } from "@/components";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/common/constants";
import { useUserContext } from "@/context/useUserContext";
import { deleteCookie, getCookie } from "@/utils";

const Logout = () => {
    const router = useRouter();
    const { logout } = useUserContext();

    useEffect(() => {
        async function logoutUser() {
            // Get refresh token from cookies or local storage
            const refreshToken = getCookie('refreshToken');

            if (refreshToken) {
                await fetch(`${BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: refreshToken }),
                });
            }

            // Clear local storage and cookies
            localStorage.clear();
            deleteCookie('accessToken');
            deleteCookie('refreshToken');

            // Update user context to reflect logged out state
            logout();

            router.replace('/auth/logout');
        }

        logoutUser();
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
