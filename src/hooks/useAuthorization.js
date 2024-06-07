import { jwtDecode } from 'jwt-decode';
import { getCookie } from '@/helpers';

const useAuthorization = () => {
    const getScopes = () => {
        const token = getCookie('accessToken');
        if (!token) return [];
        try {
            const decoded = jwtDecode(token);
            return decoded.scope.split(' ');
        } catch (error) {
            console.error('Failed to decode token:', error);
            return [];
        }
    };

    const checkAccess = ({ allowedRoles }) => {
        const scopes = getScopes();
        return allowedRoles.some((role) => scopes.includes(role));
    };

    return { checkAccess };
};

export default useAuthorization;
