'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { robustFetch, robustFetchWithoutAT } from '@/helpers';

const useVerification = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const email = useSearchParams().get('email');

    const verify = async (otp) => {
        setLoading(true);
        try {
            await robustFetchWithoutAT(
                `${BASE_URL}/auth/verification`,
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

export default useVerification;
