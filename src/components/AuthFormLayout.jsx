import Link from "next/link";
import Image from "next/image";

import { logoDarkImg, logoLightImg, } from "@/assets/data/images";

const AuthFormLayout = ({
    authTitle,
    helpText,
    children,
}) => {
    return (
        <div className="flex items-center justify-center lg:justify-start">
            <div className="flex h-full flex-col">
                <div className="shrink">
                    {/* Logo */}
                    <div>
                        <Link href="/" className="flex items-center">
                            <Image
                                width={156}
                                height={48}
                                src={logoDarkImg}
                                alt="logo"
                                className="flex h-12 dark:hidden"
                                placeholder="blur"
                                priority
                            />
                            <Image
                                width={156}
                                height={48}
                                src={logoLightImg}
                                alt="logo"
                                className="hidden h-12 dark:flex"
                                placeholder="blur"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Help text */}
                    <div className="py-5">
                        <h1 className="mb-2 text-3xl font-semibold text-default-800">
                            {authTitle}
                        </h1>
                        <p className="max-w-md text-sm text-default-500">{helpText}</p>
                    </div>

                    {/* Form */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthFormLayout;
