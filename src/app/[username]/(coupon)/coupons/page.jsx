'use client';
import { BreadcrumbAdmin, CouponDataTable } from '@/components';

import { Authorization } from '@/components/security';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';
// export const metadata = {
//   title: "Dishes List",
// };

const columns = [
    {
        key: 'name',
        name: 'Name',
    },
    {
        key: 'code',
        name: 'Code',
    },
    {
        key: 'description',
        name: 'Description ',
    },
    {
        key: 'dateValid',
        name: 'Valid Date',
    },
    {
        key: 'dateExpired',
        name: 'Expired Date',
    },
    {
        key: 'dateUpdated',
        name: 'Updated Date',
    },
];

const CouponList = () => {
    const { username } = useParams();
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <div></div>;
    }

    return (
        <Authorization allowedRoles={['ROLE_ADMIN']} username={username}>
            <div className='w-full lg:ps-64'>
                <div className='page-content space-y-6 p-6'>
                    <BreadcrumbAdmin title='Dishes List' subtitle='Dishes' />

                    <div className='grid grid-cols-1'>
                        <div className='rounded-lg border border-default-200'>
                            <CouponDataTable
                                user={user}
                                columns={columns}
                                title='Dishes List'
                                buttonLink={`/${username}/add-dish`}
                                buttonText='Add Dish'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Authorization>
    );
};

export default CouponList;
