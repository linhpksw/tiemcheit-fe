'use client';
import { BreadcrumbAdmin, CouponDataTable } from '@/components';

import { Authorization } from '@/components/security';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';
import { useState } from 'react';
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
    const [activeTab, setActiveTab] = useState('active');

    if (isLoading) {
        return <div></div>;
    }

    return (
        <Authorization allowedRoles={['ROLE_ADMIN']} username={username}>
            <div className='w-full lg:ps-64'>
                <div className='page-content space-y-6 p-6'>
                    <BreadcrumbAdmin title='Coupons List' subtitle='Coupons' />
                    <div>
                        <div className='tabs' style={{ display: 'flex', gap: '10px', marginBottom: '0px' }}>
                            <button
                                className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                                onClick={() => setActiveTab('active')}
                                style={{
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    backgroundColor: activeTab === 'active' ? '#fff' : '#f5f5f5',
                                    borderBottom: activeTab === 'active' ? 'none' : '',
                                    fontWeight: activeTab === 'active' ? 'bold' : 'normal',
                                }}>
                                Tất cả
                            </button>
                            <button
                                className={`tab ${activeTab === 'inactive' ? 'active' : ''}`}
                                onClick={() => setActiveTab('inactive')}
                                style={{
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    backgroundColor: activeTab === 'inactive' ? '#fff' : '#f5f5f5',
                                    borderBottom: activeTab === 'inactive' ? 'none' : '',
                                    fontWeight: activeTab === 'inactive' ? 'bold' : 'normal',
                                    marginLeft: '-1px', // Thêm margin âm để các nút chuyển tab nằm gần nhau hơn
                                }}>
                                Vừa được tạo
                            </button>
                        </div>

                        <div className='grid grid-cols-1'>
                            <div className='rounded-lg border border-default-200'>
                                <CouponDataTable
                                    user={user}
                                    columns={columns}
                                    //title='Coupons List'
                                    buttonLink={`/admin/add-coupon`}
                                    buttonText='Add Coupon'
                                    active={activeTab}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authorization>
    );
};

export default CouponList;
