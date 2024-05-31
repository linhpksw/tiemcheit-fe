'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import { handleException } from '@/utils';
import { useUserContext } from '@/context/useUserContext';
import { BASE_URL } from '@/common/constants';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    // Destructure login function from user context
    const { login: contextLogin } = useUserContext();

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

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const result = await handleException(response);

            const { accessToken, refreshToken } = result.data;

            document.cookie = `accessToken=${accessToken};path=/;secure`;
            document.cookie = `refreshToken=${refreshToken};path=/;secure`;

            const decodedToken = jwtDecode(accessToken);
            console.log(decodedToken);

            const userResponse = await fetch(`${BASE_URL}/user/${decodedToken.sub}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const userData = await handleException(userResponse);

            const { data } = userData;

            // localStorage.setItem('user', JSON.stringify(userData));

            // Update user context and local storage
            contextLogin(data); // Use the login function from the context

            toast.success('Đăng nhập thành công. Đang chuyển hướng....', {
                position: 'bottom-right',
                duration: 2000,
            });
            router.push('/');
        } catch (error) {
            toast.error(error.message, { position: 'top-right', duration: 2000 });
        }
        setLoading(false);
    });

    return { loading, login, control, changeUserRole };
};

export default useLogin;
