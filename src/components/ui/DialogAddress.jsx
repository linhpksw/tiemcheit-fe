'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';
import { useLocalStorage } from '@/hooks';
import { getCookie } from '@/utils';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextFormInput } from '@/components';

const DialogAddress = ({ onSaveAddress, refreshAddressData }) => {
    const token = getCookie('accessToken');
    const [user, setUser] = useLocalStorage('user', null);
    const [open, setOpen] = useState(false);

    // const { updateUser } = useUserContext();

    const addressFormSchema = yup.object({
        address: yup.string().required('Please enter your address'),
    });

    const { handleSubmit, control, reset } = useForm({
        resolver: yupResolver(addressFormSchema),
    });
    const onSubmit = async (data) => {
        try {
            //console.log(data);
            const response1 = await fetch('http://localhost:8080/user/' + user.data.username + '/detail', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });
            const result = await response1.json();

            let address = { address: data.address, isDefault: false };
            result.data.addresses.push(address);

            let detailData = { addresses: result.data.addresses };

            //Make an API call to save the address

            const response2 = await fetch('http://localhost:8080/user/' + user.data.username, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(detailData),
            });

            if (!response2.ok) {
                throw new Error('Failed to save address');
            }

            onSaveAddress(data); // Optionally handle the saved address
            refreshAddressData(); // Refresh address data in the parent component
            reset();
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
                    className='text-white shadow-blackA4 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-primary px-[10px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none'>
                    Ship to different address
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 bg-black/50' />
                <Dialog.Content className='fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-8 text-gray-900 shadow'>
                    <div className='flex items-center justify-between'>
                        <Dialog.Title className='text-xl'>Add new address</Dialog.Title>
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
                                name='address'
                                type='text'
                                label=''
                                className='block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50'
                                placeholder='New Address'
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

export default DialogAddress;
