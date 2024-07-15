'use client';
import { Breadcrumb } from '@/components';
import TotalPayment from './TotalPayment';
import { useUser } from '@/hooks';
import { useEffect, useState } from 'react';
import generateVietQR from './generateVietQR';

const PaymentDetail = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const { user, isLoading } = useUser();
    const [qrImage, setQrImage] = useState('');

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

    useEffect(() => {
        if (!isLoading && order) {
            generateVietQR('105870477482', 'LE TRONG LINH', 970415, totalPrice, 'NDCK', 'text', 'UWBYaB6')
                .then(data => {
                    if (data.code === '00') {
                        setQrImage(data.data.qrDataURL); // Assuming 'data' contains a field 'qrDataURL'
                    } else {
                        console.error('Failed to generate VietQR', data.desc);
                    }
                })
                .catch(err => {
                    console.error('Error generating VietQR:', err);
                });
        }
    }, [order, isLoading]);

    if (isLoading) {
        return <div></div>;
    }

    return (
        <>
            <Breadcrumb title="Thanh toán" subtitle="Đơn hàng" />

            <section className="py-6 lg:py-10">
                <div className='rounded-lg border border-default-200'>

                    <div className='p-6'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                            <div className='md:col-span-2 xl:col-span-3'>
                                {qrImage &&
                                    <Image
                                        src={qrImage}
                                        alt="VietQR Code"
                                        width={300}
                                        height={300}
                                    />}
                            </div>

                            <div className='md:col-span-2 xl:col-span-1'>
                                <TotalPayment
                                    currentCurrency={totalPrice.toFixed(0)}
                                    discount={order.discountPrice ? order.discountPrice : 0}
                                />

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
                                <div className='rounded-lg border border-default-200'>
                                    <div className='border-b border-default-200 px-4 py-2'>
                                        <h4 className='text-lg font-medium text-default-800'>User Information :</h4>
                                    </div>

                                    <div className='px-4'>
                                        <h4 className='mb-1  font-medium text-default-800'>Name :</h4>
                                        <p className='mb-4 text-sm text-default-600'>{order.user.fullname}</p>
                                        <h4 className='mb-1  font-medium text-default-800'>Address :</h4>
                                        <p className='mb-4 text-sm text-default-600'>
                                            {order.user.addresses[0].address}
                                        </p>
                                        <h4 className='mb-1  font-medium text-default-800'>Email :</h4>
                                        <p className='mb-4 text-sm text-default-600'>{order.user.email}</p>
                                        <h4 className='mb-1  font-medium text-default-800'>Phone :</h4>
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

export default PaymentDetail;
