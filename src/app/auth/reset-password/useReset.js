'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { robustFetchWithoutAT } from '@/helpers';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const useReset = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const search = useSearchParams();
    const email = search.get('email');
    const code = search.get('code');

    const resetFormSchema = yup.object({
        newPassword: yup.string().required('Nhập mật khẩu mới'),
        confirmNewPassword: yup
            .string()
            .oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp')
            .required('Nhập lại mật khẩu mới'),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(resetFormSchema),
    });

    const reset = handleSubmit(async (values) => {
        setLoading(true);

        try {
            await robustFetchWithoutAT(
                `${BASE_URL}/auth/reset-password`,
                'POST',
                `Cập nhật mật khẩu mới thành công. Đang chuyển hướng tới trang đăng nhập...`,
                {
                    newPassword: values.newPassword,
                    email: email,
                    code: code,
                }
            );

            router.push('/auth/login');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    });

    return { control, loading, reset };
};

export default useReset;
