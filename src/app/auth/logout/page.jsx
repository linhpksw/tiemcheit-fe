"use client";
import Link from "next/link";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { AuthFormLayout } from "@/components";


const Logout = () => {
    useEffect(() => {
        async function logoutUser() {
            await signOut({ redirect: false });
        }
        logoutUser();
    }, []);

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
