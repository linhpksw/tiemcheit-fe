import Image from "next/image";
import { authBgOtherImg, waveOtherImg } from "@/assets/data/images";

const Layout = ({ children }) => {
    return (
        <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-primary/10">
            <div className="relative flex items-center bg-gradient-to-b from-primary/5 via-primary/5 to-primary/10 h-full lg:h-screen py-8 lg:py-0 lg:pl-12 ">
                <div className="container">{children}</div>

                <div>
                    <div className="absolute end-0 start-0 top-1/2 -z-10 w-full -translate-y-1/3">
                        <Image
                            width={1853}
                            height={420}
                            src={waveOtherImg}
                            alt=""
                            className="flex w-full opacity-50"
                        />
                    </div>
                    <div className="absolute end-0 top-0 -z-10 hidden h-5/6 lg:flex">
                        <Image
                            width={657}
                            height={610}
                            alt=""
                            src={authBgOtherImg}
                            className="z-0 w-full"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
