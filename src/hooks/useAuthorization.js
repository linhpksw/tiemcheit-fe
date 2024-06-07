import { jwtDecode } from 'jwt-decode';
import { getCookie } from '@/helpers';

const useAuthorization = (username) => {
    const getDecodedToken = () => {
        const token = getCookie('accessToken');
        if (!token) return null;
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    };

    const getScopes = () => {
        const decoded = getDecodedToken();
        return decoded ? decoded.scope.split(' ') : [];
    };

    const checkAccess = ({ allowedRoles }) => {
        const decoded = getDecodedToken();
        const scopes = getScopes();
        const isAdmin = scopes.includes('ROLE_ADMIN');
        const isUser = decoded && decoded.sub === username;
        return isAdmin || (isUser && allowedRoles.some((role) => scopes.includes(role)));
    };

    return { checkAccess };
};

export default useAuthorization;
