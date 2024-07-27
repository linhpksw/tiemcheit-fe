'use client';
import Link from 'next/link';
import { LuDot } from 'react-icons/lu';
import { BreadcrumbAdmin, OrderDetailsCard, OrderDetailsDataTable } from '@/components';
import TotalPayment from './TotalPayment';
import OrderProgress from './OrderProgress';
import { useEffect, useState } from 'react';
import { robustFetch } from '@/helpers';
import { formatVNTimeZone } from '@/utils/format-date';
import { useUser } from '@/hooks';
import DropdownMenu from '@/components/ui/DropdownMenu';
import DialogCancelOrder from '@/components/ui/DialogCancelOrder';
import Error404 from '@/app/not-found';
import { dictionary } from '@/utils';
import { error404OtherImg } from '@/assets/data/images';
import Image from 'next/image';
import { Authorization } from '@/components/security';
import { useRouter, usePathname } from 'next/navigation';
import { getCookie } from '@/helpers';

const orderStatus = [
    'Order Received',
    'Processing',
    'Out for Delivery',
    'Delivered',
    'Order Confirmed',
    'Order Canceled',
];

const OrderDetails = ({ params }) => {
    const accessToken = getCookie('accessToken');
    const router = useRouter();
    const pathname = usePathname();

    if (!accessToken) {
        const loginUrl = `/auth/login?redirectTo=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
        return;
    }

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const { user } = useUser();
    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState(false);
    const fetchData = async () => {
        try {
            const baseURL = `${BASE_URL}/orders/${params.orderId}`;
            const response = await robustFetch(baseURL, 'GET', '', null);

            setOrder(response.data);
            setOrderDetails(response.data.orderDetails);
            // Calculate total price when order details are fetched
            const calculatedPrice = response.data.orderDetails.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            setTotalPrice(calculatedPrice);

            if (user.data.roles[0].name === 'ADMIN') {
                setTimeout(function () {
                    if (response.data.orderStatus === 'Cancel Pending') {
                        alert('Lý do hủy đơn: ' + response.data.cancelReason);
                    }
                }, 500);
            }
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user, refresh]); // Re-run the effect when 'id' changes

    const excludedStatuses = ['Order Confirmed', 'Order Canceled', 'Cancel Pending'];
    const excludedStatusesStyleColor = [
        'bg-green-500/10 text-green-500',
        'bg-stone-500/10 text-stone-500',
        'bg-slate-500/10 text-slate-500',
    ];

    const handleConfirmReceived = async () => {
        const userConfirmed = window.confirm('Xác nhận đã nhận hàng?');
        if (userConfirmed) {
            try {
                const response = await robustFetch(`${BASE_URL}/orders/${params.orderId}/confirm`, 'PATCH', null, null);

                // Refresh the order details after updating the status
                setRefresh((prev) => !prev);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    const handleCancelConfirm = async () => {
        const userConfirmed = window.confirm('Xác nhận hủy hàng?');
        if (userConfirmed) {
            try {
                const response = await robustFetch(`${BASE_URL}/orders/${params.orderId}/cancel`, 'PATCH', null, null);

                // Refresh the order details after updating the status
                setRefresh((prev) => !prev);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    const handleCancelReject = async () => {
        const userConfirmed = window.confirm('Xác nhận hủy yêu cầu?');
        if (userConfirmed) {
            try {
                const response = await robustFetch(
                    `${BASE_URL}/orders/${params.orderId}/cancel-reject`,
                    'PATCH',
                    null,
                    null
                );

                // Refresh the order details after updating the status
                setRefresh((prev) => !prev);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    const handleCancelOrder = async (data) => {
        try {
            const response = await robustFetch(
                `${BASE_URL}/orders/${params.orderId}/cancel-request?reason=${data.reason}`,
                'PATCH',
                'Submit cancel request successfully',
                null
            );

            // Refresh the order details after updating the status
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const columns = [
        {
            key: 'name',
            name: 'Món chè',
        },
        {
            key: 'price',
            name: 'Giá tiền',
        },
        {
            key: 'quantity',
            name: 'Số lượng',
        },
    ];

    const colorClassName = (status) => {
        return excludedStatusesStyleColor[excludedStatuses.indexOf(status)];
    };

    if (loading) {
        return <h6 className='hidden text-base text-default-950 lg:flex'>Loading...</h6>;
    }
    // return error when order id is not exist
    if (error) {
        return (
            <div className='w-full lg:ps-64'>
                <div className='page-content flex'>
                    <div className='flex m-auto'>
                        <div className='flex items-center justify-center'>
                            <div>
                                <div className='mb-2 flex h-full w-full justify-center'>
                                    <Image
                                        src={error404OtherImg}
                                        width={225}
                                        height={225}
                                        alt='not-found-image'
                                        className=''
                                        priority
                                    />
                                </div>
                                <div className='max-w-xl text-center'>
                                    <h1 className='mb-4 text-5xl font-semibold text-default-800'>
                                        Không tìm thấy đơn hàng
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <Authorization allowedRoles={['ROLE_CUSTOMER', 'ROLE_EMPLOYEE', 'ROLE_ADMIN']} username={user.data.username}>
            <div className='w-full lg:ps-64'>
                <div className='page-content space-y-6 p-6'>
                    <BreadcrumbAdmin title='Thông tin đơn hàng' subtitle='Đơn hàng' link='/admin/orders' />
                    <div className='rounded-lg border border-default-200'>
                        <div className='flex flex-wrap items-center gap-3 border-b border-default-200 p-6'>
                            {order && <h4 className='text-xl font-medium text-default-900'>Đơn hàng #{order.id}</h4>}
                            <div className='flex flex-wrap items-center gap-3'>
                                <LuDot />
                                <h4 className='text-sm text-default-600'>{formatVNTimeZone(order.orderDate)}</h4>
                            </div>
                            <div className='flex flex-wrap items-center gap-3'>
                                <LuDot />
                                <h4 className='text-sm text-default-600'>{order.orderDetails.length} Món</h4>
                            </div>
                            <div className='ms-auto'>
                                {order.orderStatus === 'Order Received' &&
                                    !order.cancelReason &&
                                    user.data.roles[0].name === 'CUSTOMER' && (
                                        <DialogCancelOrder updateStatus={handleCancelOrder} />
                                    )}
                                {order.orderStatus === 'Order Received' &&
                                    !order.cancelReason &&
                                    user.data.roles[0].name === 'ADMIN' && (
                                        <button
                                            type='button'
                                            onClick={handleCancelConfirm}
                                            className='px-10 rounded-lg border bg-red-500/10 py-3 text-center text-sm font-medium text-red-500 shadow-sm transition-all duration-500 hover:bg-red-500 hover:text-white'>
                                            Hủy đơn hàng
                                        </button>
                                    )}
                                {order.orderStatus === 'Delivered' && (
                                    <button
                                        type='button'
                                        onClick={handleConfirmReceived}
                                        className='rounded-lg border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500'>
                                        Đã nhận hàng
                                    </button>
                                )}
                                {order.orderStatus === 'Cancel Pending' && user.data.roles[0].name === 'ADMIN' && (
                                    <div className='inline-flex gap-4'>
                                        <button
                                            type='button'
                                            onClick={handleCancelConfirm}
                                            className='rounded-lg border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500'>
                                            Xác nhận hủy đơn
                                        </button>
                                        <button
                                            type='button'
                                            onClick={handleCancelReject}
                                            className='px-10 rounded-lg border bg-red-500/10 py-3 text-center text-sm font-medium text-red-500 shadow-sm transition-all duration-500 hover:bg-red-500 hover:text-white'>
                                            Hủy yêu cầu
                                        </button>
                                    </div>
                                )}
                                <Link href='/admin/orders' className='ml-4 text-base font-medium text-primary'>
                                    Trở về
                                </Link>
                            </div>
                        </div>
                        <div className='p-6'>
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                                <div className='md:col-span-2 xl:col-span-3'>
                                    {excludedStatuses.includes(order.orderStatus) && (
                                        <div
                                            className={`${colorClassName(order.orderStatus)} rounded-md px-4 py-2 text-4xl font-semibold text-center mb-4`}>
                                            {dictionary(order.orderStatus)}
                                        </div>
                                    )}
                                    {!excludedStatuses.includes(order.orderStatus) && (
                                        <OrderProgress
                                            status={order.orderStatus}
                                            refresh={fetchData}
                                            orderId={order.id}
                                            isValid={
                                                user.data.roles[0].name === 'ADMIN' ||
                                                user.data.roles[0].name === 'EMPLOYEE'
                                            }
                                        />
                                    )}
                                    <OrderDetailsDataTable columns={columns} rows={orderDetails} />
                                    {order.message && (
                                        <div className='rounded-lg border border-default-200 mt-4'>
                                            <div className='border-b border-default-200 px-4 py-2'>
                                                <h4 className='text-lg font-medium text-default-800'>Ghi chú :</h4>
                                            </div>
                                            <div className='px-4'>
                                                <div className='flex justify-between border-b border-default-200 py-2'>
                                                    <p className=' text-md text-default-600'>{order.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className='md:col-span-2 xl:col-span-1'>
                                    <TotalPayment
                                        currentCurrency={totalPrice}
                                        discount={order.discountPrice ? order.discountPrice : 0}
                                    />
                                    <div className='m-5'></div>
                                    <div className='rounded-lg border border-default-200'>
                                        <div className='border-b border-default-200 px-4 py-2'>
                                            <h4 className='text-lg font-medium text-default-800'>
                                                Địa chỉ giao hàng :
                                            </h4>
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
                                            <h4 className='text-lg font-medium text-default-800'>
                                                Thông tin khách hàng :
                                            </h4>
                                        </div>
                                        <div className='px-4'>
                                            <h4 className='mb-1 text-base font-medium text-default-800'>Tên :</h4>
                                            <p className='mb-4 text-sm text-default-600'>{order.user.fullname}</p>
                                            <h4 className='mb-1 text-base font-medium text-default-800'>Địa chỉ :</h4>
                                            <p className='mb-4 text-sm text-default-600'>
                                                {order.user.addresses[0].address}
                                            </p>
                                            <h4 className='mb-1 text-base font-medium text-default-800'>
                                                Địa chỉ email :
                                            </h4>
                                            <p className='mb-4 text-sm text-default-600'>{order.user.email}</p>
                                            <h4 className='mb-1 text-base font-medium text-default-800'>
                                                Số điện thoại :
                                            </h4>
                                            <p className='mb-4 text-sm text-default-600'>{order.user.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authorization>
    );
};

export default OrderDetails;
