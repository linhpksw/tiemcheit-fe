'use client';
import Image from 'next/image';
import Link from 'next/link';
import { LuEye, LuPencil, LuLock, LuTrash } from 'react-icons/lu';
import { DemoFilterDropdown } from '@/components/filter';
import GoToAddButton from './GoToAddButton';
import { cn, toSentenceCase } from '@/utils';
import { currentCurrency } from '@/common';
import { getAllProducts, updateProduct } from '@/helpers'; // Ensure you have this helper to fetch and update the data
import { useEffect, useState } from 'react';
import { formatISODate } from '@/utils';
import { robustFetch } from '@/helpers';

const CouponDataTable = ({ user, columns, title, buttonText, buttonLink, active }) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const defaultUrl = `${BASE_URL}/coupons`;
    const sortFilterOptions = ['Ascending', 'Descending', 'Trending', 'Recent'];
    const { username } = user.data;

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const fetchData = async () => {
        try {
            const response = await robustFetch(defaultUrl, 'GET');
            setCoupons(response.data);
        } catch (err) {
            console.error('Error fetching order details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refresh]);

    const disabledCoupon = async (id) => {
        const response = await robustFetch(defaultUrl + '/disable', 'PUT', null, id);
        setRefresh((prev) => !prev);
    };

    const deleteCoupon = async (id) => {
        const response = await robustFetch(defaultUrl + '/' + id, 'DELETE', null, null);
        setRefresh((prev) => !prev);
    };

    return (
        <>
            <div className='overflow-hidden px-6 py-4'>
                <div className='flex flex-wrap items-center justify-between gap-4 md:flex-nowrap'>
                    <h2 className='text-xl font-semibold text-default-800'>{title}</h2>
                    <div className='flex flex-wrap items-center gap-4'>
                        {/* <DemoFilterDropdown filterType='Sort' filterOptions={sortFilterOptions} /> */}
                        <GoToAddButton buttonText={buttonText} buttonLink={buttonLink} />
                    </div>
                </div>
            </div>
            <div className='relative overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <table className='min-w-full divide-y divide-default-200'>
                            <thead className='bg-default-100'>
                                <tr className='text-start'>
                                    {columns.map((column) => (
                                        <th
                                            key={column.key}
                                            className='whitespace-nowrap px-3 py-3 text-start text-sm font-medium text-default-800'>
                                            {column.name}
                                        </th>
                                    ))}
                                    <th className='whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800'>
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-default-200'>
                                {coupons
                                    .filter((e) => {
                                        if (active === 'active' && e.status === 'active') return e;
                                        else if (active === 'inactive' && e.status === 'inactive') return e;
                                        else if (active === 'disabled' && e.status === 'disabled') return e;
                                    })
                                    .map((row, idx) => (
                                        <tr key={row} className={`${row.status === 'disabled' ? 'bg-gray-200' : ''}`}>
                                            {columns.map((column) => {
                                                const tableData = row[column.key];
                                                if (column.key === 'image') {
                                                    return (
                                                        <td
                                                            key={column}
                                                            className='whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800'>
                                                            <div className='h-12 w-12 shrink'>
                                                                <Image
                                                                    //src={require(`../../assets/images/dishes/${row.image}`)}
                                                                    height={48}
                                                                    width={48}
                                                                    alt={row.name}
                                                                    className='h-full max-w-full'
                                                                />
                                                            </div>
                                                        </td>
                                                    );
                                                } else if (column.key === 'name') {
                                                    return (
                                                        <td
                                                            key={column}
                                                            className='whitespace-nowrap px-3 py-4 text-sm font-medium text-default-800'>
                                                            <Link
                                                                href={`/${username}/dishes/${row.id}`}
                                                                className='flex items-center gap-3'>
                                                                <p
                                                                    className={`truncate max-w-28 text-base text-default-500 transition-all hover:text-primary`}>
                                                                    {tableData}
                                                                </p>
                                                            </Link>
                                                        </td>
                                                    );
                                                } else if (column.key === 'code') {
                                                    return (
                                                        <td
                                                            key={column}
                                                            className='whitespace-nowrap w-[200px] px-3 py-4 text-sm font-medium text-default-500'>
                                                            {row.code}
                                                        </td>
                                                    );
                                                } else if (column.key === 'description') {
                                                    return (
                                                        <td
                                                            key={column}
                                                            className='truncate max-w-[300px] px-3 py-4 text-sm font-medium text-default-500'>
                                                            {row.description}
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td
                                                            key={column}
                                                            className='whitespace-nowrap px-3 py-4 text-sm font-medium text-default-500'>
                                                            {column.key === 'price' && currentCurrency}
                                                            {formatISODate(tableData)}
                                                        </td>
                                                    );
                                                }
                                            })}
                                            <td className='px-6 py-4'>
                                                <div className='flex gap-3'>
                                                    {row.status === 'inactive' && (
                                                        <>
                                                            <Link href={`/${username}/coupons/${row.id}`}>
                                                                <LuEye
                                                                    size={20}
                                                                    className={`cursor-pointer transition-colors hover:text-primary ${row.status === 'disabled' ? 'text-primary' : ''}`}
                                                                // onClick={() => handleStatusChange(row.id, row.status === "disabled" ? "active" : "disabled")}
                                                                />
                                                            </Link>
                                                            <Link href={`/${username}/edit-coupon/${row.id}`}>
                                                                <LuPencil
                                                                    size={20}
                                                                    className='cursor-pointer transition-colors hover:text-primary'
                                                                />
                                                            </Link>
                                                            <LuTrash
                                                                size={20}
                                                                className={`cursor-pointer transition-colors hover:text-red-500`}
                                                                onClick={() => deleteCoupon(row.id)}
                                                            />
                                                        </>
                                                    )}
                                                    {row.status === 'active' && (
                                                        <>
                                                            <Link href={`/${username}/coupons/${row.id}`}>
                                                                <LuEye
                                                                    size={20}
                                                                    className={`cursor-pointer transition-colors hover:text-primary ${row.status === 'disabled' ? 'text-primary' : ''}`}
                                                                // onClick={() => handleStatusChange(row.id, row.status === "disabled" ? "active" : "disabled")}
                                                                />
                                                            </Link>
                                                            <LuLock
                                                                size={20}
                                                                className={`cursor-pointer transition-colors hover:text-red-500 ${row.status === 'disabled' ? 'text-red-500' : ''}`}
                                                                onClick={() => disabledCoupon(row.id)}
                                                            />
                                                        </>
                                                    )}
                                                    {row.status === 'disabled' && (
                                                        <>
                                                            <Link href={`/${username}/coupons/${row.id}`}>
                                                                <LuEye
                                                                    size={20}
                                                                    className={`cursor-pointer transition-colors hover:text-primary ${row.status === 'disabled' ? 'text-primary' : ''}`}
                                                                // onClick={() => handleStatusChange(row.id, row.status === "disabled" ? "active" : "disabled")}
                                                                />
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CouponDataTable;
