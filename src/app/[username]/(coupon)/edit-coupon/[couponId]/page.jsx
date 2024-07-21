'use client';
import { BreadcrumbAdmin } from '@/components';
import EditCouponForm from './EditCouponForm';

import { Authorization } from '@/components/security';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';
import { robustFetch } from '@/helpers';
import { useState, useEffect } from 'react';
import Error404 from '@/app/not-found';

const EditCoupon = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const { username, couponId } = useParams();
    const { user, isLoading } = useUser();
    const [loading, setLoading] = useState(true);
    const [coupon, setCoupon] = useState(null);

    const fetchCoupon = async () => {
        setLoading(true);
        try {
            const response = await robustFetch(`${BASE_URL}/coupons/${couponId}`, 'GET', null, null);
            setCoupon(response.data);
        } catch (error) {
            console.error('Error in fetching coupon detail: ', error.message);
            setError(error.message);
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
    if (coupon == null) return <Error404 />;
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
