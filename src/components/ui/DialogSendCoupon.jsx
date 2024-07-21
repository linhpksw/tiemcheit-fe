'use client';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';
import { useUser } from '@/hooks';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SelectFormInput } from '@/components';
import { robustFetch } from '@/helpers';

const DialogSendCoupon = ({ resetSelected, selectedEmails }) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	const defaultUrl = `${BASE_URL}/coupons`;
	const { user } = useUser();
	const [open, setOpen] = useState(false);
	const [coupons, setCoupons] = useState([]);

	const fetchCoupon = async () => {
		try {
			const response = await robustFetch(defaultUrl, 'GET', '', null);
			console.log(response.data);

			setCoupons(response.data.filter((e) => e.status === 'inactive'));
		} catch (err) {
			console.error('Error fetching order details:', err);
		}
	};
	const sendCoupon = async (data) => {
		try {
			const response = await robustFetch(`${defaultUrl}/user?code=${data.Coupon}`, 'POST', null, selectedEmails);
			resetSelected();
			//console.log(`${defaultUrl}/user?code=${data}`);
		} catch (err) {
			console.error('Error fetching order details:', err);
		}
	};

	useEffect(() => {
		if (open) fetchCoupon();
	}, [open]);

	const addressFormSchema = yup.object({
		Coupon: yup.string().required('Please choose coupon'),
	});

	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(addressFormSchema),
	});
	const onSubmit = async (data) => {
		try {
			console.log(data);
			sendCoupon(data);
			setOpen(false);
		} catch (error) {
			console.error('Error saving address:', error);
		}
	};
	const couponOptions = coupons.map((coupon) => ({
		value: coupon.code,
		label: coupon.name,
	}));

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild className='rounded '>
				<button
					className={`rounded bg-blue-500 px-4 py-2 text-white text-nowrap ${
						selectedEmails.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
					}`}
					//onClick={updateOrderStatus}
					disabled={selectedEmails.length === 0}>
					Gửi mã giảm giá
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 bg-black/50' />
				<Dialog.Content className='fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-8 text-gray-900 shadow'>
					<div className='flex items-center justify-between'>
						<Dialog.Title className='text-xl'>Mã giảm giá</Dialog.Title>
						<Dialog.Close className='text-gray-400 hover:text-gray-500'>
							<button
								className='text-violet11 hover:bg-violet4 focus:shadow-violet7 inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
								aria-label='Close'>
								&times;
							</button>
						</Dialog.Close>
					</div>
					<form
						onSubmit={(e) => {
							e.stopPropagation();
							handleSubmit(onSubmit)(e);
						}}>
						<div className='mt-8'>
							<SelectFormInput
								label='Coupon:'
								name={`Coupon`}
								control={control}
								//onChange={(e) => handleDiscountChange(e, 'valueType')}
								//value={discounts.valueType}
								options={couponOptions}
							/>
						</div>

						<div className='mt-8 space-x-6 text-right'>
							<Dialog.Close asChild>
								<button
									type='button'
									className='rounded px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-600'>
									Cancel
								</button>
							</Dialog.Close>
							<button
								type='submit'
								className='rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600'>
								Send
							</button>
						</div>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default DialogSendCoupon;
