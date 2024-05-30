'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';

const DialogAddress = ({ onSaveAddress, refreshAddressData }) => {
    const [open, setOpen] = useState(false);
    const { handleSubmit, control, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            // set the user to the data
            data.user = { id: 6 }; // need to change

            //Make an API call to save the address

            const response = await fetch('http://localhost:8080/address/userId=6', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
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
            <Dialog.Trigger className='rounded hover:bg-gray-200'>
                <button className='text-white shadow-blackA4 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-primary px-[10px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none'>
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='mt-8'>
                            <fieldset className='mb-[15px] flex items-center gap-5'>
                                <label className='text-violet11 w-[90px] text-right text-[15px]' htmlFor='address'>
                                    Address
                                </label>
                                <Controller
                                    name='address'
                                    control={control}
                                    defaultValue=''
                                    render={({ field }) => (
                                        <input
                                            className='text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]'
                                            id='address'
                                            {...field}
                                        />
                                    )}
                                />
                            </fieldset>
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
