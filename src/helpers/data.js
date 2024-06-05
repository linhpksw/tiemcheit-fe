import { sleep } from '@/utils';
import { calculatedPrice } from './product';
import { dishesData, orderHistoryData, restaurantsData, sellersData } from '@/assets/data';
import { data } from 'autoprefixer';
import { robustFetch } from '@/helpers';

const BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;

export const getFilteredProducts = async (filter) => {
    try {
        // Define the base URL of your API endpoint
        const baseURL = 'http://localhost:8080/filter';
        // const baseURL = "https://jsonplaceholder.typicode.com/todos";

        // Construct the query parameters string from the filter object
        const queryParams = new URLSearchParams(filter).toString();

        // Combine the base URL and query parameters
        const url = `${baseURL}?${queryParams}`;

        // Make the GET request to the API
        const response = await fetch(url);
        // const response = await fetch(baseURL);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // Parse the JSON data from the response
        const data = await response.json();

        // Return the filtered products
        // return data;

        // return {
        // 	products: data.map((product) => ({
        // 		...product,
        // 		price: calculatedPrice(product),
        // 	})),
        // 	count: data.length,
        // };
        return {
            products: data,
            count: data.length,
        };
    } catch (error) {
        // Handle any errors that occur during the fetch
        console.error('Failed to fetch filtered products:', error);
        throw error;
    }
};

export const getAllProducts = async () => {
    try {
        const response = await robustFetch(`${BASE_URL}/product/getAll`, 'GET');
        return response.data;
    } catch (error) {
        console.log('Error in fetching all product: ', error.message);
        throw error;
    }
};

export const getAllCategories = async () => {
    try {
        const response = await robustFetch(`${BASE_URL}/category/getAll`, 'GET');
        return response.data;
    } catch (error) {
        console.log('Error in fetching categories: ', error.message);
        throw error;
    }
};

export const getAllProductsByCatetoryId = async (id) => {
    try {
        const response = await robustFetch(`${BASE_URL}/product/getAllByCategory/${id}`, 'GET');

        return response.data;
    } catch (error) {
        console.log('Error in fetching product list: ', error.message);
        throw error;
    }
};

// export const getAllRestaurants = async () => {
// 	// You can fetch data from your server here
// 	await sleep(200);
// 	return restaurantsData;
// };

// export const getAllSellers = async () => {
// 	// You can fetch data from your server here
// 	await sleep(200);
// 	return sellersData;
// };

// export const getAllOrders = async () => {
// 	await sleep(200);
// 	return orderHistoryData;
// };

export const getProductDetailById = async (id) => {
    const response = await robustFetch(`${BASE_URL}/product/getDetail/${id}`, 'GET')
    return response.data;
};

// export const getCategoryById = async (id) => {
// 	// You can fetch data from your server here
// 	await sleep(200);
// 	return categoriesData.find((category) => category.id == id);
// };

// export const getRestaurantById = async (id, options = { dummyDelay: true }) => {
// 	// You can fetch data from your server here
// 	if (options.dummyDelay) {
// 		await sleep(200);
// 	}
// 	return restaurantsData.find((restaurant) => restaurant.id == id);
// };

// export const getSellerById = async (id) => {
// 	// You can fetch data from your server here
// 	await sleep(200);
// 	return sellersData.find((seller) => seller.id == id);
// };

// export const getOrderById = async (id) => {
// 	// You can fetch data from your server here
// 	await sleep(200);
// 	return orderHistoryData.find((order) => order.id == id);
// };

// export const getOrderHistoryById = async (id) => {
// 	// You can fetch data from your server here
// 	await sleep(200);
// 	return orderHistoryData.find((order) => order.id == id);
// };
