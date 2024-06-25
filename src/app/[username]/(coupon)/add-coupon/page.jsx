'use client';
import { BreadcrumbAdmin } from '@/components';
import AddCouponForm from './AddCouponForm';

import { Authorization } from '@/components/security';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';

const AddCoupon = () => {
    const { username } = useParams();
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <div></div>;
    }

    return (
        <Authorization allowedRoles={['ROLE_ADMIN']} username={username}>
            <div className='w-full lg:ps-64'>
                <div className='page-content space-y-6 p-6'>
                    <BreadcrumbAdmin title='Add Coupon' subtitle='Coupons' />
                    <div className='flex justify-center'>
                        <AddCouponForm />
                    </div>
                </div>
            </div>
        </Authorization>
    );
};

export default AddCoupon;
