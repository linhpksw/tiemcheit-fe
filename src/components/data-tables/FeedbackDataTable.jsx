'use client';

import { currentCurrency } from '@/common';
import Link from 'next/link';
import { cn, toSentenceCase } from '@/utils';
import TableSearchBox from './TableSearchBox';
import { DemoFilterDropdown } from '../filter';
import DateRangeFilter from './DateRangeFilter';
import GoToAddButton from './GoToAddButton';
import { updateFeedback, updateFeedbacks } from '@/helpers';
import FeedbackMessage from '@/app/[username]/(feedback)/feedbacks/FeedbackMessage';
import FeedbackDateRangeFilter from '@/app/[username]/(feedback)/feedbacks/FeedbackDateRangeFilter';

import { LuEye } from 'react-icons/lu';
import { useUser } from '@/hooks';
import { useEffect, useState } from 'react';

const sortFilterOptions = [
	'None',
	'Order Number: High to Low',
	'Order Number: Low to High',
	'Order Total: High to Low',
	'Order Total: Low to High',
	'Created Date: Latest to Oldest',
	'Created Date: Oldest to Latest',
];

const statusFilterOptions = ['All', 'Active', 'Unactive', 'Deactivated'];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const INIT_STATE = {
	rows: [],
	msg: '',
};

