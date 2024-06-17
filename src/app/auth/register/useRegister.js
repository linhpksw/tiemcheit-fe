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
            router.push(`/auth/verification?email=${encodeURIComponent(values.email)}`);

            await robustFetchWithoutAT(`${BASE_URL}/auth/register`, 'POST', 'Đăng ký thành công', values);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    });

    return { loading, register, control };
};

export default useRegister;
