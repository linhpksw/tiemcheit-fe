import React from 'react'
import { GoBackButton } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { error404OtherImg } from "@/assets/data/images";


const Forbidden = () => {
    return (
        <div className="container">
            <div className="flex items-center justify-center w-full">
                <div className="text-center">
                    <h1 className="text-[10rem] font-semibold text-default-800">
                        403
                    </h1>
                    <h3 className="mb-4 text-2xl font-medium text-default-800">
                        Xin lỗi bạn không có quyền truy cập vào trang này.
                    </h3>

                    <div className="py-10 flex flex-wrap items-center justify-center gap-4">
                        <GoBackButton />
                        <Link
                            href="/"
                            className="relative inline-flex w-1/2 items-center justify-center rounded-lg border border-primary px-3 py-3 text-base font-medium capitalize text-primary transition-all hover:bg-primary hover:text-white lg:w-2/6"
                        >
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forbidden