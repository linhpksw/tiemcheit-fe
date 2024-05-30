"use client";
import { useState, useEffect } from "react";
import { ProductListCard } from "@/components";
import { useFilterContext } from "@/context";
import { getFilteredProducts } from "@/helpers";

const DishesList = () => {
	const { categories, maxPrice, minPrice, name } = useFilterContext();
	const [dishes, setDishes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDishes = async () => {
			try {
				setLoading(true);
				const filters = {
					categories,
					maxPrice,
					minPrice,
					name,
				};

				// Remove keys with undefined or null values
				const cleanedFilters = Object.fromEntries(
					Object.entries(filters).filter(
						([_, value]) =>
							value !== undefined && value !== null && value !== ""
					)
				);
				const result = await getFilteredProducts(cleanedFilters);
				setDishes(Array.isArray(result.products) ? result.products : []);
			} catch (error) {
				console.error("Failed to fetch dishes:", error);
				setError(error);
				setDishes([]);
			} finally {
				setLoading(false);
			}
		};

		fetchDishes();
	}, [categories, maxPrice, minPrice, name]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error fetching dishes</p>;
	}

	return (
		<>
			{dishes.map((dish) => (
				<ProductListCard key={dish.id} dish={dish} />
			))}
		</>
	);
};

export default DishesList;
