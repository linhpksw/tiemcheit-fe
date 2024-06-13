"use client"
import useSWR from 'swr';
import { robustFetch } from '@/helpers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const useProductDetail = (productId) => {
    const fetcher = async (url) => {
        return await robustFetch(url, 'GET', "");
    };
    const { data, error, isLoading } = useSWR(productId ? `${BASE_URL}/product/${productId}` : null, fetcher, {
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
        return await robustFetch(url, 'GET', "");
    };

    const { data, error, isLoading } = useSWR( `${BASE_URL}/product`, fetcher, {
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
        return await robustFetch(url, 'GET', "");
    };

    const { data, error, isLoading } = useSWR( `${BASE_URL}/product/category/${categoryid}`, fetcher, {
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
        return await robustFetch(url, 'GET', "");
    };

    const { data, error, isLoading } = useSWR( `${BASE_URL}/product/top/${top}`, fetcher, {
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