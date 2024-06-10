'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { robustFetch, getCookie, deleteCookie } from '@/helpers';
import { useRouter } from 'next/navigation';

const useDeactivate = (user) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const deactivateFormSchema = yup.object({
        confirmDeactivate: yup
            .string()
            .oneOf(['Xoá tài khoản'], 'Vui lòng nhập chính xác "Xoá tài khoản" để xác nhận.'),
        currentPassword: yup.string().required('Vui lòng nhập mật khẩu hiện tại của bạn'),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(deactivateFormSchema),
    });

    const deactivate = handleSubmit(async (values) => {
        setLoading(true);

        try {
            await robustFetch(
                `${BASE_URL}/auth/deactivate`,
                'POST',
                `Xoá tài khoản thành công. Đang đăng xuất...`,
                { ...values, username: user.data.username, token: getCookie('refreshToken') },
                'accessToken'
            );

            deleteCookie('refreshToken');
            deleteCookie('accessToken');

            router.replace('/auth/login');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    });

    return { loading, deactivate, control };
};

export default useDeactivate;
