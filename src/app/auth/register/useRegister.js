'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { robustFetchWithoutAT } from '@/helpers';

const useRegister = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const registerFormSchema = yup.object({
        fullname: yup.string().required('Vui lòng nhập họ và tên'),
        username: yup.string().required('Vui lòng nhập tên tài khoản'),
        phone: yup.string().required('Vui lòng nhập số điện thoại'),
        email: yup.string().email('Hãy nhập đúng định dạng email').required('Vui lòng nhập email'),
        password: yup.string().required('Vui lòng nhập mật khẩu'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp'),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(registerFormSchema),
        defaultValues: {
            fullname: 'Lê Trọng Linh',
            username: 'linhpksw',
            email: 'linhpksw@gmail.com',
            phone: '0375830815',
            password: '12345678',
            confirmPassword: '12345678',
        },
    });

    const register = handleSubmit(async (values) => {
        setLoading(true);
        try {
            await robustFetchWithoutAT(
                `${BASE_URL}/auth/register`,
                'POST',
                'Mã xác thực đã được gửi đến email của bạn',
                values
            );

            router.push(`/auth/verification?type=verify&email=${encodeURIComponent(values.email)}`);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    });

    const loginUsingGoogle = async () => {
        const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
        const GOOGLE_AUTH_URI = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URI;

        const targetUrl = `${GOOGLE_AUTH_URI}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;

        router.push(targetUrl);
    };

    return { loading, register, control, loginUsingGoogle };
};

export default useRegister;
