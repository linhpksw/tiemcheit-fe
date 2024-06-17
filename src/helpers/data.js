import { sleep } from '@/utils';
import { calculatedPrice } from './product';
import { dishesData, orderHistoryData, restaurantsData, sellersData } from '@/assets/data';
import { data } from 'autoprefixer';
import { robustFetch, robustFetchWithoutAT } from '@/helpers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

//================================================CATEGORIES================================================================
export const getAllCategories = async () => {
    try {
        const response = await robustFetchWithoutAT(`${BASE_URL}/category`, 'GET');
        return response.data;
    } catch (error) {
        console.log('Error in fetching categories: ', error.message);
        throw error;
    }
};

//================================================PRODUCTS==================================================================

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
        const response = await robustFetch(`${BASE_URL}/products`, 'GET');
        return response.data;
    } catch (error) {
        console.log('Error in fetching all product: ', error.message);
        throw error;
    }
};

export const getAllProductsByCatetoryId = async (id) => {
    try {
        const response = await robustFetch(`${BASE_URL}/products/category/${id}`, 'GET');

        return response.data;
    } catch (error) {
        console.log('Error in fetching product list: ', error.message);
        throw error;
    }
};

export const getProductDetailById = async (id) => {
    try {
        const response = await robustFetch(`${BASE_URL}/products/${id}`, 'GET');
        return response.data;
    }
    catch (error) {
        console.log('Error in fetching product detail: ', error.message);
        throw error;
    }
};

// add product
export const addProduct = async (data) => {
    try {
        const response = await robustFetch(`${BASE_URL}/products`, 'POST',"", data, "accessToken");
        return response.data;
    } catch (error) {
        console.log('Error in adding product: ', error.message);
        throw error;
    }
};

// update product 
export const updateProduct = async (data,id) => {
    try {
        const response = await robustFetch(`${BASE_URL}/products/${id}`, 'PUT',"", data, "accessToken");
        return response.data;
    } catch (error) {
        console.log('Error in updating product: ', error.message);
        throw error;
    }
};

// get bestsellers
export const getBestSellerTopNth = async (top) => {
    try {
        const response = await robustFetch(`${BASE_URL}/products/top/${top}`, 'GET');
        return response.data;
    } catch (error) {
        console.log('Error in fetching bestsellers: ', error.message);
        throw error;
    }
};

//================================================INGREDIENTS==================================================================
//get all ingredients
export const getAllIngredients = async () => {
    try {
        const response = await robustFetch(`${BASE_URL}/ingredient`, 'GET');
        return response.data;
    } catch (error) {
        console.log('Error in fetching ingredients: ', error.message);
        throw error;
    }
};

//================================================OPTIONS==================================================================
//get all options
export const getAllOptions = async () => {
    try {
        const response = await robustFetch(`${BASE_URL}/option`, 'GET');
        return response.data;
    } catch (error) {
        console.log('Error in fetching options: ', error.message);
        throw error;
    }
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
