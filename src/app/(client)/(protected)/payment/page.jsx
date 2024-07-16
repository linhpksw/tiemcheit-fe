'use client';
import { Breadcrumb } from '@/components';
import TotalPayment from './TotalPayment';
import { useUser } from '@/hooks';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { robustFetch } from '@/helpers';
import { set } from 'react-hook-form';

const PaymentDetail = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [qrImage, setQrImage] = useState('');
    const [order, setOrder] = useState(null);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (user && user.data) {
            setIsLoading(true);

            const fetchPayment = async () => {
                try {
                    const { username } = user.data;
                    const response = await robustFetch(`${BASE_URL}/payments/${username}`, 'GET');

                    setOrder(response.data);
                    setUserData(user.data);
                } catch (error) {
                    console.error('Error fetching payment details:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchPayment();
        }
    }, [user]);

    useEffect(() => {
        if (order) {
            try {
                const bankId = '970415';
                const accountNo = '105870477482';
                const template = 'UWBYaB6';
                const amount = order.totalPrice;
                const addInfo = encodeURIComponent('NDCK');
                const accountName = encodeURIComponent('LE TRONG LINH');

                const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.jpg?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
                setQrImage(qrUrl);

            } catch (error) {
                console.error('Error generating VietQR:', error);
            }
        }
    }, [order]);

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
                                <div className='flex'>
                                    <div>
                                        {qrImage &&
                                            <Image
                                                src={qrImage}
                                                alt="VietQR Code"
                                                width={400}
                                                height={400}
                                            />}
                                    </div>
                                    <div>
                                        <h4 className='text-lg font-medium text-default-800 mb-6'>Thực hiện theo hướng dẫn sau để thanh toán:</h4>

                                        <p className='text-default-600 mb-2'>Bước 1: Mở ứng dụng Mobile Banking của ngân hàng (Danh sách ngân hàng hỗ trợ)</p>

                                        <p className='text-default-600 mb-2'>Bước 2: Chọn "Thanh Toán" và quét mã QR tại hướng dẫn này</p>

                                        <p className='text-default-600 mb-2'>Bước 3: Hoàn thành các bước thanh toán theo hướng dẫn và đợi Tiệm chè IT xử lý trong giây lát</p>

                                        <p className='text-red-600 mb-2'>Lưu ý: không được thay đổi nội dung chuyển khoản đã có sẵn</p>
                                    </div>
                                </div>
                            </div>

                            <div className='md:col-span-2 xl:col-span-1'>
                                <TotalPayment
                                    subTotal={order?.totalPrice}
                                    discount={order?.discountPrice}
                                />

                                <div className='mt-6 rounded-lg border border-default-200'>
                                    <div className='border-b border-default-200 px-4 py-2'>
                                        <h4 className='text-lg font-medium text-default-800'>Địa chỉ giao hàng:</h4>
                                    </div>
                                    <div className='px-4'>
                                        <div className='flex justify-between border-b border-default-200 py-2'>
                                            <p className=' text-md text-default-600'>{order?.shippingAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-6 rounded-lg border border-default-200'>
                                    <div className='border-b border-default-200 px-4 py-2'>
                                        <h4 className='text-lg font-medium text-default-800'>Thông tin khách hàng:</h4>
                                    </div>

                                    <div className='px-4 py-2'>
                                        <h4 className='mb-1  font-medium text-default-800'>Họ và tên:</h4>
                                        <p className='mb-4 text-sm text-default-600'>{userData?.fullname}</p>
                                        <h4 className='mb-1  font-medium text-default-800'>Địa chỉ email:</h4>
                                        <p className='mb-4 text-sm text-default-600'>{userData?.email}</p>
                                        <h4 className='mb-1  font-medium text-default-800'>Số điện thoại:</h4>
                                        <p className='mb-4 text-sm text-default-600'>{userData?.phone}</p>
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
