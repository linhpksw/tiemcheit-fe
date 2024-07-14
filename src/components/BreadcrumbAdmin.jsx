'use client'
import { useUser } from "@/hooks";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

const BreadcrumbAdmin = ({ title }) => {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <div></div>;
    }

    const { username = '' } = user?.data || {};

    return (
        <div className="flex w-full items-center justify-between">
            <h4 className="text-xl font-medium">{title}</h4>
            <ol
                aria-label="Breadcrumb"
                className="hidden min-w-0 items-center gap-2 whitespace-nowrap md:flex"
            >
                <li className="text-sm">
                    <Link
                        href={`/${username}/dashboard`}
                        className="flex items-center gap-2 align-middle text-default-800 transition-all hover:text-primary-500"
                    >
                        {username}
                        <LuChevronRight size={16} />
                    </Link>
                </li>
                <li
                    aria-current="page"
                    className="truncate text-sm font-medium text-primary hover:text-primary-500"
                >
                    {title}
                </li>
            </ol>
        </div>
    );
};

export default BreadcrumbAdmin;
