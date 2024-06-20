'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { robustFetchWithoutAT, setCookie } from '@/helpers';

const useForgot = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const forgotFormSchema = yup.object({
        email: yup.string().email('Vui lòng nhập email hợp lệ').required('Nhập email của bạn'),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(forgotFormSchema),
    });

    const forgot = handleSubmit(async (values) => {
        setLoading(true);

        try {
            router.push(`/auth/verification?type=forgot&email=${encodeURIComponent(values.email)}`);

            await robustFetchWithoutAT(
                `${BASE_URL}/auth/send-forgot-code`,
                'POST',
                'Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn.',
                values
            );
        } catch (error) {
            console.error('Login error:', error.message);
        } finally {
            setLoading(false);
        }
    });

    return { loading, forgot, control };
};

export default useForgot;
