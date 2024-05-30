import { sleep } from "@/utils";
import { calculatedPrice } from "./product";

export const getFilteredProducts = async (filter) => {
	try {
		// Define the base URL of your API endpoint
		const baseURL = "http://localhost:8080/filter";
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
		console.error("Failed to fetch filtered products:", error);
		throw error;
	}
};

// export const getAllDishes = async () => {
//   // You can fetch your products from your server here
//   await sleep(200);
//   return dishesData;
// };

// export const getAllCategories = async () => {
// 	// You can fetch data from your server here
// 	await sleep(200);
// 	return categoriesData;
// };

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

// export const getDishById = async (id) => {
// 	// You can fetch data from your server here
// 	await sleep(200);
// 	const dish = dishesData.find((dish) => dish.id == id);
// 	return dish;
// };

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
