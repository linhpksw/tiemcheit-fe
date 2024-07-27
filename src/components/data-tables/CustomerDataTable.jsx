'use client';

import { currentCurrency } from '@/common';
import Link from 'next/link';
import { cn, toSentenceCase } from '@/utils';
import TableSearchBox from './TableSearchBox';
import { DemoFilterDropdown } from '../filter';
import DateRangeFilter from './DateRangeFilter';
import GoToAddButton from './GoToAddButton';
import { robustFetch } from '@/helpers';
import {
	LuEye,
	LuBan,
	LuUnlock,
	LuLock,
	LuArrowUpSquare,
} from 'react-icons/lu';
import { useUser } from '@/hooks';
import { updateCustomer, getRole } from '@/helpers';
import { useEffect, useState } from 'react';
import DialogSendCoupon from '../ui/DialogSendCoupon';
import { dictionary } from '@/utils';

const sortFilterOptions = [
	'Mặc định',
	'Số lần mua: Cao đến Thấp',
	'Số lần mua: Thấp đến Cao',
	'Tổng số tiền: Cao đến Thấp',
	'Tổng số tiền: Thấp đến Cao',
	'Ngày tạo: Gần nhất',
	'Ngày tạo: Muộn nhất',
];

const statusFilterOptions = ['Tất cả', 'Hoạt động', 'Bị khóa', 'Đã hủy'];

const INIT_STATE = {
	rows: [],
};

