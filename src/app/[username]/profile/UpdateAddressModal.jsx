import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as yup from 'yup';
import { TextFormInput } from '@/components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { robustFetch } from '@/helpers';

const UpdateAddressModal = ({ user, addressId, isDefault, addressName, onUpdate }) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const { username } = user.data;

    const [open, setOpen] = useState(false);

    const addressFormSchema = yup.object({
        address: yup.string().required('Nhập địa chỉ của bạn'),
    });

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(addressFormSchema),
        defaultValues: {
            address: addressName,
        }
    });

    const update = handleSubmit(async (values) => {
        try {
            await robustFetch(
                `${BASE_URL}/${username}/addresses/${addressId}`,
                'PATCH',
                `Cập nhật địa chỉ thành công`,
                { ...values, isDefault: isDefault, type: 'address' }
            );

            onUpdate({ id: addressId, address: values.address, isDefault });
        } catch (error) {
            console.error(error);
        } finally {
            setOpen(false);
        }
    });

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button type="button" className="text-primary-500 font-medium hover:underline">
                    Cập nhật
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 fixed inset-0" />

                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-md bg-default-200 p-8 shadow-lg focus:outline-none">
                    <Dialog.Title className="text-default-700 m-0 text-xl font-medium">
                        Cập nhật địa chỉ
                    </Dialog.Title>
                    <Dialog.Description className="text-default-700 mt-[10px] mb-5 text-[15px] leading-normal">
                        Điền lại địa chỉ cụ thể của bạn vào ô bên dưới
                    </Dialog.Description>

                    <form onSubmit={update}>
                        <fieldset className="mb-[15px]">
                            <TextFormInput
                                name='address'
                                type='text'
                                label=''
                                fullWidth
                                placeholder='Nhập địa chỉ của bạn'
                                control={control}
                            />
                        </fieldset>

                        <div className="mt-[25px] flex justify-center">
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-6 py-2.5 text-center text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-600"
                            >
                                Hoàn thành
                            </button>
                        </div>
                        <Dialog.Close asChild>
                            <button
                                className="text-rose-500 absolute top-2 right-2 inline-flex h-8 w-8 appearance-none items-center justify-center rounded-full focus:outline-none"
                                aria-label="Close"
                            >
                                <Cross2Icon className='w-6 h-6' />
                            </button>
                        </Dialog.Close>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
};

export default UpdateAddressModal;