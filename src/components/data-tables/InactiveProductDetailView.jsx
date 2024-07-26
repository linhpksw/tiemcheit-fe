'use client';
import Image from 'next/image';
import Link from 'next/link';
import { LuEye, LuTrash, LuPencil, LuSearch } from 'react-icons/lu';
import { currentCurrency } from '@/common';
import { ProductFilterDropDown } from '@/components/filter';
import GoToAddButton from './GoToAddButton';
import { updateProduct, deleteProduct } from '@/helpers';
import { useState, useEffect } from 'react';
import { getProductsByStatus } from '@/helpers';
import { getImagePath } from '@/utils';
import { useFilterContext } from '@/context';
import { getProductWithPaginationAndFilter } from '@/helpers';
import ConfirmModal from '../ui/ConfirmModal';

const sortColumns = [
	{
		key: 'name',
		name: 'Tên',
	},
	{
		key: 'price',
		name: 'Giá',
	},
	{
		key: 'quantity',
		name: 'Số lượng',
	},
	{
		key: 'createAt',
		name: 'Ngày tạo',
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

const InactiveProductDetailView = ({
	user,
	columns,
	title,
	buttonText,
	buttonLink,
	categoryId,
	flag,
	setFlag,
	handleOpenConfirmModal,
}) => {
	const directionSortFilterOptions = directionColumns;
	const fields = sortColumns;

	const { username } = user.data;

	const [productsData, setProductsData] = useState([]);
	// const [flag, setFlag] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(5);
	const [totalPages, setTotalPages] = useState(0);

	const [searchQuery, setSearchQuery] = useState('');
	const [sortField, setSortField] = useState(fields[3].key);
	const [sortDirection, setSortDirection] = useState(directionSortFilterOptions[1].key);

	const filters = {
		status: 'inactive',
		name: searchQuery,
		direction: sortDirection,
		sortBy: sortField,
		categories: categoryId,
	};

	useEffect(() => {
		const fetchData = async () => {
			if (searchQuery) {
				filters.name = searchQuery;
			}
			const productPage = await getProductWithPaginationAndFilter(currentPage, pageSize, filters);
			setProductsData(productPage.content);
			setTotalPages(productPage.totalPages);
		};
		fetchData();
	}, [flag, currentPage, searchQuery, sortField, sortDirection]);

	const handleStatusChange = async (product, newStatus) => {
		try {
			if (product.category.status == 'disabled') {
				handleOpenConfirmModal(`Không thể kinh doanh loại sản phẩm này!`, () => {});
			} else {
				handleOpenConfirmModal(`Bạn muốn kinh doanh sản phẩm \n ${product.name} `, async () => {
					const updatedProduct = {
						...product,
						status: newStatus,
						description: product.description || '',
					};

					await updateProduct(updatedProduct, product.id);
					setFlag(!flag);
				});
			}
		} catch (error) {
			console.error('Failed to update product status: ', error);
		}
	};

	const handleDelete = async (product) => {
		try {
			handleOpenConfirmModal(`Bạn muốn xóa sản phẩm \n ${product.name} `, async () => {
				const response = await deleteProduct(product.id);
				if (!response) {
					throw new Error('Failed to delete product');
				}
				setFlag(!flag);
			});
		} catch (error) {
			console.error('Failed to delete product: ', error);
		}
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

	const getStatusStyles = (status) => {
		switch (status) {
			case 'active':
				return { label: 'Active', bgColor: 'bg-green-500', textColor: 'text-white' };
			case 'inactive':
				return { label: 'Inactive', bgColor: 'bg-yellow-500', textColor: 'text-white' };
			case 'disabled':
				return { label: 'Disabled', bgColor: 'bg-gray-500', textColor: 'text-white' };
			default:
				return { label: 'Unknown', bgColor: 'bg-gray-500', textColor: 'text-white' };
		}
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
		setCurrentPage(0);
		console.log('searchQuery', searchQuery);
	};
	return (
		<>
			<div className='overflow-hidden px-6 py-4'>
				<div className='flex flex-wrap items-center justify-between gap-4 md:flex-nowrap'>
					<div className='flex flex-wrap items-center gap-6'>
						{/* <h2 className='text-xl font-semibold text-default-800'>{title}</h2> */}
						<div className='hidden lg:flex'>
							<div className='relative hidden lg:flex'>
								<input
									type='search'
									className='block w-64 rounded-full border-default-200 bg-default-50 py-2.5 pe-4 ps-12 text-sm text-default-600 focus:border-primary focus:ring-primary'
									placeholder='Tìm kiếm...'
									value={searchQuery}
									onChange={handleSearchChange}
								/>
								<span className='absolute start-4 top-2.5'>
									<LuSearch size={20} className='text-default-600' />
								</span>
							</div>
						</div>
					</div>
					<div className='flex flex-wrap items-center gap-4'>
						<ProductFilterDropDown
							filterOptions={fields}
							onChange={setSortField}
							filterText={'Sắp xếp'}
							value={fields[3].name}
						/>
						<ProductFilterDropDown
							filterOptions={directionSortFilterOptions}
							onChange={setSortDirection}
							filterText={'Chiều'}
							value={directionSortFilterOptions[1].name}
						/>
						<GoToAddButton buttonText={buttonText} buttonLink={buttonLink} />
					</div>
				</div>
			</div>
			<div className='relative overflow-x-auto'>
				<div className='inline-block min-w-full align-middle'>
					<div className='overflow-hidden'>
						<table className='min-w-full divide-y divide-default-200'>
							<thead className='bg-default-100'>
								<tr className='text-start'>
									{columns.map((column) => (
										<th
											key={column.key}
											className='whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800'>
											{column.name}
										</th>
									))}
									<th className='whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800'>
										Tùy chỉnh
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-default-200'>
								{productsData.length > 0 ? (
									productsData.map((row, idx) => (
										<tr
											key={row}
											className={`${
												row.status === 'disabled' ? 'bg-gray-200 line-through' : ''
											} ${row.quantity === 0 ? 'bg-red-100' : ''}`}>
											{columns.map((column) => {
												const tableData = row[column.key];
												if (column.key === 'image') {
													return (
														<td
															key={column.key}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800'>
															<div className='h-12 w-12'>
																<Image
																	src={getImagePath(row.image)}
																	height={48}
																	width={48}
																	alt={row.name}
																	className='h-full max-w-full'
																/>
															</div>
														</td>
													);
												} else if (column.key === 'name') {
													return (
														<td
															key={column.key}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800'>
															<Link
																href={`/${username}/dishes/${row.id}`}
																className='flex items-center gap-3'>
																<p
																	className={`text-base text-default-500 transition-all hover:text-primary ${
																		row.status === 'disabled' ? 'line-through' : ''
																	}`}>
																	{tableData}
																	{row.quantity === 0 && (
																		<span className='text-red-500 ml-2'>
																			(Out of Stock)
																		</span>
																	)}
																</p>
															</Link>
														</td>
													);
												} else if (column.key === 'category_name') {
													return (
														<td
															key={tableData + idx}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500'>
															{row.category.name}
														</td>
													);
												} else if (column.key === 'createAt') {
													return (
														<td
															key={tableData + idx}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500'>
															{row.createAt}
														</td>
													);
												} else if (column.key === 'status') {
													const { label, bgColor, textColor } = getStatusStyles(row.status);
													return (
														<td
															key={tableData + idx}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
															<span
																className={`px-2 py-1 rounded-full ${bgColor} ${textColor}`}>
																{label}
															</span>
														</td>
													);
												} else {
													return (
														<td
															key={tableData + idx}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500'>
															{column.key === 'price' && currentCurrency}
															{tableData}
														</td>
													);
												}
											})}
											<td className='px-6 py-4'>
												<div className='flex gap-3'>
													<button
														className='cursor-pointer transition-colors hover:text-white hover:bg-green-500 rounded px-3 py-1 text-sm font-medium text-green-500 border border-green-500'
														onClick={() => handleStatusChange(row, 'active')}>
														Publish
													</button>
													<Link href={`/${username}/edit-dish/${row.id}`}>
														<LuPencil
															size={20}
															className='cursor-pointer transition-colors hover:text-primary'
														/>
													</Link>
													<Link href={`/${username}/dishes/${row.id}`}>
														<LuEye
															size={20}
															className={`cursor-pointer transition-colors hover:text-primary ${
																row.status === 'disabled' ? 'text-primary' : ''
															}`}
														/>
													</Link>
													<LuTrash
														size={20}
														className={`cursor-pointer transition-colors hover:text-red-500 ${
															row.status === 'disabled' ? 'text-red-500' : ''
														}`}
														onClick={() => handleDelete(row)}
													/>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={columns.length + 1} className='text-center py-4 text-default-500'>
											Không có sản phẩm nào
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className='flex justify-center mt-4'>{renderPageButtons()}</div>
		</>
	);
};

export default InactiveProductDetailView;