const CustomerDataTable = ({
	rows,
	columns,
	title,
	buttonLink,
	buttonText,
}) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	const originalData = rows;
	const { user } = useUser();
	const { username = '' } = user?.data || {};
	const [state, setState] = useState(INIT_STATE);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		status: 'Tất cả',
		sortOption: 'Mặc định',
	});
	const [selectedEmails, setSelectedEmails] = useState([]);
	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
	};

	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			rows: rows,
		}));

		if (user) fetchFilteredData(filters);
	}, [rows, user, filters]);

	const fetchFilteredData = async (filters) => {
		setLoading(true);
		try {
			let defaultUrl = `${BASE_URL}/admin/customers/filter`;

			const params = new URLSearchParams();
			if (filters.status && filters.status != 'Tất cả') {
				switch (filters.status) {
					case 'Hoạt động':
						params.append('status', 'Active');
						break;
					case 'Bị khóa':
						params.append('status', 'Inactive');
						break;
					case 'Đã hủy':
						params.append('status', 'Deactivated');
						break;
				}
			}
			if (filters.sortOption && filters.sortOption != 'Mặc định') {
				switch (true) {
					case filters.sortOption.startsWith('Số lần mua'):
						params.append('sortOption', 'order_number');
						break;
					case filters.sortOption.startsWith('Tổng số tiền'):
						params.append('sortOption', 'order_total');
						break;
					case filters.sortOption.startsWith('Ngày tạo'):
						console.log('RUN');
						params.append('sortOption', 'created_at');
						break;
				}

				switch (true) {
					case filters.sortOption.endsWith('Cao đến Thấp'):
						params.append('order', 'desc');
						break;
					case filters.sortOption.endsWith('Muộn nhất'):
						params.append('order', 'desc');
						break;
					case filters.sortOption.endsWith('Thấp đến Cao'):
						params.append('order', 'asc');
						break;
					case filters.sortOption.endsWith('Gần nhất'):
						params.append('order', 'asc');
						break;
				}
			}

			const query = params.toString();
			const fullURL = query ? `${defaultUrl}?${query}` : defaultUrl;
			const response = await robustFetch(fullURL, 'GET');
			const newCustomerData = response.data.map((customer) => {
				const [date, offsetTime] = customer.createdAt.split('T');
				const [time] = offsetTime.split('.');
				const formattedTime = time.slice(0, 8);

				return {
					id: customer.id ?? 0,
					name: customer.fullname,
					username: customer.username,
					photo: '',
					contact_no: customer.phone,
					email: customer.email,
					location: '',
					order_total: customer.orderTotal ?? 0,
					orders: customer.orderNumber ?? 0,
					joining_date: date,
					joining_time: formattedTime,
					status: customer.status,
					roles: customer.roles,
				};
			});

			setState((prevState) => ({
				...prevState,
				rows: newCustomerData,
			}));
		} catch (err) {
			console.error('Lỗi khi truy xuất thông tin khách hàng:', err);
		} finally {
			setLoading(false);
		}
	};

	const updateCustomerStatus = async (username, status, roleName) => {
		let roles = [];
		try {
			const response = await getRole(roleName);
			roles.push(response);
			console.log(roles);
		} catch (error) {
			console.error('Lỗi khi cập nhật thông tin: ', error);
		}

		const data = {
			username: username,
			updateData: {
				status: status,
				roles: roles,
			},
		};

		const userConfirmed = window.confirm(
			`Cập nhật trạng thái cho ${username} thành "${dictionary(status)}" và quyền tài khoản thành ${dictionary(roles[0].name)}?`
		);

		if (!userConfirmed) {
			return;
		}

		try {
			const response = await updateCustomer(data);

			setState((prevState) => ({
				...prevState,
				rows: prevState.rows.map((row) =>
					row.username === response.username
						? { ...row, status: response.status }
						: row
				),
			}));
		} catch (error) {
			console.error('Lỗi khi cập nhật thông tin: ', error);
		}
	};

	const handleSelectRow = (email) => {
		setSelectedEmails((prevSelectedEmails) => {
			if (prevSelectedEmails.includes(email)) {
				return prevSelectedEmails.filter((e) => e !== email);
			} else {
				return [...prevSelectedEmails, email];
			}
		});
	};

	const handleSelectAll = () => {
		if (selectedEmails.length === state.rows.length) {
			setSelectedEmails([]);
		} else {
			setSelectedEmails(state.rows.map((row) => row.email));
		}
	};
	const resetSelectedCustomer = () => {
		setSelectedEmails([]);
	};
	return (
		<div className="rounded-lg border border-default-200">
			<div className="p-6">
				<div className="flex flex-wrap items-center justify-end gap-4">
					<div className="flex flex-wrap items-center gap-2">
						<DialogSendCoupon
							selectedEmails={selectedEmails}
							resetSelected={resetSelectedCustomer}
						/>
						<DemoFilterDropdown
							filterType="Sắp xếp"
							filterOptions={sortFilterOptions}
							onChange={(sortOption) =>
								handleFilterChange({ ...filters, sortOption })
							}
							value={filters.sortOption}
						/>
						<DemoFilterDropdown
							filterType="Trạng thái"
							filterOptions={statusFilterOptions}
							onChange={(status) => handleFilterChange({ ...filters, status })}
							value={filters.status}
						/>
					</div>
				</div>
			</div>
			<div className="relative overflow-x-auto border-t border-default-200">
				<div className="inline-block min-w-full align-middle">
					<div className="overflow-hidden">
						<table className="min-w-full divide-y divide-default-200">
							<thead className="bg-default-100">
								<tr>
									<th scope="col" className="max-w-[1rem] px-6 py-4">
										<div className="flex h-5 items-center">
											<input
												id="hs-table-search-checkbox-all"
												type="checkbox"
												className="form-checkbox h-5 w-5 rounded border border-default-300 bg-transparent text-primary focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0"
												checked={selectedEmails.length === state.rows.length}
												onChange={handleSelectAll}
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
										Tác vụ
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
										<tr key={idx}>
											<td className="whitespace-nowrap px-6 py-4">
												<div className="flex h-5 items-center">
													<input
														id={`hs-table-search-checkbox-${row.email}`}
														type="checkbox"
														className="form-checkbox h-5 w-5 rounded border border-default-300 bg-transparent text-primary focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0"
														checked={selectedEmails.includes(row.email)}
														onChange={() => handleSelectRow(row.email)}
													/>
													<label
														htmlFor={`hs-table-search-checkbox-${row.email}`}
														className="sr-only"
													>
														Checkbox
													</label>
												</div>
											</td>

											<td>
												<div className="flex gap-3">
													<Link href={`/${username}/customers/${row.id}`}>
														<LuEye
															size={20}
															className="cursor-pointer transition-colors hover:text-primary"
														/>
													</Link>

													{row.status === 'ACTIVE' ? (
														<button
															onClick={() =>
																updateCustomerStatus(
																	row.username,
																	'INACTIVE',
																	row.roles[0].name
																)
															}
														>
															<LuLock
																size={20}
																className="cursor-pointer transition-colors hover:text-red-500"
															/>
														</button>
													) : (
														<button
															onClick={() =>
																updateCustomerStatus(
																	row.username,
																	'ACTIVE',
																	row.roles[0].name
																)
															}
														>
															<LuUnlock
																size={20}
																className="cursor-pointer transition-colors hover:text-primary"
															/>
														</button>
													)}

													<button
														onClick={() =>
															updateCustomerStatus(
																row.username,
																row.status,
																'EMPLOYEE'
															)
														}
													>
														<LuArrowUpSquare
															size={20}
															className="cursor-pointer transition-colors hover:text-primary"
														></LuArrowUpSquare>
													</button>
												</div>
											</td>

											{columns.map((column, idx) => {
												const tableData = row[column.key];

												if (column.key == 'joining_date') {
													return (
														<td
															key={tableData + idx}
															className="whitespace-nowrap px-6 py-4 text-base text-default-800"
														>
															{tableData} |&nbsp;
															<span className="text-xs">
																{row['joining_time']}
															</span>
														</td>
													);
												} else if (column.key == 'status') {
													const colorClassName =
														tableData == 'ACTIVE'
															? 'bg-green-500/10 text-green-500'
															: 'bg-red-500/10 text-red-500';
													return (
														<td
															key={tableData + idx}
															className="whitespace-nowrap px-6 py-4"
														>
															<span
																className={cn(
																	'rounded-md px-3 py-1 text-xs font-medium',
																	colorClassName
																)}
															>
																{dictionary(tableData).toUpperCase()}
															</span>
														</td>
													);
												} else if (column.key == 'order_total') {
													return (
														<td
															key={tableData + idx}
															className="whitespace-nowrap px-6 py-4 text-base text-default-800"
														>
															{tableData.toLocaleString('vi-VN', {
																style: 'currency',
																currency: 'VND',
															})}
														</td>
													);
												} else if (column.key == 'contact_no') {
													return (
														<td
															key={tableData + idx}
															className="whitespace-nowrap px-6 py-4 text-base text-default-800"
														>
															{tableData ? tableData : 'Không'}
														</td>
													);
												} else {
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
		</div>
	);
};

export default CustomerDataTable;
