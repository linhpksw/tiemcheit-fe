'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { robustFetch } from '@/helpers';

const usePassword = (user) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

	const [loading, setLoading] = useState(false);
	const { isHavePassword } = user.data;

	yup.addMethod(yup.string, 'password', function (message) {
		return this.test('password', message, function (value) {
			const { path, createError } = this;
			const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
			return value && regexPassword.test(value)
				? true
				: createError({
						path,
						message:
							message ||
							'Mật khẩu cần chứa ít nhất 8 kí tự, 1 kí tự in hoa, 1 kí tự in thường, 1 chữ số và 1 kí tự đặc biệt',
					});
		});
	});

	const updatePasswordFormSchema = yup.object({
		currentPassword: yup
			.string()
			.password(
				'Mật khẩu cần chứa ít nhất 8 kí tự, 1 kí tự in hoa, 1 kí tự in thường, 1 chữ số và 1 kí tự đặc biệt'
			)
			.required('Vui lòng nhập mật khẩu hiện tại của bạn'),
		newPassword: yup
			.string()
			.password(
				'Mật khẩu cần chứa ít nhất 8 kí tự, 1 kí tự in hoa, 1 kí tự in thường, 1 chữ số và 1 kí tự đặc biệt'
			)
			.notOneOf([yup.ref('currentPassword')], 'Mật khẩu mới không được trùng với mật khẩu hiện tại')
			.required('Vui lòng nhập mật khẩu mới của bạn'),
		confirmPassword: yup.string().oneOf([yup.ref('newPassword'), ''], 'Mật khẩu không khớp'),
	});

	const createPasswordFormSchema = yup.object({
		newPassword: yup
			.string()
			.password(
				'Mật khẩu cần chứa ít nhất 8 kí tự, 1 kí tự in hoa, 1 kí tự in thường, 1 chữ số và 1 kí tự đặc biệt'
			)
			.required('Vui lòng nhập mật khẩu mới của bạn'),
		confirmPassword: yup.string().oneOf([yup.ref('newPassword'), ''], 'Mật khẩu không khớp'),
	});

	const { control, handleSubmit } = useForm({
		resolver: yupResolver(isHavePassword ? updatePasswordFormSchema : createPasswordFormSchema),
	});

	const update = handleSubmit(async (values) => {
		setLoading(true);

		try {
			await robustFetch(`${BASE_URL}/auth/change-password`, 'POST', `Cập nhật mật khẩu mới thành công...`, {
				...values,
				username: user.data.username,
				isHavePassword: user.data.isHavePassword,
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
