'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { robustFetchWithoutAT } from '@/helpers';
import { toast } from 'sonner';

const useVerification = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const router = useRouter();
    const search = useSearchParams();
    const email = search.get('email');
    const type = search.get('type');

    const message =
        type === 'verify'
            ? 'Xác minh thành công. Đang chuyển hướng đến trang đăng nhập...'
            : 'Xác minh thành công. Đang chuyển hướng đến trang đặt lại mật khẩu..';

    const verify = async (otp) => {
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
            toast.dismiss();
            toast.error('Gửi mã xác minh thất bại. Vui lòng thử lại.');
        }
    };

    return { verify };
};

export default useVerification;
