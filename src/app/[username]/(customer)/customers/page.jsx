'use client';
import { BreadcrumbAdmin, CustomerDataTable } from '@/components';
import { useState, useEffect } from 'react';

//data
import { sellersData } from '@/assets/data';
import { getAllCustomers } from '@/helpers';

// export const metadata = {
//   title: "Customers List",
// };

const CustomersList = () => {
	const [customerData, setCustomerData] = useState([]);
	// const [loading, setLoading] = useState(true);

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
			key: 'orders',
			name: 'Số lần mua',
		},
		{
			key: 'order_total',
			name: 'Tổng số tiền',
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

	useEffect(() => {
		const fetchCustomerData = async () => {
			try {
				const data = await getAllCustomers();

				const customerData = data.map((customer) => {
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

				setCustomerData(customerData);
			} catch (error) {
				console.error('Error fetching customers:', error);
			}
		};

		fetchCustomerData();
	}, []);

	return (
		<div className="w-full lg:ps-64">
			<div className="page-content space-y-6 p-6">
				<BreadcrumbAdmin title="Danh sách Khách hàng" subtitle="Customers" />

				<CustomerDataTable
					rows={customerData}
					columns={columns}
					title="Customers"
					buttonText="Add a new Customer"
					buttonLink="/admin/add-customer"
				/>
			</div>
		</div>
	);
};

export default CustomersList;
