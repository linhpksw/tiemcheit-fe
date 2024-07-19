'use client';
import { Breadcrumb } from '@/components';
import TotalPayment from './TotalPayment';
import { useUser } from '@/hooks';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { robustFetch } from '@/helpers';

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
                const addInfo = encodeURIComponent(user.data.username);
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
                                <div className='flex gap-4'>
                                    <div className='w-full'>
                                        {qrImage &&
                                            <Image
                                                src={qrImage}
                                                alt="VietQR Code"
                                                width={400}
                                                height={400}
                                            />}
                                    </div>
                                    <div className='w-[100rem]'>
                                        <div className='mb-6'>
                                            <span className='text-lg font-medium rounded-lg bg-red-50 text-red-800 p-2'>Khách hàng thực hiện theo hướng dẫn sau để thanh toán:</span>
                                        </div>

                                        <p className='text-default-600 mb-4'>Bước 1: Mở ứng dụng Mobile Banking của ngân hàng</p>

                                        <p className='text-default-600 mb-4'>Bước 2: Chọn "Thanh Toán" và quét mã QR ở bên cạnh</p>

                                        <p className='text-default-600 mb-4'>Bước 3: Sau khi chuyển khoản thành công, vui lòng đợi trong giây lát để chúng mình xử lý đơn hàng cho bạn nhé!</p>

                                        <p className='text-red-600 mb-12'>Lưu ý: không được thay đổi nội dung chuyển khoản đã được tạo sẵn</p>

                                        <div className='mb-6'>
                                            <span className='text-lg font-medium rounded-lg bg-blue-50 text-blue-800 p-2'>Một số lỗi thường gặp trong quá trình đặt hàng</span>
                                        </div>

                                        <div class="hs-accordion-group">
                                            <div class="hs-accordion hs-accordion-active:border-gray-200 bg-white border border-transparent rounded-xl dark:hs-accordion-active:border-neutral-700 dark:bg-neutral-800 dark:border-transparent" id="hs-active-bordered-heading-one">
                                                <button class="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex justify-between items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-none dark:focus:text-neutral-400" aria-controls="hs-basic-active-bordered-collapse-one">
                                                    Khách hàng chuyển không đúng với số tiền phải thanh toán
                                                    <svg class="hs-accordion-active:hidden block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M5 12h14"></path>
                                                        <path d="M12 5v14"></path>
                                                    </svg>
                                                    <svg class="hs-accordion-active:block hidden size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M5 12h14"></path>
                                                    </svg>
                                                </button>
                                                <div id="hs-basic-active-bordered-collapse-one" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-active-bordered-heading-one">
                                                    <div class="pb-4 px-5 text-gray-800 dark:text-neutral-200">
                                                        <p class="mb-2">
                                                            - Trong trường hợp này, chúng tôi sẽ không thể hoàn tất đơn hàng của quý khách. Quý khách vui lòng chuyển lại đúng số tiền cần thanh toán.
                                                        </p>

                                                        <p class="">
                                                            - Với số tiền quý khách đã chuyển, chúng tôi sẽ thực hiện quá trình đối soát vào cuối ngày và hoàn lại về ngân hàng của quý khách.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="hs-accordion hs-accordion-active:border-gray-200 bg-white border border-transparent rounded-xl dark:hs-accordion-active:border-neutral-700 dark:bg-neutral-800 dark:border-transparent" id="hs-active-bordered-heading-two">
                                                <button class="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex justify-between items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-none dark:focus:text-neutral-400" aria-controls="hs-basic-active-bordered-collapse-two">
                                                    Nội dung chuyển khoản không hợp lệ
                                                    <svg class="hs-accordion-active:hidden block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M5 12h14"></path>
                                                        <path d="M12 5v14"></path>
                                                    </svg>
                                                    <svg class="hs-accordion-active:block hidden size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M5 12h14"></path>
                                                    </svg>
                                                </button>
                                                <div id="hs-basic-active-bordered-collapse-two" class="hs-accordion-content w-full hidden overflow-hidden transition-[height] duration-300" aria-labelledby="hs-active-bordered-heading-two">
                                                    <div class="pb-4 px-5">
                                                        <p class="text-gray-800 dark:text-neutral-200">
                                                            - Trong trường hợp này, chúng tôi sẽ không thể hoàn tất đơn hàng của quý khách. Quý khách vui lòng liên hệ với chúng tôi ở hotline 0375 830 815 để được hỗ trợ hoàn lại tiền.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

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
