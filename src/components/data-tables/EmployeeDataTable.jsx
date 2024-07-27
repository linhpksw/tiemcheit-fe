'use client';

import { currentCurrency } from '@/common';
import Link from 'next/link';
import { cn, toSentenceCase } from '@/utils';
import TableSearchBox from './TableSearchBox';
import { DemoFilterDropdown } from '../filter';
import DateRangeFilter from './DateRangeFilter';
import GoToAddButton from './GoToAddButton';
import { robustFetch } from '@/helpers';
import EmployeeDateRangeFilter from '@/app/[username]/(employee)/employees/EmployeeDateRangeFilter';
import {
	LuEye,
	LuBan,
	LuUnlock,
	LuLock,
	LuArrowDownSquare,
} from 'react-icons/lu';
import { useUser } from '@/hooks';
import { updateEmployee, getRole } from '@/helpers';
import { useEffect, useState } from 'react';
import { dictionary } from '@/utils';

const sortFilterOptions = [
	'Mặc định',
	'Tên: A-Z',
	'Tên: Z-A',
	'Ngày tạo: Gần nhất',
	'Ngày tạo: Muộn nhất',
];

const statusFilterOptions = ['Tất cả', 'Hoạt động', 'Bị khóa', 'Đã hủy'];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const INIT_STATE = {
	rows: [],
};

const EmployeeDataTable = ({
	rows,
	columns,
	title,
	onSortFilterChange,
	onStatusChange,
	control,
	fetchEmployee,
}) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	const { user } = useUser();
	const { username = '' } = user?.data || {};
	const [dataRows, setDataRows] = useState(rows);

	useEffect(() => {
		setDataRows(rows);
	}, [rows]);

	const updateEmployeeStatus = async (username, status, roleName) => {
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
			const response = await updateEmployee(data);

			setDataRows((prevDataRows) =>
				prevDataRows.map((row) =>
					row.username === response.username
						? { ...row, status: response.status }
						: row
				)
			);

			await fetchEmployee();
		} catch (error) {
			console.error('Lỗi khi cập nhật thông tin: ', error);
		}
	};

	return (
		<div className="rounded-lg border border-default-200">
			{/* <div className="border-b border-b-default-200 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="text-xl font-medium text-default-900">{title}</h2>

          <GoToAddButton buttonText={buttonText} buttonLink={buttonLink} />
        </div>
      </div> */}

			<div className="p-6">
				<div className="flex flex-wrap items-center justify-end gap-4">
					{/* <TableSearchBox /> */}

					<div className="flex flex-wrap items-center gap-2">
						{/* <DateRangeFilter /> */}

						<EmployeeDateRangeFilter control={control} />

						<DemoFilterDropdown
							filterType="Sắp xếp"
							filterOptions={sortFilterOptions}
							onChange={onSortFilterChange}
							value="Mặc định"
						/>
						<DemoFilterDropdown
							filterType="Trạng thái"
							filterOptions={statusFilterOptions}
							onChange={onStatusChange}
							value="Tất cả"
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
										Thao tác
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
								{dataRows.map((row, idx) => {
									return (
										<tr key={idx}>
											<td className="whitespace-nowrap px-6 py-4">
												<div className="flex h-5 items-center">
													<input
														id="hs-table-search-checkbox-1"
														type="checkbox"
														className="form-checkbox h-5 w-5 rounded border border-default-300 bg-transparent text-primary focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0"
													/>
													<label
														htmlFor="hs-table-search-checkbox-1"
														className="sr-only"
													>
														Checkbox
													</label>
												</div>
											</td>

											<td>
												<div className="flex gap-3">
													<Link href={`/${username}/employees/${row.id}`}>
														<LuEye
															size={20}
															className="cursor-pointer transition-colors hover:text-primary"
														/>
													</Link>
													{/* <LuBan
                              size={20}
                              className="cursor-pointer transition-colors hover:text-red-500"
                            /> */}

													{row.status === 'ACTIVE' ? (
														<button
															onClick={() =>
																updateEmployeeStatus(
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
																updateEmployeeStatus(
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
															updateEmployeeStatus(
																row.username,
																row.status,
																'CUSTOMER'
															)
														}
													>
														<LuArrowDownSquare
															size={20}
															className="cursor-pointer transition-colors hover:text-primary"
														></LuArrowDownSquare>
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
												} else if (column.key == 'contact_no') {
													return (
														<td
															key={tableData + idx}
															className="whitespace-nowrap px-6 py-4 text-base text-default-800"
														>
															{tableData ? tableData : 'Không'}
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
																{toSentenceCase(tableData)}
															</span>
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

export default EmployeeDataTable;
