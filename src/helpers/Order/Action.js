import { robustFetch } from '@/helpers';

export const getOrderDetails = async (id) => {
    try {
        const baseURL = 'http://localhost:8080/order' + id;
        const response = await robustFetch(baseURL, 'GET', '', null);
        return response.data;
    } catch (error) {
        throw error;
    }
};
