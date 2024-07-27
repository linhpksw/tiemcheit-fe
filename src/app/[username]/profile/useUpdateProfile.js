'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { robustFetch } from '@/helpers';
import { getImagePath } from '@/utils';
import { debounce } from 'lodash';

const useUpdateProfile = (user) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	const [loading, setLoading] = useState(false);

	const [images, setImages] = useState([]);
	const [initImages, setInitImages] = useState(null);

	const { fullname, username, email, phone, dob, gender } = user.data;

	useEffect(() => {
		const loadUserAvatar = async () => {
			try {
				const response = await robustFetch(`${BASE_URL}/${username}/avatars`, 'GET');

				setInitImages(getImagePath(response.data.image));
			} catch (error) {
				console.error('Failed to fetch avatars: ', error);
			}
		};
		loadUserAvatar();
	}, [username]);

	const handleFilePondUpdate = debounce((fileItems) => {
		const updatedImages = fileItems.map((fileItem) => ({
			file: fileItem.file,
			metadata: fileItem.getMetadata(),
		}));
		setImages(updatedImages);
	}, 300);

	yup.addMethod(yup.string, 'phoneVN', function (message) {
		return this.test('phoneVN', message, function (value) {
			const { path, createError } = this;
			const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
			return value && regexPhoneNumber.test(value)
				? true
				: createError({ path, message: message || 'Số điện thoại không hợp lệ' });
		});
	});

	// yup.addMethod(yup.string, 'username', function (message) {
	// 	return this.test('username', message, function (value) {
	// 		const { path, createError } = this;
	// 		const regexUsername = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
	// 		return value && regexUsername.test(value)
	// 			? true
	// 			: createError({ path, message: message || 'Tên tài khoản không hợp lệ' });
	// 	});
	// });

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
		username: yup.string().required('Vui lòng nhập tên tài khoản'),
		email: yup.string().email('Vui lòng nhập email hợp lệ').required('Vui lòng nhập email của bạn'),
		phone: yup.string().phoneVN('Vui lòng nhập số điện thoại hợp lệ').required('Vui lòng nhập số điện thoại'),
		gender: yup.string().required('Vui lòng chọn giới tính của bạn'),
		dob: yup
			.date()
			.required('Vui lòng chọn ngày sinh của bạn')
			.test('age', 'Bạn phải ít nhất 13 tuổi hoặc hơn', function (birthdate) {
				const cutoff = new Date();
				cutoff.setFullYear(cutoff.getFullYear() - 13);
				return birthdate <= cutoff;
			}),
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
			if (images.length > 0) {
				const image = images[0];
				const formData = new FormData();
				formData.append('file', image.file);
				formData.append('directory', 'avatars');

				const res = await fetch('/api/s3-upload', {
					method: 'POST',
					body: formData,
				});

				if (!res.ok) {
					throw new Error('Failed to upload image');
				}

				const imageData = {
					image: `avatars/${image.file.name}`,
				};

				await robustFetch(`${BASE_URL}/${username}/avatars`, 'POST', null, imageData);

				setInitImages(getImagePath(imageData.image));
			}

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

	return { loading, update, control, handleFilePondUpdate, initImages };
};

export default useUpdateProfile;
