'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';
import { useUser } from '@/hooks';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextFormInput } from '@/components';
import { robustFetch } from '@/helpers';

const DialogCancelOrder = ({ updateStatus, refreshAddressData }) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
	const { user } = useUser();
	const [open, setOpen] = useState(false);

	const addressFormSchema = yup.object({
		reason: yup.string().required('Please enter your reason'),
	});

	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(addressFormSchema),
	});
	const onSubmit = async (data) => {
		try {
			updateStatus(data);
			setOpen(false);
		} catch (error) {
			console.error('Error saving address:', error);
		}
	};

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild className='rounded hover:bg-gray-200'>
				<button
					type='button'
					className='px-10 rounded-lg border bg-red-500/10 py-3 text-center text-sm font-medium text-red-500 shadow-sm transition-all duration-500 hover:bg-red-500 hover:text-white'>
					Cancel Reason
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 bg-black/50' />
				<Dialog.Content className='fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-8 text-gray-900 shadow'>
					<div className='flex items-center justify-between'>
						<Dialog.Title className='text-xl'>Reason</Dialog.Title>
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
							<TextFormInput
								name='reason'
								type='text'
								label=''
								className='block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50'
								placeholder='Reason'
								control={control}
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
								Save
							</button>
						</div>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default DialogCancelOrder;
