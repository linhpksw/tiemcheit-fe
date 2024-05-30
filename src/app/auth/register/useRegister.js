'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { handleException } from '@/utils';
import { BASE_URL } from '@/common/constants';

const useRegister = () => {
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
            const response = await fetch(`${BASE_URL}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const result = await handleException(response);

            toast.success('Registration successful. Redirecting...', {
                position: 'top-right',
                duration: 2000,
            });
            router.push('/auth/login');
        } catch (error) {
            toast.error(error.message, {
                position: 'top-right',
                duration: 2000,
            });
        }
        setLoading(false);
    });

    return { loading, register, control };
};

export default useRegister;
