'use client';
import useSWR from 'swr';
import { getCookie, robustFetch } from '@/helpers';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useUser = () => {
	const accessToken = getCookie('accessToken');
	const refreshToken = getCookie('refreshToken');
	let username = '';

	if (accessToken || refreshToken) {
		const token = accessToken ? accessToken : refreshToken;

		const { sub } = jwtDecode(token);
		username = sub;
	}

	const fetcher = (url) => robustFetch(url, 'GET', `Lấy thành công thông tin...`);

	const { data, error, isLoading } = useSWR(username ? `${BASE_URL}/${username}/profile` : null, fetcher, {
		shouldRetryOnError: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
	});

	return {
		user: data,
		isLoading,
		isError: error,
	};
};

export default useUser;
