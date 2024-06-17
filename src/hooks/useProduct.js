"use client"
import useSWR from 'swr';
import { robustFetch, robustFetchWithoutAT } from '@/helpers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const useProductDetail = (productId) => {
    const fetcher = async (url) => {
        return await robustFetch(url, 'GET', null);
    };
    const { data, error, isLoading } = useSWR(productId ? `${BASE_URL}/products/${productId}` : null, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
    });

    return {
        product: data,
        isLoading: isLoading,
        isError: error,
    };
}

export const useClientProduct = () => {
    const fetcher = async (url) => {
        return await robustFetch(url, 'GET', null);
    };

    const { data, error, isLoading } = useSWR(`${BASE_URL}/products/status/active-disabled`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
    });

    return {
        product: data,
        isLoading: isLoading,
        isError: error,
    };
}

export const useProductByStatus = (status) => {
    const fetcher = async (url) => {
        return await robustFetch(url, 'GET', null);
    };

    const { data, error, isLoading } = useSWR(`${BASE_URL}/products/status/${status}`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
    });

    return {
        product: data,
        isLoading: isLoading,
        isError: error,
    };
}

export const useProduct = () =>{
    const fetcher = async (url) => {
        return await robustFetchWithoutAT(url, 'GET', null);
    };

    const { data, error, isLoading } = useSWR( `${BASE_URL}/products`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
    });

    return {
        product: data,
        isLoading: isLoading,
        isError: error,
    };
}

export const useProductByCategory = (categoryid) => {
    const fetcher = async (url) => {
        return await robustFetch(url, 'GET', null);
    };

    const { data, error, isLoading } = useSWR( `${BASE_URL}/products/categories/${categoryid}`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
    });

    return {
        product: data,
        isLoading: isLoading,
        isError: error,
    };
}

export const useBestSeller = (top) => {
    const fetcher = async (url) => {
        return await robustFetch(url, 'GET', null);
    };

    const { data, error, isLoading } = useSWR( `${BASE_URL}/products/top/${top}`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
    });

    return {
        bestProducts: data,
        isLoading: isLoading,
        isError: error,
    };
}




