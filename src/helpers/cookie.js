export const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export function setCookie(name, value, expires, path = '/', secure = true, sameSite = 'Strict') {
    let cookieString = `${name}=${value}; path=${path}; samesite=${sameSite};`;
    if (expires) {
        const date = new Date();
        date.setTime(date.getTime() + expires * 1000); // expires is in seconds
        cookieString += ` expires=${date.toUTCString()};`;
    }
    if (secure) {
        cookieString += ' secure;';
    }
    document.cookie = cookieString;
}
