'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { robustFetch } from '@/helpers';

const usePassword = (user) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [loading, setLoading] = useState(false);

    const credentialsManagementFormSchema = yup.object({
        currentPassword: yup.string().required('Vui lòng nhập mật khẩu hiện tại của bạn'),
        newPassword: yup.string().required('Vui lòng nhập mật khẩu mới của bạn'),
        confirmPassword: yup.string().oneOf([yup.ref('newPassword'), ''], 'Mật khẩu không khớp'),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(credentialsManagementFormSchema),
    });

    const update = handleSubmit(async (values) => {
        setLoading(true);

        try {
            await robustFetch(`${BASE_URL}/auth/reset-password`, 'POST', `Cập nhật mật khẩu mới thành công...`, {
                ...values,
                username: user.data.username,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    });

    return { loading, update, control };
};

export default usePassword;
