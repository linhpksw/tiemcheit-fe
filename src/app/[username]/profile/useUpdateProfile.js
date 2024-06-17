'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { robustFetch, setCookie } from '@/helpers';

const useUpdateProfile = (user) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [loading, setLoading] = useState(false);

    const { fullname, username, email, phone, dob, gender } = user.data;

    const personalDetailsFormSchema = yup.object({
        fullname: yup.string().required('Vui lòng nhập họ và tên của bạn'),
        username: yup.string().required('Vui lòng nhập tên tài khoản của bạn'),
        email: yup.string().email('Vui lòng nhập email hợp lệ').required('Vui lòng nhập email của bạn'),
        phone: yup.string().required('Vui lòng nhập số điện thoại của bạn'),
        dob: yup.date().required('Vui lòng chọn ngày sinh của bạn'),
        gender: yup.string().required('Vui lòng chọn giới tính của bạn'),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(personalDetailsFormSchema),
        defaultValues: {
            fullname: fullname,
            username: username,
            email: email,
            phone: phone,
            dob: dob ? new Date(dob) : null,
            gender: gender,
        },
    });

    const update = handleSubmit(async (values) => {
        setLoading(true);

        try {
            await robustFetch(
                `${BASE_URL}/${username}/profile`,
                'PATCH',
                `Cập nhật thông tin ${values.username} thành công...`,
                values
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    });

    return { loading, update, control };
};

export default useUpdateProfile;
