import { jwtDecode } from 'jwt-decode';
import { getCookie } from '@/helpers';

const useAuthorization = (username = null) => {
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

	const checkAccess = ({ allowedRoles, notAllowedRoles }) => {
		const decoded = getDecodedToken();
		const scopes = getScopes();
		const isAdmin = scopes.includes('ROLE_ADMIN');
		const isUser = username && decoded && decoded.sub === username;

		let isAllowed = true;

		if (allowedRoles) {
			isAllowed = allowedRoles.some((role) => scopes.includes(role));
		}

		let isDisallowed = false;

		if (notAllowedRoles) {
			isDisallowed = notAllowedRoles.some((role) => scopes.includes(role));
		}

		// console.log('allowedRoles:', allowedRoles);
		// console.log('notAllowedRoles:', notAllowedRoles);
		// console.log('pathUsername:', username);
		// console.log('decodedUsername:', decoded.sub);

		// console.log('isAdmin:', isAdmin);
		// console.log('isUser:', isUser);
		// console.log('isAllowed:', isAllowed);
		// console.log('isDisallowed:', isDisallowed);

		if (isUser == null) {
			// console.log('canAccess:', (isAdmin || isAllowed) && !isDisallowed);
			return (isAdmin || isAllowed) && !isDisallowed;
		}

		// console.log('canAccess:', (isAdmin || (isUser && isAllowed)) && !isDisallowed);
		return (isAdmin || (isUser && isAllowed)) && !isDisallowed;
	};

	return { checkAccess };
};

export default useAuthorization;
