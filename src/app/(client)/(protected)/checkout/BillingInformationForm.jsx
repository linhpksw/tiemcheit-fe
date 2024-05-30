'use client';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LuCreditCard, LuDollarSign } from 'react-icons/lu';
import { amazonPaymentImg, paypal2PaymentImg } from '@/assets/data/images';
import { DateFormInput, SelectFormInput, TextAreaFormInput, TextFormInput } from '@/components';
import OrderSummary from './OrderSummary';
import { useState, useEffect } from 'react';
import DialogAddress from '@/components/ui/DialogAddress';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks';

const BillingInformation = () => {
    const [user, setUser] = useLocalStorage('user', null);
    const [addressOptions, setAddressOptions] = useState([]);
    const [defaultAddress, setDefaultAddress] = useState(null);

    const fetchAddressOptions = async () => {
        try {
            const response = await fetch('http://localhost:8080/address/userId=1'); // Adjust the URL to your endpoint
            const result = await response.json();
            //console.log(result);
            const options = result.data.map((address) => ({
                value: address.address, // or whatever identifier your addresses use
                label: address.address, // or whatever display name your addresses use
            }));

            const defaultAddr = result.data.find((address) => address.isDefault);
            setDefaultAddress(defaultAddr);
            //console.log(defaultAddress); //this print twice that need to be fix the logic useEffect
            setAddressOptions(options);
        } catch (error) {
            console.error('Error fetching address options:', error);
        }
    };

    // Fetch user data when the component mounts
    useEffect(() => {
        //fetchUserData();
        //fetchAddressOptions();
    }, []);
    const billingFormSchema = yup.object({
        fullname: yup.string().required('Please enter your user name'),
        //address: yup.string().required('Please enter your Address'),
        email: yup.string().email('Please enter a valid email').required('Please enter your email'),
        phoneNo: yup.number().required('Please enter your Phone NO.'),
        message: yup.string().optional(),
        paymentOption: yup.string().required('Please select a payment option'),
    });

    const onSubmit = async (data) => {
        try {
            // const orderData = {
            //     orderDate: new Date(),
            //     shippingAddress: data.address,
            //     shippingMethod: 'Standard', // Set the shipping method
            //     paymentMethod: 'Cash on Delivery',
            // };

            // // Make an HTTP POST request to your server endpoint
            // const response = await fetch('http://localhost:8080/orders/add/', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(orderData),
            // });

            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }

            // const responseData = await response.json();
            // Handle the response if needed
            toast.success('Đặt hàng thành công. Đang chuyển hướng....', {
                position: 'top-right',
                duration: 2000,
            });

            // Need to check
            // setTimeout(() => {
            //     window.location.href = '/';
            // }, 2000);

            console.log('Server response:', data);
        } catch (error) {
            // Handle errors if the request fails
            toast.error(res?.error, { position: 'top-right', duration: 2000 });
            console.error('Error:', error);
        }
    };

    const { control, handleSubmit, setValue, register } = useForm({
        resolver: yupResolver(billingFormSchema),
    });

    useEffect(() => {
        if (user) {
            setValue('fullname', user.data.username);
            setValue('email', user.data.email);
            setValue('phoneNo', user.data.phone);
            setValue('message', user.data.message);
        }
        if (defaultAddress) {
            //setValue('address', defaultAddress.address);
        }
    }, [user, defaultAddress, setValue]);

    const handleSaveAddress = async (newAddress) => {
        // Logic to handle saving the address can be placed here if needed
        console.log(newAddress);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            <div className='col-span-1 lg:col-span-2'>
                <div className='mb-8'>
                    <h4 className='mb-6 text-lg font-medium text-default-800'>Billing Information</h4>
                    <div className='grid gap-6 lg:grid-cols-4'>
                        <TextFormInput
                            name='fullname'
                            type='text'
                            label='Full Name'
                            className='block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50'
                            placeholder='Full Name'
                            containerClassName='lg:col-span-2'
                            control={control}
                        />
                        <SelectFormInput
                            name='address'
                            label='Address'
                            placeholder='Enter Your Address'
                            containerClassName='lg:col-span-4'
                            control={control}
                            options={addressOptions}
                            //defaultValue={userData.address.isDefault ? userData.address : ''}
                        />

                        <TextFormInput
                            name='email'
                            type='text'
                            label='Email'
                            className='block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50'
                            placeholder='example@example.com'
                            containerClassName='lg:col-span-2'
                            control={control}
                        />

                        <TextFormInput
                            name='phoneNo'
                            type='text'
                            label='Phone Number'
                            className='block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50'
                            placeholder='+1  123-XXX-7890'
                            containerClassName='lg:col-span-2'
                            control={control}
                        />

                        <div className='flex items-center'>
                            <DialogAddress onSaveAddress={handleSaveAddress} refreshAddressData={fetchAddressOptions} />
                            {/* <Modal>
                                <Modal.Button className='rounded p-2 hover:bg-gray-200'>
                                    Ship into different address
                                </Modal.Button>

                                <Modal.Content title='New Address'>
                                    <TextFormInput
                                        name='newadd'
                                        type='text'
                                        className='block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50'
                                        placeholder='New Address'
                                        control={control}
                                    />
                                </Modal.Content>
                            </Modal> */}
                        </div>
                    </div>
                </div>
                <div className='mb-8'>
                    <h4 className='mb-6 text-lg font-medium text-default-800'>Payment Option</h4>
                    <div className='mb-5 rounded-lg border border-default-200 p-6 lg:w-5/6'>
                        <div className='grid grid-cols-2 lg:grid-cols-2'>
                            <div className='p-6 text-center'>
                                <label htmlFor='paymentCOD' className='mb-4 flex flex-col items-center justify-center'>
                                    <LuDollarSign className='mb-4 text-primary' size={24} />
                                    <h5 className='text-sm font-medium text-default-700'>Cash on Delivery</h5>
                                </label>
                                <input
                                    id='paymentCOD'
                                    className='h-5 w-5 border-default-200 bg-transparent text-primary focus:ring-0'
                                    type='radio'
                                    name='paymentOption'
                                    value='paymentCOD'
                                    {...register('paymentOption')}
                                    defaultChecked
                                />
                            </div>

                            <div className='p-6 text-center'>
                                <label htmlFor='paymentCard' className='mb-4 flex flex-col items-center justify-center'>
                                    <LuCreditCard className='mb-4 text-primary' size={24} />
                                    <h5 className='text-sm font-medium text-default-700'>Debit/Credit Card</h5>
                                </label>
                                <input
                                    id='paymentCard'
                                    className='h-5 w-5 border-default-200 bg-transparent text-primary focus:ring-0'
                                    type='radio'
                                    value='paymentCard'
                                    {...register('paymentOption')}
                                    name='paymentOption'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className='mb-6 text-lg font-medium text-default-800'>Additional Information</h4>

                    <TextAreaFormInput
                        name='message'
                        label='Message (optional)'
                        placeholder='Notes about your order, e.g. special notes for delivery'
                        control={control}
                        fullWidth
                    />
                </div>
            </div>

            <OrderSummary />
        </form>
    );
};

export default BillingInformation;
