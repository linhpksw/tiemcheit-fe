'use client'
import Image from "next/image";
import Link from "next/link";
import SimplebarReactClient from "@/components/SimplebarReactClient";
import { LuLogOut, LuUserCircle2 } from "react-icons/lu";
import { logoDarkImg, logoLightImg } from "@/assets/data/images";
import VerticalMenu from "./VerticalMenu";
import { getVerticalMenuItems } from "@/helpers";

import { useUser } from "@/hooks";

const MenuAdmin = () => {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <div></div>;
    }

    const { username = '', fullname = '' } = user?.data || {};

    return (
        <div
            id="application-sidebar"
            className="hs-overlay fixed inset-y-0 start-0 z-60 hidden w-64 -translate-x-full transform overflow-y-auto border-e border-default-200 bg-white transition-all duration-300 hs-overlay-open:translate-x-0 dark:bg-default-50 lg:bottom-0 lg:right-auto lg:block lg:translate-x-0"
        >
            <div className="sticky top-0 flex h-18 items-center justify-center border-b border-dashed border-default-200 px-6">
                <Link href="/">
                    <Image
                        src={logoDarkImg}
                        height={40}
                        width={130}
                        alt="logo"
                        className="flex h-10 dark:hidden"
                        placeholder="blur"
                        priority
                    />
                    <Image
                        src={logoLightImg}
                        height={40}
                        width={130}
                        alt="logo"
                        className="hidden h-10 dark:flex"
                        placeholder="blur"
                        priority
                    />
                </Link>
            </div>

            <SimplebarReactClient className="h-[25rem]">
                <VerticalMenu menuItems={getVerticalMenuItems(username)} />
            </SimplebarReactClient>

            <ul className="admin-menu flex flex-col gap-2 px-4 pt-10">
                <li className="menu-item">
                    <Link
                        className="flex items-center gap-x-3.5 rounded-md px-4 py-3 text-sm text-default-700 hover:bg-default-100"
                        href={`/${username}/profile`}
                    >
                        <LuUserCircle2 size={20} />
                        Thông tin
                    </Link>
                </li>
                <li className="menu-item">
                    <Link
                        className="flex items-center gap-x-3.5 rounded-md px-4 py-3 text-sm text-red-500 hover:bg-red-400/10 hover:text-red-600"
                        href="/auth/logout"
                    >
                        <LuLogOut size={20} />
                        Đăng xuất
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default MenuAdmin;
