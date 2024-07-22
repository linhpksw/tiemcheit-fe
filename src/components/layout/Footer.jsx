import Link from "next/link";
import { LuHeart } from "react-icons/lu";
import { cn } from "@/utils";

const Footer = ({ hideLinks }) => {
    return (
        <footer
            className={cn(
                "absolute w-full border-t border-default-200 p-6",
                hideLinks ? "lg:ps-64" : "lg:ps-8"
            )}
        >
            <div className={cn("container", hideLinks && "ms-2")}>
                <div className="grid items-center gap-6 lg:grid-cols-2">
                    <p className="text-default-600">
                        Mãi một tình yêu với Tiệm chè IT ❤️
                    </p>

                    {!hideLinks && (
                        <div className="flex justify-end gap-6">
                            <Link href="" className="font-medium text-default-500">
                                Điều khoản
                            </Link>
                            <Link href="" className="font-medium text-default-500">
                                Chính sách bảo mật
                            </Link>
                            <Link href="" className="font-medium text-default-500">
                                Dữ liệu khách hàng
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
