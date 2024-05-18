import Image from "next/image";
import Link from "next/link";
import { error404OtherImg } from "@/assets/data/images";
import { GoBackButton } from "@/components";

const Error404 = () => {
    return (
        <section className="py-10">
            <title>Không tìm thấy trang</title>

            <div className="container">
                <div className="flex items-center justify-center">
                    <div>
                        <div className="mb-2 flex h-full w-full justify-center">
                            <Image
                                src={error404OtherImg}
                                width={225}
                                height={225}
                                alt="not-found-image"
                                className=""
                                priority
                            />
                        </div>
                        <div className="max-w-xl text-center">
                            <h1 className="mb-4 text-5xl font-semibold text-default-800">
                                Ối...
                            </h1>
                            <h3 className="mb-4 text-2xl font-medium text-default-800">
                                Dường như bạn đang lạc đường...
                            </h3>
                            <p className="mx-auto mb-8 max-w-xl text-base text-default-600">
                                Có lỗi xảy ra. Có vẻ như yêu cầu của bạn không thể tìm thấy như liên kết bị hỏng hoặc trang đã bị xóa.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <GoBackButton />
                                <Link
                                    href="/home"
                                    className="relative inline-flex w-1/2 items-center justify-center rounded-lg border border-primary px-6 py-3 text-base font-medium capitalize text-primary transition-all hover:bg-primary hover:text-white lg:w-2/6"
                                >
                                    Về trang chủ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Error404;
