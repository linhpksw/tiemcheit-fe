'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { robustFetch, setCookie } from '@/helpers';
import { mutate } from 'swr';
import { jwtDecode } from 'jwt-decode';

const useLogin = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const loginFormSchema = yup.object({
        username: yup.string().required('Vui lòng nhập username'),
        password: yup.string().required('Vui lòng nhập mật khẩu'),
    });

    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(loginFormSchema),
        defaultValues: {
            username: 'linhpksw',
            password: '12345678',
        },
    });

    const changeUserRole = (role) => {
        switch (role) {
            case 'customer':
                reset({
                    username: 'customer',
                    password: '12345678',
                });
                break;
            case 'admin':
                reset({
                    username: 'admin',
                    password: '12345678',
                });
                break;
            case 'employee':
                reset({
                    username: 'employee',
                    password: '12345678',
                });
                break;
            default:
                reset({
                    username: 'customer',
                    password: '12345678',
                });
        }
    };

    const login = handleSubmit(async (values) => {
        setLoading(true);

        const authResponse = await robustFetch(`${BASE_URL}/auth/login`, 'POST', 'Đăng nhập thành công...', values);

        const { accessToken, refreshToken } = authResponse.data;
        setCookie('accessToken', accessToken, 3600);
        setCookie('refreshToken', refreshToken, 604800);

        const username = accessToken ? jwtDecode(accessToken).sub : null;
        mutate(`${BASE_URL}/user/${username}`);

        router.push('/');

        setLoading(false);
    });

    return { loading, login, control, changeUserRole };
};

export default useLogin;
