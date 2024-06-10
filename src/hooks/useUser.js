import useSWR from 'swr';
import { robustFetch, getCookie } from '@/helpers';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useUser = () => {
    const accessToken = getCookie('accessToken');

    const username = accessToken ? jwtDecode(accessToken).sub : null;

    const fetcher = (url) => robustFetch(url, 'GET', `Lấy thành công thông tin ${username}`, null, 'accessToken');

    const { data, error, isLoading } = useSWR(accessToken ? `${BASE_URL}/${username}/profile` : null, fetcher, {
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
