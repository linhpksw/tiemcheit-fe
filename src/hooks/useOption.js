'use client';
import useSWR from 'swr';
import { robustFetch } from '@/helpers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useOption = () => {
	const fetcher = async (url) => {
		return await robustFetch(url, 'GET');
	};

	const { data, error, isLoading } = useSWR(`${BASE_URL}/option`, fetcher, {
		shouldRetryOnError: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
	});

	return {
		option: data,
		isLoading: isLoading,
		isError: error,
	};
};

export default useOption;
