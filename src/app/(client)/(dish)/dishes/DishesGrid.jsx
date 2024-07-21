'use client';

import { useState, useEffect } from 'react';
import { useFilterContext } from '@/context';
import { ProductGridCard } from '@/components';
import { getProductWithPaginationAndFilter } from '@/helpers';

const sortColumns = [
	{ key: 'name', name: 'Name' },
	{ key: 'price', name: 'Price' },
	{ key: 'quantity', name: 'Quantity' },
	{ key: 'categories', name: 'Category' },
	{ key: 'createdAt', name: 'Created At' },
];

const directionColumns = [
	{ key: 'asc', name: 'Ascending' },
	{ key: 'desc', name: 'Descending' },
];

const DishesGrid = () => {
	const { categories, maxPrice, minPrice, name, sortBy, direction } = useFilterContext();
	const directionSortFilterOptions = directionColumns;
	const fields = sortColumns;
	const [dishes, setDishes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(5);
	const [totalPages, setTotalPages] = useState(0);

	const [searchQuery, setSearchQuery] = useState('');
	const [sortField, setSortField] = useState(fields[4].key);
	const [sortDirection, setSortDirection] = useState(directionSortFilterOptions[1].key);

	const filters = {
		status: 'active',
		name: searchQuery || name,
		price: { min: minPrice, max: maxPrice },
		quantity: null,
		categories: categories.length ? categories : null,
		createdAt: null,
		direction: sortDirection,
	};

	const renderPageButtons = () => {
		const buttons = [];
		for (let i = 0; i < totalPages; i++) {
			buttons.push(
				<button
					key={i}
					onClick={() => setCurrentPage(i)}
					className={`px-4 py-2 mx-1 text-sm rounded ${i === currentPage ? 'bg-primary text-white' : 'bg-default-200'}`}>
					{i + 1}
				</button>
			);
		}
		return buttons;
	};

	useEffect(() => {
		const fetchDishes = async () => {
			try {
				setLoading(true);
				const response = await getProductWithPaginationAndFilter(currentPage, pageSize, filters);
				setDishes(response.content); // Assuming 'content' holds the products array
				setTotalPages(response.totalPages); // Assuming 'totalPages' holds the total number of pages
			} catch (error) {
				console.error('Failed to fetch dishes:', error);
				setError(error);
				setDishes([]);
			} finally {
				setLoading(false);
			}
		};

		fetchDishes();
	}, [categories, maxPrice, minPrice, name, sortBy, direction, currentPage]);

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
			{/* <div className='flex justify-center mt-4'>{renderPageButtons()}</div> */}
		</>
	);
};

export default DishesGrid;
