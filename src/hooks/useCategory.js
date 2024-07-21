"use client"
import useSWR from 'swr';
import { robustFetch, getCookie } from '@/helpers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useCategory = () => {
    const fetcher = async (url) => await robustFetch(url, 'GET');

    const { data, error, isLoading } = useSWR(`${BASE_URL}/categories`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
    });

    return {
        categories: data,
        isLoading,
        isError: error,
    };
};

export default useCategory;