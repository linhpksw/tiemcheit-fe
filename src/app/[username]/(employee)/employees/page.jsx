'use client';
import { BreadcrumbAdmin, EmployeeDataTable } from '@/components';
import { useState, useEffect } from 'react';

//data
import { sellersData } from '@/assets/data';
import { getAllEmployees } from '@/helpers';

import * as yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// export const metadata = {
//   title: "Employees List",
// };

const start = new Date();
start.setDate(1);
start.setMonth(0); // Note: January is 0, not 1
start.setFullYear(2000);

const EmployeesList = () => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	const [sortOption, setSortOption] = useState('None');
	const [status, setStatus] = useState('All');
	const [employeeData, setEmployeeData] = useState([]);

	const dateFilterSchema = yup.object({
		filterByDateStart: yup
			.date()
			.max(new Date(), 'Ngày bắt đầu không thể ở tương lai')
			.nullable()
			.test(
				'start-before-end',
				'Ngày bắt đầu phải nằm trước ngày kết thúc',
				function (value) {
					const { filterByDateEnd } = this.parent;
					if (!value || !filterByDateEnd) {
						return true; // If one of the dates is missing, validation passes, assuming other rules handle emptiness appropriately
					}
					return (
						yup.date().isValid(value) &&
						yup.date().isValid(filterByDateEnd) &&
						value <= filterByDateEnd
					);
				}
			),

		filterByDateEnd: yup
			.date()
			.max(new Date(), 'Ngày kết thúc không thể ở tương lai')
			.nullable()
			.test(
				'end-after-start',
				'Ngày kết thúc phải nằm sau hoặc trùng với ngày bắt đầu',
				function (value) {
					const { filterByDateStart } = this.parent;
					if (!value || !filterByDateStart) {
						return true; // Validation logic is similar to above
					}
					return (
						yup.date().isValid(value) &&
						yup.date().isValid(filterByDateStart) &&
						value >= filterByDateStart
					);
				}
			),
	});

	const { control } = useForm({
		resolver: yupResolver(dateFilterSchema),
		mode: 'onChange',
		defaultValues: {
			filterByDateStart: start,
			filterByDateEnd: new Date(),
		},
	});

	const startDateValue = useWatch({ control, name: 'filterByDateStart' });
	const endDateValue = useWatch({ control, name: 'filterByDateEnd' });

	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	};

	const isValidDateRange = (startDate, endDate) => {
		if (!startDate || !endDate) return false; // Ensure both dates are present

		const start = new Date(startDate);
		const end = new Date(endDate);
		const now = new Date();

		// Check if dates are in the future
		if (start > now || end > now) {
			return false;
		}

		// Check if end date is after or on the same day as start date
		if (end < start) {
			return false;
		}

		return true;
	};

	useEffect(() => {
		if (
			startDateValue &&
			endDateValue &&
			isValidDateRange(startDateValue, endDateValue)
		) {
			async function fetchEmployee() {
				const formattedStartDate = formatDate(startDateValue);
				const formattedEndDate = formatDate(endDateValue);
				let field = '';
				let order = '';
				if (sortOption == 'Tên: A-Z') {
					field = 'name';
					order = 'asc';
				} else if (sortOption == 'Tên: Z-A') {
					field = 'name';
					order = 'desc';
				} else if (sortOption == 'Ngày tạo: Gần nhất') {
					field = 'date';
					order = 'asc';
				} else if (sortOption == 'Ngày tạo: Muộn nhất') {
					field = 'date';
					order = 'desc';
				} else {
					field = 'none';
					order = 'none';
				}
				let statusOption = '';
				if (status == 'Hoạt động') {
					statusOption = 'ACTIVE';
				} else if (status == 'Bị khóa') {
					statusOption = 'INACTIVE';
				} else if (status == 'Đã hủy') {
					statusOption = 'DEACTIVATED';
				} else {
					statusOption = 'none';
				}
				const URL = `${BASE_URL}/admin/employees?field=${field}&order=${order}&status=${statusOption}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
				console.log(URL);

				try {
					const data = await getAllEmployees(URL);

					const employeeData = data.map((employee) => {
						const [date, offsetTime] = employee.createdAt.split('T');
						const [time] = offsetTime.split('.');
						const formattedTime = time.slice(0, 8);

						return {
							id: employee.id ?? 0,
							name: employee.fullname,
							username: employee.username,
							photo: '',
							contact_no: employee.phone,
							email: employee.email,
							location: '',
							joining_date: date,
							joining_time: formattedTime,
							status: employee.status,
							roles: employee.roles,
						};
					});

					setEmployeeData(employeeData);
				} catch (error) {
					console.error('Error fetching employees:', error);
				}
			}

			fetchEmployee();
		}
	}, [sortOption, status, startDateValue, endDateValue]);

	const handleSortFilterChange = (newSortOption) => {
		setSortOption(newSortOption);
	};

	const handleStatusChange = (newStatus) => {
		setStatus(newStatus);
	};

	const columns = [
		{
			key: 'name',
			name: 'Tên',
		},
		{
			key: 'contact_no',
			name: 'Số điện thoại',
		},
		{
			key: 'email',
			name: 'Email',
		},
		{
			key: 'joining_date',
			name: 'Ngày tạo',
		},
		{
			key: 'status',
			name: 'Trạng thái',
		},
	];

	return (
		<div className="w-full lg:ps-64">
			<div className="page-content space-y-6 p-6">
				<BreadcrumbAdmin title="Employees List" subtitle="Employees" />

				<EmployeeDataTable
					rows={employeeData}
					columns={columns}
					title="Employees"
					onSortFilterChange={handleSortFilterChange}
					onStatusChange={handleStatusChange}
					control={control}
				/>
			</div>
		</div>
	);
};

export default EmployeesList;
