"use client";
import { LuHome } from "react-icons/lu";
import * as Separator from '@radix-ui/react-separator';
import useAddress from "./useAddress";

const AddressForm = ({ user }) => {
    const { addresses, setDefaultAddress } = useAddress(initialAddresses);

    return (
        <div
            className="rounded-lg border border-default-200 p-6 flex flex-col gap-6"
        >
            <div className="flex justify-between">
                <div className="flex items-center">
                    <span className="text-xl font-medium text-default-900">
                        Địa chỉ giao hàng
                    </span>
                </div>


                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg bg-yellow-600 px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-yellow-700"
                >
                    <LuHome className="w-5 h-5" />
                    Thêm địa chỉ mới
                </button>
            </div>

            <Separator.Root className="bg-default-300 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px" />

            <div>
                {addresses.map((address, index) => (
                    <React.Fragment key={index}>
                        <div className="flex justify-between items-center py-4">
                            <div className='w-3/4'>
                                <span className="text-default-600">{address.address}</span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex gap-6">
                                    <Link href="#" className="text-primary-500 font-medium hover:underline">Cập nhật</Link>
                                    <Link href="#" className="text-rose-500 font-medium hover:underline">Xoá</Link>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="text-default-500 text-sm leading-none" htmlFor={`shippingAddress-${index}`}>
                                        Đặt làm địa chỉ mặc định
                                    </label>
                                    <Switch.Root
                                        className="w-[42px] h-[25px] bg-default-200 rounded-full relative data-[state=checked]:bg-primary outline-none cursor-pointer"
                                        id={`shippingAddress-${index}`}
                                        checked={address.isDefault}
                                        onCheckedChange={() => { }}
                                        style={{ '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)' }}
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
    );
};

export default AddressForm;
