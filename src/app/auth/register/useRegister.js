'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';

const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const registerFormSchema = yup.object({
        fullName: yup.string().required('Vui lòng nhập họ và tên'),
        username: yup.string().required('Vui lòng nhập tên tài khoản'),
        phone: yup.string().required('Vui lòng nhập số điện thoại'),
        email: yup.string().email('Hãy nhập đúng định dạng email').required('Vui lòng nhập email'),
        password: yup.string().required('Vui lòng nhập mật khẩu'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
            .required('Vui lòng xác nhận mật khẩu'),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(registerFormSchema),
        defaultValues: {
            fullName: '',
            username: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const register = handleSubmit(async (values) => {
        setLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            toast.success('Đăng ký thành công. Đang chuyển hướng....', {
                position: 'top-right',
                duration: 2000,
            });
            router.push('/auth/login');
        } catch (error) {
            toast.error('Đăng ký thất bại: ' + error.message, {
                position: 'top-right',
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    });

    return { loading, register, control };
};

export default useRegister;
