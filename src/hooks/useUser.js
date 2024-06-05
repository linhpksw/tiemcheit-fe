import useSWR from 'swr';
import { robustFetch, getCookie } from '@/helpers';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useUser = () => {
    const accessToken = getCookie('accessToken');

    const username = accessToken ? jwtDecode(accessToken).sub : null;

    const fetcher = (url) => robustFetch(url, 'GET', null, 'accessToken');

    const { data, error, isLoading } = useSWR(accessToken ? `${BASE_URL}/user/${username}/detail` : null, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });

    return {
        user: data,
        isLoading: !data && !error,
        isError: error,
    };
};

export default useUser;