const CustomerDataTable = ({
	rows,
	columns,
	title,
	buttonLink,
	buttonText,
	control,
}) => {
	const { user } = useUser();
	const { username = '' } = user?.data || {};
	const [state, setState] = useState(INIT_STATE);
	const [filters, setFilters] = useState({
		status: 'All',
		sortOption: 'None',
	});
	const [selectedRows, setSelectedRows] = useState([]);
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
	};

	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			rows: rows,
			msg: 'Choose a feedback to show message',
		}));

		// if (user) fetchFilteredData(filters);
	}, [rows, user, filters]);

	// const fetchFilteredData = async (filters) => {
	// 	setLoading(true);
	// 	try {
	// 		let defaultUrl = `${BASE_URL}/admin/customers/filter`;

	// 		const params = new URLSearchParams();
	// 		if (filters.status && filters.status != 'All')
	// 			params.append('status', filters.status);
	// 		if (filters.sortOption && filters.sortOption != 'None') {
	// 			switch (true) {
	// 				case filters.sortOption.startsWith('Order Number'):
	// 					params.append('sortOption', 'order_number');
	// 					break;
	// 				case filters.sortOption.startsWith('Order Total'):
	// 					params.append('sortOption', 'order_total');
	// 					break;
	// 				case filters.sortOption.startsWith('Created Date'):
	// 					console.log('RUN');
	// 					params.append('sortOption', 'created_at');
	// 					break;
	// 			}

	// 			switch (true) {
	// 				case filters.sortOption.endsWith('High to Low'):
	// 					params.append('order', 'desc');
	// 					break;
	// 				case filters.sortOption.endsWith('Oldest to Latest'):
	// 					params.append('order', 'desc');
	// 					break;
	// 				case filters.sortOption.endsWith('Low to High'):
	// 					params.append('order', 'asc');
	// 					break;
	// 				case filters.sortOption.endsWith('Latest to Oldest'):
	// 					params.append('order', 'asc');
	// 					break;
	// 			}
	// 		}

	// 		const query = params.toString();
	// 		// console.log(query);
	// 		const fullURL = query ? `${defaultUrl}?${query}` : defaultUrl;
	// 		const response = await robustFetch(fullURL, 'GET', '', null);
	// 		// console.log(response.data);
	// 		const newCustomerData = response.data.map((customer) => {
	// 			const [date, offsetTime] = customer.createdAt.split('T');
	// 			const [time] = offsetTime.split('.');
	// 			const formattedTime = time.slice(0, 8);

	// 			return {
	// 				id: customer.id ?? 0,
	// 				name: customer.fullname,
	// 				username: customer.username,
	// 				photo: '',
	// 				contact_no: customer.phone,
	// 				email: customer.email,
	// 				location: '',
	// 				order_total: customer.orderTotal ?? 0,
	// 				orders: customer.orderNumber ?? 0,
	// 				joining_date: date,
	// 				joining_time: formattedTime,
	// 				status: customer.status,
	// 				roles: customer.roles,
	// 			};
	// 		});

	// 		setState((prevState) => ({
	// 			...prevState,
	// 			rows: newCustomerData,
	// 		}));
	// 	} catch (err) {
	// 		console.error('Error fetching customers filter:', err);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// 	// }
	// };

	const onShowClick = async (msg, id) => {
		try {
			const data = {
				id: id,
				read: true,
			};

			const response = await updateFeedback(data);
			console.log(response);

			setState((prevState) => ({
				...prevState,
				rows: prevState.rows.map((row) =>
					row.id === response.id ? { ...row, is_read: response.read } : row
				),
				msg: msg,
			}));
		} catch (error) {
			console.error('Error in updating customers:', error);
		}
	};

	const handleCheckboxChange = (id) => {
		setSelectedRows((prevSelectedRows) => {
			if (prevSelectedRows.includes(id)) {
				return prevSelectedRows.filter((rowId) => rowId !== id);
			} else {
				return [...prevSelectedRows, id];
			}
		});
	};

	const handleMarkAsRead = async (value) => {
		try {
			const data = selectedRows.map((id) => ({
				id: id,
				read: value,
			}));

			const response = await updateFeedbacks(data);
			const feedbackData = response.map((feedback) => {
				const [date, offsetTime] = feedback.sentAt.split('T');
				const [time] = offsetTime.split('.');
				const formattedTime = time.slice(0, 8);

				return {
					id: feedback.id,
					name: feedback.name,
					email: feedback.email,
					sent_date: date,
					sent_time: formattedTime,
					message: feedback.message,
					is_read: feedback.read,
				};
			});

			setState((prevState) => ({
				...prevState,
				rows: prevState.rows.map((row) => {
					const updatedRow = feedbackData.find(
						(updated) => updated.id === row.id
					);
					return updatedRow ? updatedRow : row;
				}),
			}));

			handleUnselectAll();
		} catch (error) {
			console.error('Error in updating customers:', error);
		}
	};

	const handleSelectAll = () => {
		if (!selectAllChecked) {
			const allRowIds = rows.map((row) => row.id);
			setSelectedRows(allRowIds);
		} else {
			setSelectedRows([]);
		}
		setSelectAllChecked((prev) => !prev);
	};

	const handleUnselectAll = () => {
		setSelectedRows([]);
		setSelectAllChecked(false);
	};

	return (
		<div className="rounded-lg border border-default-200">
			{/* <div className="border-b border-b-default-200 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="text-xl font-medium text-default-900">{title}</h2>

          <GoToAddButton buttonText={buttonText} buttonLink={buttonLink} />
        </div>
      </div> */}

			{/* <div className="p-6">
				<div className="flex flex-wrap items-center justify-end gap-4">
					<TableSearchBox />

					<div className="flex flex-wrap items-center gap-2">
						<DateRangeFilter />
					</div>
				</div>
			</div> */}
			<div className="relative overflow-x-auto">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-6">
					{/* <div className="inline-block min-w-full align-middle"> */}
					<div className="md:col-span-2 xl:col-span-4">
						<div className="flex flex-wrap items-center justify-end gap-4 mb-4">
							<button
								type="button"
								onClick={() => handleMarkAsRead(true)}
								className="flex items-center justify-center gap-2 rounded-lg bg-green-500/10 px-6 py-3 text-center text-sm font-semibold text-green-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
							>
								{/* <LuEraser size={20} /> */}
								<span>Đánh dấu đã đọc</span>
							</button>
							<button
								type="button"
								onClick={() => handleMarkAsRead(false)}
								className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-6 py-3 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
							>
								{/* <LuEraser size={20} /> */}
								<span>Đánh dấu chưa đọc</span>
							</button>
							<div className="flex flex-wrap items-center justify-end gap-4 mb-4">
								<FeedbackDateRangeFilter control={control} />
							</div>
							{/* <DemoFilterDropdown
								filterType="Sort"
								filterOptions={sortFilterOptions}
								onChange={(sortOption) =>
									handleFilterChange({ ...filters, sortOption })
								}
								value={filters.sortOption}
							/>
							<DemoFilterDropdown
								filterType="Filter"
								filterOptions={statusFilterOptions}
								onChange={(status) =>
									handleFilterChange({ ...filters, status })
								}
								value={filters.status}
							/> */}
						</div>
						<div className="overflow-hidden border border-default-200">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-default-200">
									<thead className="bg-default-100">
										<tr>
											<th scope="col" className="max-w-[1rem] px-6 py-4">
												<div className="flex h-5 items-center">
													<input
														id="hs-table-search-checkbox-all"
														type="checkbox"
														className="form-checkbox h-5 w-5 rounded border border-default-300 bg-transparent text-primary focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0"
														onChange={() => handleSelectAll()}
														checked={selectAllChecked}
													/>
													<label
														htmlFor="hs-table-search-checkbox-all"
														className="sr-only"
													>
														Checkbox
													</label>
												</div>
											</th>

											<th className="text-start text-sm font-medium text-default-500">
												Action
											</th>

											{columns.map((column) => (
												<th
													key={column.key}
													scope="col"
													className="whitespace-nowrap px-6 py-4 text-start text-sm font-medium text-default-500"
												>
													{column.name}
												</th>
											))}
										</tr>
									</thead>
									<tbody className="divide-y divide-default-200">
										{state.rows.map((row, idx) => {
											return (
												<tr
													key={idx}
													className={`text-left p-2 ${row['is_read'] ? 'bg-gray-200 font-normal' : 'bg-transparent font-bold'}`}
												>
													<td className="whitespace-nowrap px-6 py-4">
														<div className="flex h-5 items-center">
															<input
																id={`checkbox-${row['id']}`}
																type="checkbox"
																className="form-checkbox h-5 w-5 rounded border border-default-300 bg-transparent text-primary focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0"
																checked={selectedRows.includes(row.id)}
																onChange={() => handleCheckboxChange(row['id'])}
															/>
															<label
																htmlFor={`checkbox-${row['id']}`}
																className="sr-only"
															>
																Checkbox
															</label>
														</div>
													</td>

													<td>
														<div className="flex gap-3">
															{/* href={`/${username}/customers/${row.id}`} */}
															<Link
																href=""
																onClick={(e) => {
																	e.preventDefault();
																	onShowClick(row['message'], row['id']);
																}}
															>
																<LuEye
																	size={20}
																	className="cursor-pointer transition-colors hover:text-primary"
																/>
															</Link>
														</div>
													</td>

													{columns.map((column, idx) => {
														const tableData = row[column.key];

														if (column.key == 'sent_date') {
															return (
																<td
																	key={tableData + idx}
																	className="whitespace-nowrap px-6 py-4 text-base text-default-800"
																>
																	{tableData} |&nbsp;
																	<span className="text-xs">
																		{row['sent_time']}
																	</span>
																</td>
															);
														}
														//  else if (column.key == 'order_total') {
														// 	return (
														// 		<td
														// 			key={tableData + idx}
														// 			className="whitespace-nowrap px-6 py-4 text-base text-default-800"
														// 		>
														// 			{tableData.toLocaleString('vi-VN', {
														// 				style: 'currency',
														// 				currency: 'VND',
														// 			})}
														// 		</td>
														// 	);
														// }
														else {
															return (
																<td
																	key={tableData + idx}
																	className="whitespace-nowrap px-6 py-4 text-base text-default-800"
																>
																	{tableData}
																</td>
															);
														}
													})}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div className="md:col-span-2 xl:col-span-2">
						<FeedbackMessage msg={state.msg} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomerDataTable;
