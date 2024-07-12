import { sleep } from "@/utils";
import { calculatedPrice } from "./product";
import {
  dishesData,
  orderHistoryData,
  restaurantsData,
  sellersData,
} from "@/assets/data";
import { data } from "autoprefixer";
import { robustFetch, robustFetchWithoutAT } from "@/helpers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

//================================================CATEGORIES================================================================
export const getAllCategories = async () => {
  try {
    const response = await robustFetchWithoutAT(
      `${BASE_URL}/categories`,
      "GET"
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching categories: ", error.message);
    throw error;
  }
};

//================================================PRODUCTS==================================================================

export const getFilteredProducts = async (filter) => {
  try {
    // Define the base URL of your API endpoint
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const defaultUrl = `${BASE_URL}/filter`;

    // Construct the query parameters string from the filter object
    const queryParams = new URLSearchParams(filter).toString();

    // Combine the base URL and query parameters
    const url = `${defaultUrl}?${queryParams}`;

    // Make the GET request to the API
    const response = await robustFetchWithoutAT(url);
    // const response = await fetch(defaultUrl);

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

export const getAllProducts = async () => {
  try {
    const response = await robustFetch(`${BASE_URL}/products`, "GET", null);
    return response.data;
  } catch (error) {
    console.log("Error in fetching all product: ", error.message);
    throw error;
  }
};

export const getAllProductsByCatetoryId = async (id) => {
  try {
    const response = await robustFetchWithoutAT(
      `${BASE_URL}/products/category/${id}`,
      "GET",
      null
    );

    return response.data;
  } catch (error) {
    console.log("Error in fetching product list: ", error.message);
    throw error;
  }
};

export const getProductDetailByIdWithAT = async (id) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/products/${id}`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching product detail: ", error.message);
    throw error;
  }
};
export const getProductDetailByIdWithOutAT = async (id) => {
  try {
    const response = await robustFetchWithoutAT(
      `${BASE_URL}/products/${id}`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching product detail: ", error.message);
    throw error;
  }
};

// add product
export const addProduct = async (data) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/products`,
      "POST",
      "Thêm thành công",
      data
    );
    return response.data;
  } catch (error) {
    console.log("Error in adding product: ", error.message);
    throw error;
  }
};

// update product
export const updateProduct = async (data, id) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/products/${id}`,
      "PUT",
      "Cập nhật thành công",
      data
    );
    return response.data;
  } catch (error) {
    console.log("Error in updating product: ", error.message);
    throw error;
  }
};

// get bestsellers
export const getBestSellerTopNth = async (top) => {
  try {
    const response = await robustFetchWithoutAT(
      `${BASE_URL}/products/top/${top}`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching bestsellers: ", error.message);
    throw error;
  }
};

export const getPurchasedProducts = async (username) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/products/user/${username}`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching products", error.message);
    throw error;
  }
};
export const getUnavailableProducts = async () => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/products/status/unavailable`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching unavailable products", error.message);
    throw error;
  }
};

//get products by status
export const getProductsByStatus = async (status) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/products/status/${status}`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching products by status: ", error.message);
    throw error;
  }
};

//get active & disabled products
export const getActiveAndDisabledProducts = async () => {
  try {
    const response = await robustFetchWithoutAT(
      `${BASE_URL}/products/status/active-disabled`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log(
      "Error in fetching active and disabled products: ",
      error.message
    );
    throw error;
  }
};

export const getHistoryOrderedProducts = async () => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/products/ordered`,
      "GET",
      null
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error in fetching history ordered products: ", error.message);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/products/${id}`,
      "DELETE",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in deleting product: ", error.message);
    throw error;
  }
};

