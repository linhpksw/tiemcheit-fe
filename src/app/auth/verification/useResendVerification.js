'use client';
import { useSearchParams } from 'next/navigation';
import { robustFetchWithoutAT } from '@/helpers';
import { toast } from 'sonner';

const useResendVerification = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const search = useSearchParams();
    const email = search.get('email');
    const type = search.get('type');

    const resend = async (event) => {
        event.preventDefault();

        const message =
            type === 'verify'
                ? 'Mã xác minh tài khoản đã được gửi đến email của bạn.'
                : 'Mã xác minh mật khẩu mới đã được gửi đến email của bạn.';

        try {
            await robustFetchWithoutAT(`${BASE_URL}/auth/resend-verification`, 'POST', message, {
                email: email,
                type: type,
            });
        } catch (error) {
            toast.dismiss();
            console.error(error);
            toast.error('Gửi mã xác minh thất bại. Vui lòng thử lại.');
        } finally {
        }
    };

    return { resend };
};

export default useResendVerification;
