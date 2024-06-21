'use client';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { TextFormInput } from '@/components';
import { useShoppingContext } from '@/context';
import { robustFetch } from '@/helpers';
import { useRouter } from 'next/navigation';

const CouponCodeForm = () => {
    const { cartItems, applyCoupon, removeCoupon } = useShoppingContext();
    const router = useRouter();

    const contactFormSchema = yup.object({
        couponCode: yup.string().required('Please enter your coupon code'),
    });

    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(contactFormSchema),
    });
    const onSubmit = async (data) => {
        try {
            console.log(data);
            await applyCoupon(data.couponCode);
            router.refresh();
        } catch (error) {}
    };
    const removeDiscount = () => {
        reset();
        removeCoupon();
    };
    return (
        <div className='rounded-lg border border-default-200'>
            <div className='border-b border-default-200 px-6 py-5'>
                <h4 className='text-lg font-semibold text-default-800'>Mã giảm giá</h4>
            </div>
            <div className='p-6'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextFormInput
                        name='couponCode'
                        className='block bg-transparent outline-none'
                        placeholder='Nhập mã giảm giá'
                        control={control}
                        fullWidth
                    />
                    <div className='mt-4 flex justify-end gap-4'>
                        <button
                            type='submit'
                            className='inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500'>
                            Áp dụng
                        </button>

                        <button
                            type='button'
                            onClick={removeDiscount}
                            className='inline-flex items-center justify-center rounded-lg border hover:bg-red-500 hover:text-white bg-red-500/10 px-6 py-3 text-center text-sm font-medium text-red-500 shadow-sm transition-all duration-500'>
                            Remove
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CouponCodeForm;
