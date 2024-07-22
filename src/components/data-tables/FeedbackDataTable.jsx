'use client';

import Link from 'next/link';
import { updateFeedback, updateFeedbacks } from '@/helpers';
import FeedbackMessage from '@/app/[username]/(feedback)/feedbacks/FeedbackMessage';
import FeedbackDateRangeFilter from '@/app/[username]/(feedback)/feedbacks/FeedbackDateRangeFilter';

import { LuEye } from 'react-icons/lu';
import { useUser } from '@/hooks';
import { useEffect, useState } from 'react';

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
	const [state, setState] = useState(INIT_STATE);
	const [filters, setFilters] = useState({
		status: 'All',
		sortOption: 'None',
	});
	const [selectedRows, setSelectedRows] = useState([]);
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			rows: rows,
			msg: 'Chọn đánh giá để xem nội dung',
		}));
	}, [rows, user, filters]);

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
			<div className="relative overflow-x-auto">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-6">
					<div className="md:col-span-2 xl:col-span-4">
						<div className="flex flex-wrap items-center justify-end gap-4 mb-4">
							<button
								type="button"
								onClick={() => handleMarkAsRead(true)}
								className="flex items-center justify-center gap-2 rounded-lg bg-green-500/10 px-6 py-3 text-center text-sm font-semibold text-green-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
							>
								<span>Đánh dấu đã đọc</span>
							</button>
							<button
								type="button"
								onClick={() => handleMarkAsRead(false)}
								className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-6 py-3 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white"
							>
								<span>Đánh dấu chưa đọc</span>
							</button>
							<div className="flex flex-wrap items-center justify-end gap-4 mb-4">
								<FeedbackDateRangeFilter control={control} />
							</div>
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

											<th className="text-start text-sm font-medium text-default-500"></th>

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
					<div className="md:col-span-2 xl:col-span-2">
						<FeedbackMessage msg={state.msg} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomerDataTable;
