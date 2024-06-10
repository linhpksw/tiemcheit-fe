import Cookies from 'js-cookie';

export const deleteCookie = (name) => {
    Cookies.remove(name, { path: '/' });
};

export const getCookie = (name) => {
    return Cookies.get(name);
};

export function setCookie(name, value, expires, path = '/', secure = true, sameSite = 'Strict') {
    const options = {
        expires: expires / 86400, // Convert seconds to days
        path: path,
        secure: secure,
        sameSite: sameSite,
    };
    Cookies.set(name, value, options);
}
