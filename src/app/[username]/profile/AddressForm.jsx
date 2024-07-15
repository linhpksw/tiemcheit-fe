"use client";

import * as Separator from '@radix-ui/react-separator';
import React from "react";
import Link from "next/link";
import * as Switch from '@radix-ui/react-switch';
import useAddress from "./useAddress";
import UpdateAddressModal from "./UpdateAddressModal";
import AddAddressModal from '@/app/[username]/profile/AddAddressModal';

const AddressForm = ({ user }) => {
    const { addresses, handleDefaultChange, setAddresses, deleteAddress } = useAddress(user);

    const updateAddressList = (updatedAddress) => {
        const newAddresses = addresses.map(addr =>
            addr.id === updatedAddress.id ? { ...addr, ...updatedAddress } : addr
        );
        // Replace 'setAddresses' with your state update function
        setAddresses(newAddresses);
    }

    const addAddressList = (newAddress) => {
        // Replace 'setAddresses' with your state update function
        setAddresses([...addresses, newAddress]);
    }

    return (
        <div id="tabAddress"
            role="tabpanel" className='hidden'>
            <div className="flex rounded-lg border border-default-200 p-6 flex-col gap-6">
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <span className="text-xl font-medium text-default-900">
                            Địa chỉ giao hàng
                        </span>
                    </div>

                    <AddAddressModal user={user} onAdd={addAddressList} />

                </div>

                <Separator.Root className="bg-default-300 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px" />

                <div>
                    {addresses && addresses.sort((a, b) => a.id - b.id).map((add, index) => (
                        <React.Fragment key={add.id}>
                            <div className="flex justify-between items-center py-4">
                                <div className='w-3/4'>
                                    <span className="text-default-600">{add.address}</span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-6">
                                        <UpdateAddressModal user={user} isDefault={add.isDefault} addressId={add.id} addressName={add.address} onUpdate={updateAddressList} />
                                        <button onClick={() => {
                                            if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?")) {
                                                deleteAddress(add.id);
                                            }
                                        }} className="text-rose-500 font-medium hover:underline">Xoá</button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="text-default-500 text-sm leading-none" htmlFor={`shippingAddress-${index}`}>
                                            Đặt làm địa chỉ mặc định
                                        </label>
                                        <Switch.Root
                                            className="w-[42px] h-[25px] bg-default-200 rounded-full relative data-[state=checked]:bg-primary outline-none cursor-pointer"
                                            id={`shippingAddress-${index}`}
                                            checked={add.isDefault}
                                            onCheckedChange={() => handleDefaultChange(add.id, add.address)}
                                            disabled={add.isDefault}
                                            style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)' }}
                                        >
                                            <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                                        </Switch.Root>
                                    </div>
                                </div>
                            </div>


                            {index !== addresses.length - 1 && (
                                <Separator.Root className="bg-default-300 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddressForm;