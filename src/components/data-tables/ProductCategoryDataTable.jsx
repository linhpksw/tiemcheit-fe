'use client';
import Link from 'next/link';
import { LuPencil, LuLock, LuDiff, LuPlus } from 'react-icons/lu';
import { DemoFilterDropdown } from '@/components/filter';
import { addCategory, deleteCategory, getAllCategories, updateCategory } from '@/helpers';
import { useEffect, useState } from 'react';
import AddCategoryModal from '../ui/AddCategoryModal';
import ConfirmModal from '../ui/ConfirmModal';
import { EditCategoryModal } from '..';
import { getProductByFilter } from '@/helpers';
import { formatCurrency } from '@/utils';

const formData = {
	name: '',
	status: '',
	activeProduct: 0,
	disabledProduct: 0,
	inactiveProduct: 0,
};

const filter = {
	categories: 0,
	status: '',
};

const ProductCategoryDataTable = ({ columns, title, buttonText, products }) => {
	const [categoriesData, setCategoriesData] = useState([]);

	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const [confirmTitle, setConfirmTitle] = useState('');
	const [action, setAction] = useState(() => () => {});
	const [defaultCategory, setDefaultCategory] = useState({});

	const [flag, setFlag] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const categories = await getAllCategories();
				const categoriesIds = categories.map((category) => category.id); // Extract category ids

				// Fetch products for each category status
				const activeProductsPromises = categoriesIds.map((id) =>
					getProductByFilter({ categories: id, status: 'active' })
				);
				const disabledProductsPromises = categoriesIds.map((id) =>
					getProductByFilter({ categories: id, status: 'disabled' })
				);
				const inactiveProductsPromises = categoriesIds.map((id) =>
					getProductByFilter({ categories: id, status: 'inactive' })
				);

				// Resolve all promises
				const activeProductsResults = await Promise.all(activeProductsPromises);
				const disabledProductsResults = await Promise.all(disabledProductsPromises);
				const inactiveProductsResults = await Promise.all(inactiveProductsPromises);

				// Map categories with counts
				const updatedCategories = categories.map((category, idx) => ({
					...category,
					activeProduct: activeProductsResults[idx].length,
					disabledProduct: disabledProductsResults[idx].length,
					inactiveProduct: inactiveProductsResults[idx].length,
				}));

				setCategoriesData(updatedCategories);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [flag]);

	const handleStatusChange = async (category, newStatus) => {
		try {
			const updatedCategory = {
				...category,
				status: newStatus,
			};

			await updateCategory(updatedCategory, category.id);
			setFlag(!flag);
		} catch (error) {
			console.error('Failed to update category status: ', error);
		}
	};

	//#region Handle Action
	const handleAdd = async (data) => {
		try {
			handleOpenConfirmModal('Are you sure to add the category?', async () => {
				formData.name = data.categoryName;
				formData.status = 'inactive';
				const res = await addCategory(formData);
				if (!res) {
					console.error('Failed to add category');
				}
				handleCloseAddModal();
				setFlag(!flag);
			});
		} catch (error) {
			console.error('Failed to save category: ', error);
		}
	};

	const handleDelete = async (category) => {
		try {
			const response = await deleteCategory(category.id);
			if (!response) {
				throw new Error('Failed to delete category');
			}
			setFlag(!flag);
		} catch (error) {
			console.error('Failed to delete category: ', error);
		}
	};

	const handleUpdate = async (data) => {
		try {
			handleOpenConfirmModal('Are you sure to update the category?', async () => {
				formData.name = data.categoryName;
				formData.status = defaultCategory.status;
				const res = await updateCategory(formData, defaultCategory.id);
				if (!res) {
					console.error('Failed to update category');
				}
				handleCloseEditModal();
				setFlag(!flag);
			});
		} catch (error) {
			console.error('Failed to update category: ', error);
		}
	};
	//#endregion

	//#region Handle Modal
	const handleOpenAddModal = (category) => {
		setDefaultCategory(category);
		setShowAddModal(true);
	};

	const handleCloseAddModal = () => {
		setShowAddModal(false);
	};

	const handleOpenEditModal = (category) => {
		setDefaultCategory(category);
		setShowEditModal(true);
	};

	const handleCloseEditModal = () => {
		setShowEditModal(false);
	};

	const handleOpenConfirmModal = (title, actionFunction) => {
		setConfirmTitle(title);
		setAction(() => actionFunction);
		setShowConfirmModal(true);
	};

	const handleCloseConfirmModal = () => {
		setShowConfirmModal(false);
	};
	//#endregion

	const handleConfirm = () => {
		action();
		handleCloseConfirmModal();
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

	return (
		<>
			<div className='overflow-hidden px-6 py-4'>
				<div className='flex flex-wrap items-center justify-between gap-4 md:flex-nowrap'>
					<h2 className='text-xl font-semibold text-default-800'>{title}</h2>
					<div className='flex flex-wrap items-center gap-4'>
						<button
							className='inline-flex rounded-md bg-primary px-6 py-2.5 text-sm text-white hover:bg-primary-500'
							onClick={() => handleOpenAddModal({})}>
							<LuPlus size={20} className='me-2 inline-flex align-middle' />
							{buttonText}
						</button>
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
											className='whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800 '>
											{column.name}
										</th>
									))}
									<th className='whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800'>
										Action
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-default-200'>
								{categoriesData.length === 0 ? (
									<tr>
										<td colSpan={columns.length + 1} className='text-center py-4'>
											<p className='text-sm text-gray-500'>Không có dữ liệu</p>
										</td>
									</tr>
								) : (
									categoriesData.map((row, idx) => (
										<tr key={row} className={`${row.status === 'disabled' ? 'bg-gray-200' : ''}`}>
											{columns.map((column) => {
												const tableData = row[column.key];
												if (column.key === 'name') {
													return (
														<td
															key={column.key}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800 '>
															<Link href={``} className='flex items-center gap-3'>
																<p
																	className={`text-base text-default-500 transition-all hover:text-primary`}>
																	{tableData}
																</p>
															</Link>
														</td>
													);
												} else if (column.key === 'status') {
													const { label, bgColor, textColor } = getStatusStyles(row.status);
													return (
														<td
															key={column.key}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
															<span
																className={`px-2 py-1 rounded-full ${bgColor} ${textColor}`}>
																{label}
															</span>
														</td>
													);
												} else if (column.key === 'activeProduct') {
													return (
														<td
															key={column.key}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium '>
															<span
																className={`px-2 py-1 rounded-full bg-green-500 text-white`}>
																{row.activeProduct}
															</span>
														</td>
													);
												} else if (column.key === 'disabledProduct') {
													return (
														<td
															key={column.key}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
															<span
																className={`px-2 py-1 rounded-full bg-gray-500 text-white`}>
																{row.disabledProduct}
															</span>
														</td>
													);
												} else if (column.key === 'inactiveProduct') {
													return (
														<td
															key={column.key}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
															<span
																className={`px-2 py-1 rounded-full bg-red-500 text-white`}>
																{row.inactiveProduct}
															</span>
														</td>
													);
												} else if (column.key === 'price') {
													return (
														<td
															key={tableData + idx}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500'>
															{formatCurrency(tableData)}
														</td>
													);
												} else {
													return (
														<td
															key={column.key}
															className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500'>
															{tableData}
														</td>
													);
												}
											})}
											<td className='px-6 py-4'>
												<div className='flex gap-3'>
													<LuPencil
														size={20}
														className='cursor-pointer transition-colors hover:text-primary'
														onClick={() => handleOpenEditModal(row)}
													/>
													{row.status === 'inactive' ? (
														<div className='flex gap-3'>
															<button
																className={`cursor-pointer transition-colors hover:text-white hover:bg-green-500 rounded px-3 py-1 text-sm font-medium text-green-500 border border-green-500`}
																onClick={() => {
																	handleOpenConfirmModal(
																		`Are you sure to publish category ${row.name}?`,
																		() => handleStatusChange(row, 'active')
																	);
																}}>
																Publish
															</button>
															<button
																className={`cursor-pointer transition-colors hover:text-white hover:bg-red-500 rounded px-3 py-1 text-sm font-medium text-red-500 border border-red-500`}
																onClick={() => {
																	handleOpenConfirmModal(
																		`Are you sure to delete category ${row.name}?`,
																		() => handleDelete(row)
																	);
																}}>
																Delete
															</button>
														</div>
													) : (
														<LuLock
															size={20}
															className={`cursor-pointer transition-colors hover:text-red-500  ${
																row.status === 'disabled' ? 'text-red-500' : ''
															}`}
															onClick={() =>
																handleOpenConfirmModal(
																	`Are you sure to ${row.status === 'disabled' ? 'activate' : 'disable'} category ${row.name}?`,
																	() =>
																		handleStatusChange(
																			row,
																			row.status === 'disabled'
																				? 'active'
																				: 'disabled'
																		)
																)
															}
														/>
													)}
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<AddCategoryModal show={showAddModal} handleClose={handleCloseAddModal} onSubmit={handleAdd} />
			<EditCategoryModal
				show={showEditModal}
				handleClose={handleCloseEditModal}
				onSubmit={handleUpdate}
				defaultValue={defaultCategory}
			/>
			<ConfirmModal
				show={showConfirmModal}
				handleClose={handleCloseConfirmModal}
				onConfirm={handleConfirm}
				confirmationText={confirmTitle}
			/>
		</>
	);
};

export default ProductCategoryDataTable;
