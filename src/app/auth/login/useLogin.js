'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { robustFetchWithoutAT, setCookie } from '@/helpers';
import { toast } from 'sonner';

const useLogin = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Capture redirectTo from query parameters
    const redirectTo = searchParams.get('redirectTo') || '/';

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
            const authResponse = await robustFetchWithoutAT(
                `${BASE_URL}/auth/login`,
                'POST',
                'Đăng nhập thành công...',
                values
            );

            const { accessToken, refreshToken } = authResponse.data;
            setCookie('accessToken', accessToken, 3600);
            setCookie('refreshToken', refreshToken, 604800);

            // Redirect to originally requested page or default to home page
            router.push(decodeURIComponent(redirectTo));
        } catch (error) {
            console.error('Login error:', error.message);

            if (error.message.includes('email')) {
                const email = error.message.match(/[\w.-]+@[\w.-]+\.\w+/)[0];
                router.push(`/auth/verification?email=${encodeURIComponent(email)}`);

                await robustFetchWithoutAT(`${BASE_URL}/auth/resend-verification`, 'POST', null, { email: email });
            }
        } finally {
            setLoading(false);
        }
    });

    return { loading, login, control, changeUserRole };
};

export default useLogin;
