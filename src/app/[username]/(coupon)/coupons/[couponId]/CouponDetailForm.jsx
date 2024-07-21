'use client';
import { set, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactQuill from 'react-quill';
import { LuEraser, LuPencil, LuSave } from 'react-icons/lu';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Checkbox from '@/components/Checkbox';
import { useUser } from '@/hooks';

import 'react-quill/dist/quill.snow.css';
import Datepicker from 'react-tailwindcss-datepicker';
import { robustFetch } from '@/helpers';
import { formatDateToVNTimeZone, formateVNTimeZone } from '@/utils';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const CouponDetailForm = ({ couponData }) => {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <div></div>;
    }
    const { username } = user.data;
    return (
        <div className=''>
            <form className='space-y-6'>
                <div className='rounded-lg border border-default-200 p-6'>
                    <div className='grid gap-6 lg:grid-cols-2'>
                        <div className='space-y-6'>
                            <div className='flex justify-between border-b border-default-200 py-2 gap-2'>
                                <h4 className='text-md text-default-600'>Coupon Name: </h4>
                                <h4 className='text-md font-medium text-default-800'>{couponData.name}</h4>
                            </div>
                            <div className='flex justify-between border-b border-default-200 py-2 gap-2'>
                                <h4 className='text-md text-default-600'>Coupon Code: </h4>
                                <h4 className='text-md font-medium text-default-800'>{couponData.code}</h4>
                            </div>
                            <div className='flex justify-between border-b border-default-200 py-2 gap-2'>
                                <h4 className='text-md text-default-600'>Date Valid: </h4>
                                <h4 className='text-md font-medium text-default-800'>
                                    {formateVNTimeZone(couponData.dateValid)}
                                </h4>
                            </div>
                            <div className='flex justify-between border-b border-default-200 py-2 gap-2'>
                                <h4 className='text-md text-default-600'>Date Expired: </h4>
                                <h4 className='text-md font-medium text-default-800'>
                                    {formateVNTimeZone(couponData.dateExpired)}
                                </h4>
                            </div>
                            <div className='flex justify-between border-b border-default-200 py-2 gap-2'>
                                <h4 className='text-md text-default-600 text-nowrap'>Description: </h4>
                                <p className='text-md font-medium text-default-800 text-wrap'>
                                    {couponData.description}
                                </p>
                            </div>
                            <div className='flex justify-between border-b border-default-200 py-2 gap-2'>
                                <h4 className='text-md text-default-600'>Limit Account Uses: </h4>
                                <h4 className='text-md font-medium text-default-800'>{couponData.limitAccountUses}</h4>
                            </div>
                            <div className='flex justify-between border-b border-default-200 py-2 gap-2'>
                                <h4 className='text-md text-default-600'>Limit Uses: </h4>
                                <h4 className='text-md font-medium text-default-800'>{couponData.limitUses}</h4>
                            </div>
                            <div className='flex justify-between border-b border-default-200 py-2 gap-2'>
                                <h4 className='text-md text-default-600'>Use count: </h4>
                                <h4 className='text-md font-medium text-default-800'>{couponData.useCount}</h4>
                            </div>
                        </div>
                        <div className=''>
                            <label className='mb-2 block text-xl font-medium text-default-900'>Discounts</label>

                            <div className='rounded-lg border border-default-200 p-6 mb-4'>
                                <div className='flex justify-between border-b border-default-200 py-2 gap-2'>
                                    <h4 className='text-md text-default-600'>Discount Type: </h4>
                                    <h4 className='text-md font-medium text-default-800'>
                                        {couponData.discounts[0].type}
                                    </h4>
                                </div>
                                {/* <div className='flex justify-between border-b border-default-200 py-2'>
                                        <h4 className='text-md text-default-600'>Limit Uses: </h4>
                                        <h4 className='text-md font-medium text-default-800'>{couponData.limitUses}</h4>
                                    </div> */}
                                <div className='flex justify-between border-b border-default-200 py-2 gap-2'>
                                    <h4 className='text-md text-default-600'>Value Type: </h4>
                                    <h4 className='text-md font-medium text-default-800'>
                                        {couponData.discounts[0].valueType}
                                    </h4>
                                </div>
                                <div className='flex justify-between border-b border-default-200 py-2 gap-2'>
                                    <h4 className='text-md text-default-600'>Value Fixed: </h4>
                                    <h4 className='text-md font-medium text-default-800'>
                                        {couponData.discounts[0].valueFixed}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <div className='flex flex-wrap items-center justify-end gap-4'>
                        <div className='flex flex-wrap items-center gap-4'>
                            <Link href={`/${username}/edit-coupon/${couponData.id}`}>
                                <button
                                    type='submit'
                                    className='flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500'>
                                    <LuPencil size={20} />
                                    Edit
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CouponDetailForm;
