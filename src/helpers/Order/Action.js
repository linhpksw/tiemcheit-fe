import { robustFetch } from '@/helpers';

export const getOrderDetails = async (id) => {
	try {
		const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
		const response = await robustFetch(`${BASE_URL}/order/${id}`, 'GET');
		return response.data;
	} catch (error) {
		throw error;
	}
};
