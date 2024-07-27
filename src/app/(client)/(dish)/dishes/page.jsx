'use client';
import { LuSettings2, LuSearch } from 'react-icons/lu';
import { Breadcrumb, MegaProductFilter } from '@/components';
import DishesGrid from './DishesGrid';
import { useState, useEffect } from 'react';
import { ProductFilterDropDown } from '@/components';
import { useUser } from '@/hooks';

const sortColumns = [
	{
		key: 'name',
		name: 'Tên',
	},
	{
		key: 'price',
		name: 'Giá bán',
	},
];

const directionColumns = [
	{
		key: 'asc',
		name: 'Tăng dần',
	},
	{
		key: 'desc',
		name: 'Giảm dần',
	},
];

const ProductsGrid = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const directionSortFilterOptions = directionColumns;
	const fields = sortColumns;
	const [sortField, setSortField] = useState(fields[0].key);
	const [sortDirection, setSortDirection] = useState(directionSortFilterOptions[1].key);
	const [minPrice, setMinPrice] = useState();
	const [maxPrice, setMaxPrice] = useState();
	const [categories, setCategories] = useState([]);

	const [currentPage, setCurrentPage] = useState(0);
	const { user, isLoading } = useUser();
	const [searchInput, setSearchInput] = useState(searchQuery);

	const [filters, setFilters] = useState({
		status: 'active',
		name: searchQuery,
		minPrice: minPrice,
		maxPrice: maxPrice,
		categories: categories,
		direction: sortDirection,
		sortBy: sortField,
	});

	const handleSearchChange = (event) => {
		setSearchInput(event.target.value);
	};

	const handleSearchPress = (e) => {
		if (e.key === 'Enter') {
			setSearchQuery(searchInput);
			setFilters({
				...filters,
				name: searchInput,
				sortBy: sortField,
				direction: sortDirection,
				minPrice: minPrice,
				maxPrice: maxPrice,
				categories: categories,
			});
			setCurrentPage(0);
		}
	};

	useEffect(() => {
		setFilters({
			...filters,
			sortBy: sortField,
			direction: sortDirection,
			minPrice: minPrice,
			maxPrice: maxPrice,
			categories: categories,
		});
	}, [sortField, sortDirection, minPrice, maxPrice, categories]);
	if (isLoading) {
		return <div>Loading...</div>;
	}
	return (
		<>
			<Breadcrumb title='Dishes' subtitle='Dishes' />
			<section className='py-6 lg:py-8'>
				<div className='container'>
					<div className=''>
						<div className='gap-6 lg:flex'>
							<MegaProductFilter
								username={user.data.username || ''}
								setCategories={setCategories}
								setMaxPrice={setMaxPrice}
								setMinPrice={setMinPrice}
							/>

							<div className='relative lg:w-3/4'>
								<div className='mb-10 flex flex-wrap items-center justify-between gap-4 md:flex-nowrap'>
									<div className='hidden lg:flex'>
										<div className='relative hidden lg:flex'>
											<input
												type='search'
												className='block w-64 rounded-full border-default-200 bg-default-50 py-2.5 pe-4 ps-12 text-sm text-default-600 focus:border-primary focus:ring-primary'
												placeholder='Tìm kiếm...'
												value={searchInput}
												onChange={handleSearchChange}
												onKeyDown={handleSearchPress}
											/>
											<span className='absolute start-4 top-2.5'>
												<LuSearch size={20} className='text-default-600' />
											</span>
										</div>
									</div>
									<div className='flex flex-wrap items-center gap-4'>
										<ProductFilterDropDown
											filterOptions={fields}
											onChange={setSortField}
											filterText={'Sắp xếp'}
											value={fields[0].name}
										/>
										<ProductFilterDropDown
											filterOptions={directionSortFilterOptions}
											onChange={setSortDirection}
											filterText={'Chiều'}
											value={directionSortFilterOptions[1].name}
										/>
									</div>
								</div>
								<div>
									<DishesGrid
										filters={filters}
										currentPage={currentPage}
										setCurrentPage={setCurrentPage}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default ProductsGrid;
