'use client';
import { useState, useEffect } from 'react';
import { robustFetch } from '@/helpers';

const useAddress = (user) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	const { username } = user.data;

	const [addresses, setAddresses] = useState(user.data.addresses || []);
	const [loading, setLoading] = useState(false);

	const handleDefaultChange = async (addressId, address) => {
		const isDefault = addresses.some((add) => add.id === addressId);

		const newAddresses = addresses
			.map((add, i) => ({
				...add,
				isDefault: add.id === addressId,
			}))
			.sort((a, b) => a.id - b.id);

		try {
			await robustFetch(
				`${BASE_URL}/${username}/addresses/${addressId}`,
				'PATCH',
				`Cập nhật địa chỉ mặc định thành công`,
				{
					address: address,
					isDefault: isDefault,
					type: 'default',
				}
			);

			setAddresses(newAddresses);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const deleteAddress = async (addressId) => {
		setLoading(true);

		try {
			await robustFetch(`${BASE_URL}/${username}/addresses/${addressId}`, 'DELETE', `Xóa địa chỉ thành công`);

			// Find if the deleted address was the default
			const addressToDelete = addresses.find((addr) => addr.id === addressId);
			const wasDefault = addressToDelete && addressToDelete.isDefault;

			// Filter out the deleted address
			let newAddresses = addresses.filter((addr) => addr.id !== addressId);

			// If the deleted address was the default, set another address as the new default
			if (wasDefault && newAddresses.length > 0) {
				newAddresses[0].isDefault = true; // Simply choose the first one for simplicity

				// Update the backend to reflect the new default address change
				await robustFetch(
					`${BASE_URL}/${username}/addresses/${newAddresses[0].id}`,
					'PATCH',
					`Cập nhật địa chỉ mặc định thành công`,
					{
						address: newAddresses[0].address,
						isDefault: true,
						type: 'default',
					}
				);
			}

			setAddresses(newAddresses);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return { addresses, handleDefaultChange, setAddresses, deleteAddress };
};

export default useAddress;
