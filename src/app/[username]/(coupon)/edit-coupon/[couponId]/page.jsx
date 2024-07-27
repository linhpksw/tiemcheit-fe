'use client';
import { BreadcrumbAdmin } from '@/components';
import EditCouponForm from './EditCouponForm';

import { Authorization } from '@/components/security';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';
import { robustFetch } from '@/helpers';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { error404OtherImg } from '@/assets/data';

const EditCoupon = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const { username, couponId } = useParams();
    const { user, isLoading } = useUser();
    const [loading, setLoading] = useState(true);
    const [coupon, setCoupon] = useState(null);
    const [error, setError] = useState(false);

    const fetchCoupon = async () => {
        setLoading(true);
        try {
            const response = await robustFetch(`${BASE_URL}/coupons/${couponId}`, 'GET');
            setCoupon(response.data);
        } catch (error) {
            console.error('Error in fetching coupon detail: ', error.message);
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCoupon();
    }, []);
    if (loading) {
        return <p>Loading...</p>;
    }
    if (isLoading) {
        return <div></div>;
    }
    // return error when coupon id is not exist
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
                                        Không tìm thấy mã giảm giá
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
        <Authorization allowedRoles={['ROLE_ADMIN']} username={username}>
            <div className='w-full lg:ps-64'>
                <div className='page-content space-y-6 p-6'>
                    <BreadcrumbAdmin title='Edit Coupon' subtitle='Coupons' />
                    <div className='flex justify-center'>
                        <EditCouponForm couponData={coupon} />
                    </div>
                </div>
            </div>
        </Authorization>
    );
};

export default EditCoupon;
