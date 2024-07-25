'use client';

import { useState, useEffect } from 'react';
import { ProductGridCard } from '@/components';
import { getProductWithPaginationAndFilter } from '@/helpers';

const DishesGrid = ({ filters, currentPage, setCurrentPage }) => {
	const [dishes, setDishes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pageSize, setPageSize] = useState(9);
	const [totalPages, setTotalPages] = useState(0);

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
				console.log(filters);
				setLoading(true);
				const response = await getProductWithPaginationAndFilter(currentPage, pageSize, filters);
				setDishes(response.content);
				setTotalPages(response.totalPages);
			} catch (error) {
				console.error('Failed to fetch dishes:', error);
				setError(error);
				setDishes([]);
			} finally {
				setLoading(false);
			}
		};

		fetchDishes();
	}, [filters, currentPage]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error fetching dishes</p>;
	}

	return (
		<div className='flex flex-col min-h-screen'>
			{dishes.length > 0 ? (
				<>
					<div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>
						{dishes.map((dish) => (
							<ProductGridCard key={dish.id} dish={dish} />
						))}
					</div>
					<div className='flex justify-center mt-4'>{renderPageButtons()}</div>
				</>
			) : (
				<div className='text-center py-4 text-default-500'>Không có sản phẩm nào</div>
			)}
		</div>
	);
};

export default DishesGrid;
