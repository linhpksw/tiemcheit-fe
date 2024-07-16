'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SelectFormInput, TextAreaFormInput, TextFormInput } from '@/components';
import { useState, useEffect } from 'react';
import DialogAddress from '@/components/ui/DialogAddress';
import { useShoppingContext } from '@/context';
import { robustFetch } from '@/helpers';
import { currentCurrency } from '@/common';
import { calculatedPrice } from '@/helpers';

function findDefaultAddress(addresses) {
    return addresses.find((address) => address.isDefault).address;
}

const BillingInformation = ({ user }) => {
    const { username, addresses, fullname, email, phone } = user.data;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const { cartItems, clearCart, discount, couponCode, getCalculatedOrder } = useShoppingContext();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [addressOptions, setAddressOptions] = useState([]);
    const [defaultAddress, setDefaultAddress] = useState(findDefaultAddress(addresses));

    const fetchUserData = () => {
        const options = user.data.addresses.map((address) => ({
            value: address.address, // or whatever identifier your addresses use
            label: address.address, // or whatever display name your addresses use
        }));

        setUserData(user.data);
        const defaultAddr = user.data.addresses.find((address) => address.isDefault);
        setDefaultAddress(defaultAddr);
        setAddressOptions(options);
    };

    // Fetch user data when the component mounts
    useEffect(() => {
        if (user) fetchUserData();
    }, [user]);

    const billingFormSchema = yup.object({
        fullname: yup.string().required('Please enter your user name'),
        address: yup.string().required('Please enter your address'),
        email: yup.string().email('Please enter a valid email').required('Please enter your email'),
        phoneNo: yup.number().required('Please enter your Phone NO.'),
        message: yup.string().optional(),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(billingFormSchema),
        defaultValues: {
            fullname: fullname,
            address: defaultAddress,
            email: email,
            phoneNo: phone,
        },
    });

    const checkout = handleSubmit(async (data) => {
        try {
            const paymentData = {
                orderDate: new Date(),
                username: username,
                shippingAddress: data.address,
                shippingMethod: 'Standard',
                paymentMethod: 'Banking',
                discountPrice: discount || 0,
                message: data.message,
                totalPrice: getCalculatedOrder().orderTotal,
            };

            console.log(paymentData);

            const response = await robustFetch(
                `${BASE_URL}/payments`,
                'POST',
                'Tạo mã thanh toán thành công',
                paymentData
            );

            // console.log(response);

            router.push('/payment');

            // console.log(`${BASE_URL}/orders/add?code=${couponCode}`);

            // const response = await robustFetch(
            //     `${BASE_URL}/orders/add?code=${couponCode}`,
            //     'POST',
            //     null,
            //     orderData
            // );

            // const orderId = response.data;

            // router.push(`/${username}/orders/${orderId}`);

            // clearCart();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    return (
        <form onSubmit={checkout} className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            <div className='col-span-1 lg:col-span-2'>
                <div className='mb-8'>
                    <h4 className='mb-6 text-lg font-medium text-default-800'>Thông tin thanh toán</h4>

                    <div className='grid gap-6 lg:grid-cols-4'>
                        <TextFormInput
                            name='fullname'
                            type='text'
                            label='Họ và tên'
                            className='block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50'
                            placeholder='Nhập họ và tên của bạn'
                            containerClassName='lg:col-span-2'
                            control={control}
                        />
                        <SelectFormInput
                            name='address'
                            label='Địa chỉ nhận hàng'
                            placeholder='Chọn địa chỉ...'
                            containerClassName='lg:col-span-4'
                            control={control}
                            options={addressOptions}
                            onChange={setDefaultAddress}
                        />

                        <TextFormInput
                            name='email'
                            type='text'
                            label='Địa chỉ email'
                            className='block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50'
                            placeholder='example@example.com'
                            containerClassName='lg:col-span-2'
                            control={control}
                        />

                        <TextFormInput
                            name='phoneNo'
                            type='text'
                            label='Số điện thoại'
                            className='block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50'
                            placeholder='Nhập số điện thoại của bạn'
                            containerClassName='lg:col-span-2'
                            control={control}
                        />

                        <div className='flex items-center'>
                            <DialogAddress refreshAddressData={fetchUserData} />
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className='mb-6 text-lg font-medium text-default-800'>Thông tin thêm</h4>

                    <TextAreaFormInput
                        name='message'
                        label='Tin nhắn cho cửa hàng (nếu có)'
                        placeholder='Nhập tin nhắn của bạn'
                        control={control}
                        fullWidth
                    />
                </div>
            </div>

            <div className='mb-5'>
                <div className='rounded-lg border border-default-200 p-5'>
                    <h4 className='mb-5 text-lg font-semibold text-default-700'>Chi tiết đơn hàng</h4>

                    {cartItems.map((item) => {
                        const dish = item.dish;
                        const quantity = cartItems.find((cartItem) => cartItem.dish_id == item.dish_id)?.quantity ?? 1;
                        return (
                            dish && (
                                <div key={item.id + dish?.id} className='mb-4 flex items-center'>
                                    <Image
                                        src={dish.images[0]}
                                        height={80}
                                        width={80}
                                        className='me-2 h-20 w-20'
                                        alt={dish.name}
                                    />
                                    <div>
                                        <h4 className='mb-2 text-base font-semibold text-default-700'>{dish.name}</h4>
                                        <h4 className='text-sm text-default-600'>
                                            {quantity} x{' '}
                                            <span className='font-semibold text-primary'>
                                                {currentCurrency}
                                                {calculatedPrice(dish)}
                                            </span>
                                        </h4>
                                    </div>
                                </div>
                            )
                        );
                    })}

                    <div className='mb-6'>
                        <div className='mb-3 flex justify-between'>
                            <p className='text-sm text-default-500'>Tổng tiền hàng</p>
                            <p className='text-sm font-medium text-default-700'>
                                {currentCurrency}
                                {getCalculatedOrder().total}
                            </p>
                        </div>
                        <div className='mb-3 flex justify-between'>
                            <p className='text-sm text-default-500'>Phí vận chuyển</p>
                            <p className='text-sm font-medium text-default-700'>Miễn phí</p>
                        </div>
                        <div className='mb-3 flex justify-between'>
                            <p className='text-sm text-default-500'>Giảm giá sản phẩm</p>
                            <p className='text-sm font-medium text-default-700'>
                                -{currentCurrency}
                                {getCalculatedOrder().totalDiscount}
                            </p>
                        </div>

                        <div className='my-4 border-b border-default-200' />
                        <div className='mb-3 flex justify-between'>
                            <p className='text-base text-default-700'>Tổng thanh toán</p>
                            <p className='text-base font-medium text-default-700'>
                                {currentCurrency}
                                {getCalculatedOrder().orderTotal}
                            </p>
                        </div>
                    </div>
                    <button
                        type='submit'
                        className='inline-flex w-full items-center justify-center rounded-lg border border-primary bg-primary px-10 py-3 text-center text-lg font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-600'>
                        Đặt hàng
                    </button>
                </div>
            </div>
        </form>
    );
};

export default BillingInformation;
