'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { robustFetch } from '@/helpers';

const useVerify = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get('email');
    console.log(email);

    const verify = async (otp) => {
        setLoading(true);
        try {
            await robustFetch(
                `${BASE_URL}/auth/verify`,
                'POST',
                'Xác minh thành công. Đang chuyển hướng đến trang đăng nhập...',
                { code: otp, email: email }
            );

            router.push('/auth/login');
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return { loading, verify };
};

export default useVerify;
