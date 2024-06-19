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
    const searchParams = useSearchParams();

    const forgotFormSchema = yup.object({
        email: yup
            .string()
            .email("Vui lòng nhập email hợp lệ")
            .required("Nhập email của bạn"),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(forgotFormSchema),
    });

    const forgot = handleSubmit(async (values) => {
        setLoading(true);

        try {
            await robustFetchWithoutAT(
                `${BASE_URL}/auth/forgot-password`,
                'POST',
                'Yêu cầu quên mật khẩu đã được gửi đến email của bạn.',
                values
            );

            router.push(`/auth/verification?email=${encodeURIComponent(values.email)}`);
           
        } catch (error) {
            console.error('Login error:', error.message);

        } finally {
            setLoading(false);
        }
    });

    return { loading, forgot, control };
};

export default useForgot;
