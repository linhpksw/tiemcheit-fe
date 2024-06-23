import { jwtDecode } from 'jwt-decode';
import { getCookie } from '@/helpers';
import { useCallback } from 'react';

const useRole = () => {
    const getDecodedToken = useCallback(() => {
        const token = getCookie('accessToken');
        if (!token) return null;
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }, []);

    const getScopes = useCallback(() => {
        const decoded = getDecodedToken();
        return decoded ? decoded.scope.split(' ') : [];
    }, [getDecodedToken]);

    const checkAccess = useCallback(
        ({ allowedRoles }) => {
            const scopes = getScopes();
            const isAdmin = scopes.includes('ROLE_ADMIN');
            return isAdmin || (Array.isArray(allowedRoles) && allowedRoles.some((role) => scopes.includes(role)));
        },
        [getScopes]
    );

    return { checkAccess };
};

export default useRole;
