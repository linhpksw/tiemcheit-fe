'use client';
import Link from 'next/link';
import { LuDot } from 'react-icons/lu';
import { Breadcrumb, OrderDetailsCard, OrderDetailsDataTable } from '@/components';
import TotalPayment from './TotalPayment';
import OrderProgress from './OrderProgress';
import { useEffect, useState } from 'react';
import { robustFetch } from '@/helpers';
import { formatISODate } from '@/utils/format-date';
import { useUser } from '@/hooks';
import DropdownMenu from '@/components/ui/DropdownMenu';

const orderStatus = [
    'Order Received',
    'Processing',
    'Out for Delivery',
    'Delivered',
    'Order Confirmed',
    'Order Canceled',
];

const OrderDetails = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <div></div>;
    }

    const excludedStatuses = ['Order Confirmed', 'Order Canceled', 'Order Refunded'];

    const columns = [
        {
            key: 'name',
            name: 'Món',
        },
        {
            key: 'price',
            name: 'Giá',
        },
        {
            key: 'quantity',
            name: 'Số lượng',
        },
    ];

    const order = {
        id: 1,
        orderStatus: 'Order Received',
        message: 'Test message',
        shippingAddress: 'Test address',
        user: {
            fullname: 'Test user',
            email: 'Test email',
            phone: 'Test phone',
            addresses: [
                {
                    address: 'Test address',
                },
            ],
        },
    }

    const totalPrice = 1000;

    return (
        <>
            <Breadcrumb title="Đặt hàng" subtitle="Đơn hàng" />

            <section className="py-6 lg:py-10">
                <div className='rounded-lg border border-default-200'>

                    <div className='p-6'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                            <div className='md:col-span-2 xl:col-span-3'>

                                <OrderProgress />


                            </div>
                            <div className='md:col-span-2 xl:col-span-1'>
                                <TotalPayment
                                    currentCurrency={totalPrice.toFixed(0)}
                                    discount={order.discountPrice ? order.discountPrice : 0}
                                />
                                <div className='m-5'></div>
                                <div className='rounded-lg border border-default-200'>
                                    <div className='border-b border-default-200 px-4 py-2'>
                                        <h4 className='text-lg font-medium text-default-800'>Shipping Address :</h4>
                                    </div>
                                    <div className='px-4'>
                                        <div className='flex justify-between border-b border-default-200 py-2'>
                                            <p className=' text-md text-default-600'>{order.shippingAddress}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='m-5'></div>
                                <div className='rounded-lg border border-default-200'>
                                    <div className='border-b border-default-200 px-4 py-2'>
                                        <h4 className='text-lg font-medium text-default-800'>User Information :</h4>
                                    </div>
                                    <div className='px-4'>
                                        <h4 className='mb-1 text-base font-medium text-default-800'>Name :</h4>
                                        <p className='mb-4 text-sm text-default-600'>{order.user.fullname}</p>
                                        <h4 className='mb-1 text-base font-medium text-default-800'>Address :</h4>
                                        <p className='mb-4 text-sm text-default-600'>
                                            {order.user.addresses[0].address}
                                        </p>
                                        <h4 className='mb-1 text-base font-medium text-default-800'>Email :</h4>
                                        <p className='mb-4 text-sm text-default-600'>{order.user.email}</p>
                                        <h4 className='mb-1 text-base font-medium text-default-800'>Phone :</h4>
                                        <p className='mb-4 text-sm text-default-600'>{order.user.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default OrderDetails;
