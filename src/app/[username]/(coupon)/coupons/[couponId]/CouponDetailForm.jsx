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
import { formatDateToVNTimeZone, formatVNTimeZone } from '@/utils';
import { dictionary } from '@/utils';

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
								<h4 className='text-md text-default-600'>Tên mã giảm giá: </h4>
								<h4 className='text-md font-medium text-default-800'>{couponData.name}</h4>
							</div>
							<div className='flex justify-between border-b border-default-200 py-2 gap-2'>
								<h4 className='text-md text-default-600'>Mã Code: </h4>
								<h4 className='text-md font-medium text-default-800'>{couponData.code}</h4>
							</div>
							<div className='flex justify-between border-b border-default-200 py-2 gap-2'>
								<h4 className='text-md text-default-600'>Ngày hợp lệ: </h4>
								<h4 className='text-md font-medium text-default-800'>
									{formatVNTimeZone(couponData.dateValid)}
								</h4>
							</div>
							<div className='flex justify-between border-b border-default-200 py-2 gap-2'>
								<h4 className='text-md text-default-600'>Ngày hết hạn: </h4>
								<h4 className='text-md font-medium text-default-800'>
									{formatVNTimeZone(couponData.dateExpired)}
								</h4>
							</div>
							<div className='flex justify-between border-b border-default-200 py-2 gap-2'>
								<h4 className='text-md text-default-600 text-nowrap'>Thông tin mã giảm giá: </h4>
								<p className='text-md font-medium text-default-800 text-wrap'>
									{couponData.description}
								</p>
							</div>
							<div className='flex justify-between border-b border-default-200 py-2 gap-2'>
								<h4 className='text-md text-default-600'>Giới hạn sử dụng của 1 tài khoản: </h4>
								<h4 className='text-md font-medium text-default-800'>{couponData.limitAccountUses}</h4>
							</div>
							<div className='flex justify-between border-b border-default-200 py-2 gap-2'>
								<h4 className='text-md text-default-600'>Giới hạn sử dụng: </h4>
								<h4 className='text-md font-medium text-default-800'>{couponData.limitUses}</h4>
							</div>
							<div className='flex justify-between border-b border-default-200 py-2 gap-2'>
								<h4 className='text-md text-default-600'>Số lượng đã sử dụng: </h4>
								<h4 className='text-md font-medium text-default-800'>{couponData.useCount}</h4>
							</div>
						</div>
						<div className=''>
							<label className='mb-2 block text-xl font-medium text-default-900'>Giảm giá</label>

							<div className='rounded-lg border border-default-200 p-6 mb-4'>
								<div className='flex justify-between border-b border-default-200 py-2 gap-2'>
									<h4 className='text-md text-default-600'>Loại giảm giá: </h4>
									<h4 className='text-md font-medium text-default-800'>
										{couponData.discounts[0].type}
									</h4>
								</div>
								{/* <div className='flex justify-between border-b border-default-200 py-2'>
                                        <h4 className='text-md text-default-600'>Limit Uses: </h4>
                                        <h4 className='text-md font-medium text-default-800'>{couponData.limitUses}</h4>
                                    </div> */}
								<div className='flex justify-between border-b border-default-200 py-2 gap-2'>
									<h4 className='text-md text-default-600'>Đơn vị giảm giá: </h4>
									<h4 className='text-md font-medium text-default-800'>
										{couponData.discounts[0].valueType}
									</h4>
								</div>
								<div className='flex justify-between border-b border-default-200 py-2 gap-2'>
									<h4 className='text-md text-default-600'>Giá trị giảm giá: </h4>
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
									Chỉnh sửa
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
