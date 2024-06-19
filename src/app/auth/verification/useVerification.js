'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { robustFetchWithoutAT } from '@/helpers';

const useVerification = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const search = useSearchParams();
    const email = search.get('email');
    const type = search.get('type');

    const message =
        type === 'verify'
            ? 'Xác minh thành công. Đang chuyển hướng đến trang đăng nhập...'
            : 'Xác minh thành công. Đang chuyển hướng đến trang đặt lại mật khẩu..';

    const verify = async (otp) => {
        console.log('otp', otp);
        setLoading(true);
        try {
            await robustFetchWithoutAT(`${BASE_URL}/auth/verification`, 'POST', message, {
                code: otp,
                email: email,
                type: type,
            });

            if (type === 'verify') {
                router.push('/auth/login');
            } else {
                router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, verify };
};

export default useVerification;