//================================================PAGINATION==================================================================
export const getProductWithPagination = async (page, limit) => {
  try {
    const response = await robustFetchWithoutAT(
      `${BASE_URL}/products/pagination/${page}/${limit}`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching product with pagination: ", error.message);
    throw error;
  }
};

export const getProductWithPaginationAndFilter = async (
  page,
  limit,
  filters
) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${BASE_URL}/products/pagination/${page}/${limit}/filter?${queryParams}`;
    const response = await robustFetchWithoutAT(url, "GET", null);
    return response.data;
  } catch (error) {
    console.log(
      "Lỗi khi lấy sản phẩm với phân trang và sắp xếp: ",
      error.message
    );
    throw error;
  }
};

//================================================INGREDIENTS==================================================================
//get all ingredients
export const getAllIngredients = async () => {
  try {
    const response = await robustFetchWithoutAT(
      `${BASE_URL}/ingredients`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching ingredients: ", error.message);
    throw error;
  }
};
export const updateIngredient = async (data, id) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/ingredients/${id}`,
      "PUT",
      null,
      data
    );
    return response.data;
  } catch (error) {
    console.log("Error in updating ingredient: ", error.message);
    throw error;
  }
};
export const restockIngredient = async (data, id) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/ingredients/${id}/restock`,
      "PUT",
      null,
      data
    );
    return response.data;
  } catch (error) {
    console.log("Error in restocking ingredient: ", error.message);
    throw error;
  }
};
export const addIngredient = async (data) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/ingredients`,
      "POST",
      null,
      data
    );
    return response.data;
  } catch (error) {
    console.log("Error in adding ingredient: ", error.message);
    throw error;
  }
};
export const getIngredientById = async (id) => {
  try {
    const response = await robustFetchWithoutAT(
      `${BASE_URL}/ingredients/${id}`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in adding ingredient: ", error.message);
    throw error;
  }
};

//================================================OPTIONS==================================================================
//get all options
export const getAllOptions = async () => {
  try {
    const response = await robustFetchWithoutAT(
      `${BASE_URL}/options`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching options: ", error.message);
    throw error;
  }
};

//================================================ROLES===================================================================
export const getRole = async (roleName) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/roles/${roleName}`,
      "GET",
      "",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching roles: ", error.message);
    throw error;
  }
};

//================================================ORDERS==================================================================
export const getOrdersFromCustomer = async (id) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/orders/user/${id}`,
      "GET",
      "",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching orders of the customer: ", error.message);
    throw error;
  }
};

//================================================CUSTOMERS==================================================================
export const getAllCustomers = async () => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/admin/customers`,
      "GET",
      "",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching customers: ", error.message);
    throw error;
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/admin/customers/${id}`,
      "GET",
      "",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching customers: ", error.message);
    throw error;
  }
};

export const updateCustomer = async (data) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/admin/customers`,
      "PATCH",
      "Cập nhật thành công!",
      data
    );

    return response.data;
  } catch (error) {
    console.log("Error in updating customers: ", error.message);
    throw error;
  }
};
//================================================REVIEWS==================================================================

export const getReviewsOfProduct = async (id) => {
  try {
    const response = await robustFetchWithoutAT(
      `${BASE_URL}/products/${id}/reviews`,
      "GET",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching reviews: ", error.message);
    throw error;
  }
};
export const addReview = async (id, data) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/products/${id}/reviews`,
      "POST",
      null,
      data
    );
    return response.data;
  } catch (error) {
    console.log("Error in adding review: ", error.message);
    throw error;
  }
};

//================================================EMPLOYEES==================================================================
export const getAllEmployees = async () => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/admin/employees`,
      "GET",
      "",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching customers: ", error.message);
    throw error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/admin/employees/${id}`,
      "GET",
      "",
      null
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetching customers: ", error.message);
    throw error;
  }
};

export const updateEmployee = async (data) => {
  try {
    const response = await robustFetch(
      `${BASE_URL}/admin/employees`,
      "PATCH",
      "Cập nhật thành công!",
      data
    );

    return response.data;
  } catch (error) {
    console.log("Error in updating customers: ", error.message);
    throw error;
  }
};
