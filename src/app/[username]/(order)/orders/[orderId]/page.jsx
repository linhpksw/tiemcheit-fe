'use client';
import Link from 'next/link';
import { LuDot } from 'react-icons/lu';
import { BreadcrumbAdmin, OrderDetailsCard, OrderDetailsDataTable } from '@/components';
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

const OrderDetails = ({ params }) => {
    const { user } = useUser();
    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const fetchData = async () => {
        try {
            const baseURL = `http://localhost:8080/orders/${params.orderId}`;
            const response = await robustFetch(baseURL, 'GET', '', null);
            setOrder(response.data);
            setOrderDetails(response.data.orderDetails);
            // Calculate total price when order details are fetched
            const calculatedPrice = response.data.orderDetails.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            setTotalPrice(calculatedPrice);
        } catch (err) {
            console.error('Error fetching order details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user, refresh]); // Re-run the effect when 'id' changes

    const excludedStatuses = ['Order Confirmed', 'Order Canceled', 'Order Refunded'];

    const handleConfirmReceived = async () => {
        try {
            const response = await robustFetch(
                `http://localhost:8080/orders/${params.orderId}/confirm`,
                'PATCH',
                null,
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
            name: 'Dish',
        },
        {
            key: 'price',
            name: 'Price',
        },
        {
            key: 'quantity',
            name: 'Quantity',
        },
    ];

    if (loading) {
        return <h6 className='hidden text-base text-default-950 lg:flex'>Loading...</h6>;
    }

    return (
        <div className='w-full lg:ps-64'>
            <div className='page-content space-y-6 p-6'>
                <BreadcrumbAdmin title='Order Details' subtitle='Order' link='/admin/orders' />
                <div className='rounded-lg border border-default-200'>
                    <div className='flex flex-wrap items-center gap-3 border-b border-default-200 p-6'>
                        {order && <h4 className='text-xl font-medium text-default-900'>Order #{order.id}</h4>}
                        <div className='flex flex-wrap items-center gap-3'>
                            <LuDot />
                            <h4 className='text-sm text-default-600'>{formatISODate(order.orderDate)}</h4>
                        </div>
                        <div className='flex flex-wrap items-center gap-3'>
                            <LuDot />
                            <h4 className='text-sm text-default-600'>{order.orderDetails.length} Dishes</h4>
                        </div>
                        <div className='ms-auto'>
                            {user.data.roles[0].name === 'ADMIN' && (
                                <DropdownMenu
                                    orderId={params.orderId}
                                    orderStatus={order.orderStatus}
                                    statusOptions={orderStatus}
                                    refresh={fetchData}
                                />
                            )}
                            {order.orderStatus === 'Delivered' && user.data.roles[0].name !== 'ADMIN' && (
                                <button
                                    type='button'
                                    onClick={handleConfirmReceived}
                                    className='rounded-lg border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500'>
                                    Received Confirm
                                </button>
                            )}
                            <Link href='/admin/orders' className='ml-4 text-base font-medium text-primary'>
                                Back to List
                            </Link>
                        </div>
                    </div>
                    <div className='p-6'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                            <div className='md:col-span-2 xl:col-span-3'>
                                {excludedStatuses.includes(order.orderStatus) && <div>{order.orderStatus}</div>}
                                {!excludedStatuses.includes(order.orderStatus) && (
                                    <OrderProgress status={order.orderStatus} />
                                )}
                                <OrderDetailsDataTable columns={columns} rows={orderDetails} />
                                {order.message && (
                                    <div className='rounded-lg border border-default-200 mt-4'>
                                        <div className='border-b border-default-200 px-4 py-2'>
                                            <h4 className='text-lg font-medium text-default-800'>Note :</h4>
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
            </div>
        </div>
    );
};

export default OrderDetails;
