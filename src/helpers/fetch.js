import { handleException } from '@/helpers';
import { getCookie, setCookie } from '@/helpers';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// using a singleton pattern to ensure that only one refresh token request is in progress at any time

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}

function onRrefreshed(token) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

export async function robustFetch(url, method, data = null, tokenType = null) {
    // console.log('robustFetch', url, method, data, tokenType);

    let token = tokenType ? getCookie(tokenType) : null;

    let fetchOptions = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
        },
        method: method,
        body: data ? JSON.stringify(data) : null,
    };

    try {
        let response = await fetch(url, fetchOptions);

        if (!response.ok && tokenType === 'accessToken') {
            if (!isRefreshing) {
                isRefreshing = true;
                const newToken = await refreshToken().catch((error) => {
                    isRefreshing = false;
                    throw error;
                });
                isRefreshing = false;
                onRrefreshed(newToken);
            }

            const retry = new Promise((resolve) => {
                subscribeTokenRefresh((token) => {
                    fetchOptions.headers.Authorization = `Bearer ${token}`;
                    resolve(fetch(url, fetchOptions).then(handleException));
                });
            });
            return await retry;
        }

        return await handleException(response);
    } catch (error) {
        console.error('Fetch error:', error.message);
        throw error;
    }
}

async function refreshToken() {
    const refresh = getCookie('refresh');

    try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refresh }),
        });

        const data = await response.json();
        const { accessToken, refreshToken } = data;

        if (response.ok) {
            setCookie('accessToken', accessToken, 3600);
            setCookie('refreshToken', refreshToken, 604800);
            return accessToken;
        } else {
            throw new Error('Failed to refresh token');
        }
    } catch (error) {
        console.error('Refresh token error:', error.message);
        throw error;
    }
}
