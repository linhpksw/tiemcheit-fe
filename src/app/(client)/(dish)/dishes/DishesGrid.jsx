"use client";
import { useState, useEffect } from "react";
import { useFilterContext } from "@/context";
import { ProductGridCard } from "@/components";
import { getFilteredProducts } from "@/helpers";

export const FoundResultsCount = () => {
	const { categories, maxPrice, minPrice, name, sortBy, direction } =
		useFilterContext();
	const [dishes, setDishes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDishes = async () => {
			try {
				setLoading(true);
				// Build the filter object dynamically
				const filters = {
					categories,
					maxPrice,
					minPrice,
					name,
					sortBy,
					direction,
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
	}, [categories, maxPrice, minPrice, name, sortBy, direction]);

	if (loading) {
		return (
			<h6 className="hidden text-base text-default-950 lg:flex">Loading...</h6>
		);
	}

	if (error) {
		return (
			<h6 className="hidden text-base text-default-950 lg:flex">
				Error fetching results
			</h6>
		);
	}

	return (
		<h6 className="hidden text-base text-default-950 lg:flex">
			{dishes.length} Results Found
		</h6>
	);
};

const DishesGrid = () => {
	const { categories, maxPrice, minPrice, name, sortBy, direction } =
		useFilterContext();
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
					sortBy,
					direction,
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
	}, [categories, maxPrice, minPrice, name, sortBy, direction]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error fetching dishes</p>;
	}

	return (
		<>
			{dishes.map((dish) => (
				<ProductGridCard key={dish.id} dish={dish} />
			))}
		</>
	);
};

export default DishesGrid;
