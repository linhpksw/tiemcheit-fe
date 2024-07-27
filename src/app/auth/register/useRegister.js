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

	yup.addMethod(yup.string, 'phoneVN', function (message) {
		return this.test('phoneVN', message, function (value) {
			const { path, createError } = this;
			const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
			return value && regexPhoneNumber.test(value)
				? true
				: createError({ path, message: message || 'Số điện thoại không hợp lệ với tiêu chuẩn của Việt Nam' });
		});
	});

	yup.addMethod(yup.string, 'username', function (message) {
		return this.test('username', message, function (value) {
			const { path, createError } = this;
			const regexUsername = /^(?=.{4,20}$)[a-zA-Z0-9]+$/;
			return value && regexUsername.test(value)
				? true
				: createError({
						path,
						message:
							message ||
							'Tên tài khoản không hợp lệ. Tài khoản chỉ được chứa chữ cái và số, độ dài từ 4 đến 20 ký tự.',
					});
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
				: createError({
						path,
						message:
							message ||
							'Họ và tên không hợp lệ. Tên phải đủ dài, chữ cái đầu tiên của mỗi từ phải được viết hoa và không có khoảng trắng thừa',
					});
		});
	});

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

	const registerFormSchema = yup.object({
		fullname: yup.string().fullname('Vui lòng nhập họ và tên hợp lệ').required('Vui lòng nhập họ và tên'),
		username: yup.string().username('Vui lòng nhập tên tài khoản hợp lệ').required('Vui lòng nhập tên tài khoản'),
		phone: yup.string().phoneVN('Vui lòng nhập số điện thoại hợp lệ').required('Vui lòng nhập số điện thoại'),
		email: yup.string().email('Hãy nhập đúng định dạng email').required('Vui lòng nhập email'),
		password: yup
			.string()
			.password(
				'Mật khẩu cần chứa ít nhất 8 kí tự, 1 kí tự in hoa, 1 kí tự in thường, 1 chữ số và 1 kí tự đặc biệt'
			)
			.required('Vui lòng nhập mật khẩu'),
		confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp'),
	});

	const { control, handleSubmit } = useForm({
		resolver: yupResolver(registerFormSchema),
		defaultValues: {
			fullname: 'Lê Trọng Linh',
			username: 'linhpksw',
			email: 'linhpksw@gmail.com',
			phone: '0375830815',
			password: 'Bmctc20@',
			confirmPassword: 'Bmctc20@',
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
