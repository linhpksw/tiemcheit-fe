'use client';
import { Breadcrumb } from '@/components';
import AllWishList from './AllWishList';
import { getCookie } from '@/helpers';
import { useRouter, usePathname } from 'next/navigation';

const Wishlist = () => {
    const accessToken = getCookie('accessToken');
    const router = useRouter();
    const pathname = usePathname();

    if (!accessToken) {
        const loginUrl = `/auth/login?redirectTo=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
        return;
    }

    return (
        <>
            <Breadcrumb title="Danh sách yêu thích" />
            <section className="py-6 lg:py-10">
                <div className="container">
                    <div className="text-xl font-medium mb-2">Danh sách yêu thích</div>
                    <div className="divide-y divide-default-200 overflow-hidden rounded-lg border border-default-200 ">
                        <AllWishList />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Wishlist;
