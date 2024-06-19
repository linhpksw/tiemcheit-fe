"use client";
import Link from "next/link";
import React from "react";
import { LuCopy, LuKeyRound, LuLock, LuShield, LuUser, LuUserCog } from "react-icons/lu";
import useLogin from "./useLogin";
import { PasswordFormInput, TextFormInput } from "@/components";
import Image from "next/image";

import { googleIconImg, githubIconImg, githubDarkImg } from "@/assets/data/images";


const LoginForm = () => {
    const { loading, login, control, changeUserRole, loginUsingGoogle } = useLogin();

    const accounts = [
        {
            role: 'Khách hàng',
            credential: 'customer',
            password: '12345678',
            icon: <LuUser size={22} />
        },
        {
            role: 'Chủ cửa hàng',
            credential: 'admin',
            password: '12345678',
            icon: <LuShield size={22} />
        },
        {
            role: 'Nhân viên',
            credential: 'employee',
            password: '12345678',
            icon: <LuUserCog size={22} />
        }
    ]

    return (
        <>
            <div className="flex flex-col lg:flex-row justify-between w-full gap-8 lg:gap-48 ">
                <div>
                    <form onSubmit={login}>
                        <TextFormInput
                            key={1}
                            name="credential"
                            control={control}
                            type="text"
                            placeholder="Email/Số điện thoại/Tên đăng nhập"
                            label="Tài khoản"
                            containerClassName="mb-6 w-[20rem]"
                            fullWidth
                        />

                        <PasswordFormInput
                            key={2}
                            name="password"
                            control={control}
                            label="Mật khẩu"
                            placeholder="Mật khẩu"
                            labelClassName="block text-sm font-medium text-default-900 mb-2"
                            containerClassName="mb-1"
                            fullWidth
                        />

                        <Link
                            href="/auth/forgot-password"
                            className="mt-2 float-right text-end text-sm text-default-600 underline hover:text-primary-600"
                        >
                            Quên mật khẩu?
                        </Link>

                        <button
                            type="submit"
                            className="mt-5 w-full rounded-lg bg-primary px-6 py-3 text-base capitalize text-white transition-all hover:bg-primary-600"
                            disabled={loading}
                        >
                            Đăng nhập
                        </button>
                    </form>

                    {/* Social login */}
                    <div className="my-3 flex items-center justify-center gap-6 cursor-pointer">
                        <Image
                            height={32}
                            width={32}
                            alt="social-login-google"
                            src={googleIconImg}
                            className="h-8 w-8"
                            onClick={loginUsingGoogle}
                        />
                        <Image
                            height={32}
                            width={32}
                            alt="social-login-github"
                            src={githubIconImg}
                            className="h-8 w-8 dark:hidden"
                            onClick={() => (alert("Tính năng đang trong quá trình phát triển"))}
                        />
                        <Image
                            height={32}
                            width={32}
                            alt="social-login-github"
                            src={githubDarkImg}
                            className="h-8 w-8 hidden dark:block"
                            onClick={() => (alert("Tính năng đang trong quá trình phát triển"))}
                        />
                    </div>

                    {/* Register */}
                    <p className="mt-auto text-center text-default-950">
                        Chưa có tài khoản?{" "}
                        <Link href="/auth/register" className="ms-1 text-primary hover:text-primary-600">
                            <span className="font-medium">Đăng ký ngay</span>
                        </Link>
                    </p>
                </div>

                {/* Type quickly  */}
                <div className="flex flex-col gap-8 lg:-mt-18">
                    {accounts.map((account, index) => (
                        <div key={index} className="flex flex-col gap-2 rounded-lg border border-dashed border-primary">
                            <div className="flex items-center justify-between gap-2 border-b border-dashed border-primary px-4 py-2">
                                <div className="inline-flex items-center gap-2">
                                    {account.icon}
                                    <p className="text-base text-default-900">{account.role}</p>
                                </div>
                                <button
                                    className="flex items-center gap-1.5 rounded-md bg-primary px-2 py-1 text-sm text-white transition-all hover:bg-primary-600"
                                    onClick={() => changeUserRole(account.credential)}
                                >
                                    <LuCopy />
                                    Nhập nhanh
                                </button>
                            </div>
                            <p className="p-2 px-4">
                                <span className="flex items-center gap-2 text-sm">
                                    <LuKeyRound size={18} />{account.credential}
                                </span>
                                <span className="mt-2 flex items-center gap-2 text-sm">
                                    <LuLock size={18} /> {account.password}
                                </span>
                            </p>
                        </div>
                    ))}

                </div>
            </div>
        </>
    );
};

export default LoginForm;
