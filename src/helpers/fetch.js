import { getCookie, setCookie } from '@/helpers';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ACCESS_TOKEN_EXPIRY = process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY;

const ACCESS_TOKEN_NAME = 'accessToken';
const REFRESH_TOKEN_NAME = 'refreshToken';

// using a singleton pattern to ensure that only one refresh token request is in progress at any time

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}

function onRefreshed(token) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

export async function robustFetch(url, method, message = '', data = null, tokenType = null) {
    let token = tokenType ? getCookie(tokenType) : null;

    let fetchOptions = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
        },
        method: method,
        body: data ? JSON.stringify(data) : null,
    };

    toast.loading('Đang xử lý...', { position: 'bottom-right' });

    try {
        let response = await fetch(url, fetchOptions);

        // Dismiss the loading toast when the fetch completes
        toast.dismiss();

        if (!response.ok) {
            if (tokenType === 'accessToken' && response.status === 401) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    const newToken = await refreshToken().catch((error) => {
                        isRefreshing = false;
                        throw error;
                    });
                    isRefreshing = false;
                    onRefreshed(newToken);
                }

                const retry = new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        fetchOptions.headers.Authorization = `Bearer ${token}`;
                        resolve(fetch(url, fetchOptions));
                    });
                });
                response = await retry;
            }
            if (!response.ok) {
                const errorDetails = await parseErrorResponse(response);

                throw new Error(errorDetails);
            }
        }

        const responseData = await response.json();
        if (message) {
            toast.success(message, { position: 'bottom-right', duration: 1000 });
        }
        return responseData;
    } catch (error) {
        console.error('Fetch error:', error.message);
        toast.dismiss();
        toast.error(`${error}`, { position: 'bottom-right', duration: 2000 });
        throw error; // Rethrowing the caught error
    }
}

async function refreshToken() {
    const oldRefreshToken = getCookie(REFRESH_TOKEN_NAME);

    try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: oldRefreshToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const { accessToken, refreshToken } = data;

        setCookie(ACCESS_TOKEN_NAME, accessToken, ACCESS_TOKEN_EXPIRY);
        setCookie(REFRESH_TOKEN_NAME, refreshToken, REFRESH_TOKEN_EXPIRY);
    } catch (error) {
        console.error('Refresh token error:', error.message);
        throw error;
    }
}

async function parseErrorResponse(response) {
    let errorDetails;
    try {
        const errorResponse = await response.json();
        errorDetails = `${errorResponse.message} (HTTP ${response.status})`;
    } catch (jsonError) {
        console.error(`JSON parsing error: ${jsonError.message}`);
    }
    return errorDetails;
}
