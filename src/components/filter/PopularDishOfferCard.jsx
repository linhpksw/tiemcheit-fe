import Image from 'next/image';
import { LuMoveRight } from 'react-icons/lu';
import { filterOfferDishOtherImg, offerBgOtherImg } from '@/assets/data';
import Link from 'next/link';

const PopularDishOfferCard = ({ username }) => {
    return (
        <div className="py-6">
            <div
                style={{ backgroundImage: `url(${offerBgOtherImg.src})` }}
                className="relative overflow-hidden rounded-lg bg-opacity-5 bg-cover bg-center"
            >
                <div className="absolute inset-0 -z-10 bg-primary/10" />
                <div className="p-12">
                    <div className="mb-6 flex justify-center">
                        <Image src={filterOfferDishOtherImg} alt="dish" />
                    </div>
                    <div className="mb-10 text-center">
                        <h3 className="mb-2 text-2xl font-medium text-default-900">
                            Làm nó khác một chút?
                        </h3>
                        <p className="text-sm text-default-500">
                            Tự tạo món chè riêng dành cho bạn và thêm ngay vào giỏ hàng!
                        </p>
                    </div>
                    {/* <button
						className=""
						type="button"
					>
						Mua ngay <LuMoveRight size={20} />
					</button> */}
                    <Link
                        href={username != '' ? `/${username}/custom-dish` : "/auth/login"}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-white transition-all hover:bg-primary-500"
                    >
                        Tạo món chè <LuMoveRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PopularDishOfferCard;
