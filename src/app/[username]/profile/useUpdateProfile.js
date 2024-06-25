'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { robustFetch } from '@/helpers';

const useUpdateProfile = (user) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [loading, setLoading] = useState(false);

    const { fullname, username, email, phone, dob, gender } = user.data;

    yup.addMethod(yup.string, 'phoneVN', function (message) {
        return this.test('phoneVN', message, function (value) {
            const { path, createError } = this;
            const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
            return value && regexPhoneNumber.test(value)
                ? true
                : createError({ path, message: message || 'Số điện thoại không hợp lệ' });
        });
    });

    yup.addMethod(yup.string, 'username', function (message) {
        return this.test('username', message, function (value) {
            const { path, createError } = this;
            const regexUsername = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
            return value && regexUsername.test(value)
                ? true
                : createError({ path, message: message || 'Tên tài khoản không hợp lệ' });
        });
    });

    yup.addMethod(yup.string, 'fullname', function (message) {
        return this.test('fullname', message, function (value) {
            const { path, createError } = this;
            const regexFullname =
                /^[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ][a-zàáâãèéêìíòóôõùúăđĩũơưạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]*(\s[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ][a-zàáâãèéêìíòóôõùúăđĩũơưạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]*)*$/u;
            const trimmedValue = value.trim();
            const hasLeadingOrTrailingSpaces = value !== trimmedValue;
            const hasMultipleSpacesBetweenWords = /\s{2,}/.test(trimmedValue);
            return !hasLeadingOrTrailingSpaces &&
                !hasMultipleSpacesBetweenWords &&
                trimmedValue.length >= 4 &&
                trimmedValue.length <= 64 &&
                regexFullname.test(trimmedValue)
                ? true
                : createError({ path, message: message || 'Họ và tên không hợp lệ' });
        });
    });

    const personalDetailsFormSchema = yup.object({
        fullname: yup.string().fullname('Vui lòng nhập họ và tên hợp lệ').required('Vui lòng nhập họ và tên'),
        username: yup.string().username('Vui lòng nhập tên tài khoản hợp lệ').required('Vui lòng nhập tên tài khoản'),
        email: yup.string().email('Vui lòng nhập email hợp lệ').required('Vui lòng nhập email của bạn'),
        phone: yup.string().phoneVN('Vui lòng nhập số điện thoại hợp lệ').required('Vui lòng nhập số điện thoại'),
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
