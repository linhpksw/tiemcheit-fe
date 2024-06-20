'use client';
import Image from 'next/image';
import Link from 'next/link';
import { LuEye, LuPencil, LuLock } from 'react-icons/lu';
import { DemoFilterDropdown } from '@/components/filter';
import GoToAddButton from './GoToAddButton';
import { cn, toSentenceCase } from '@/utils';
import { currentCurrency } from '@/common';
import { getAllProducts, updateProduct } from '@/helpers'; // Ensure you have this helper to fetch and update the data
import { useEffect, useState } from 'react';
import { formatISODate } from '@/utils';
import { robustFetch } from '@/helpers';

const CouponDataTable = ({ user, columns, title, buttonText, buttonLink, active }) => {
    const sortFilterOptions = ['Ascending', 'Descending', 'Trending', 'Recent'];
    const { username } = user.data;

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const baseURL = `http://localhost:8080/coupons`;
            const response = await robustFetch(baseURL, 'GET', '', null);
            console.log(response.data);
            setCoupons(response.data);
        } catch (err) {
            console.error('Error fetching order details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // const handleStatusChange = async (id, newStatus) => {
    //   try {
    //      await updateProduct({"status": newStatus}, id);
    //     // Refetch products after status change
    //     const updatedProductData = await getAllProducts();
    //     setProductsData(updatedProductData);
    //   } catch (error) {
    //     console.error("Failed to update product status: ", error);
    //   }
    // };

    return (
        <>
            <div className='overflow-hidden px-6 py-4'>
                <div className='flex flex-wrap items-center justify-between gap-4 md:flex-nowrap'>
                    <h2 className='text-xl font-semibold text-default-800'>{title}</h2>
                    <div className='flex flex-wrap items-center gap-4'>
                        <DemoFilterDropdown filterType='Sort' filterOptions={sortFilterOptions} />
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
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-default-200'>
                                {coupons
                                    .filter((e) => {
                                        if (active === 'active' && e.status === 'active') return e;
                                        else if (active === 'inactive' && e.status === 'inactive') return e;
                                    })
                                    .map((row, idx) => (
                                        <tr
                                            key={idx}
                                            className={`${row.status === 'disabled' ? 'bg-gray-200 line-through' : ''} ${row.quantity === 0 ? 'bg-red-100' : ''}`}>
                                            {columns.map((column) => {
                                                const tableData = row[column.key];
                                                if (column.key === 'image') {
                                                    return (
                                                        <td
                                                            key={tableData + idx}
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
                                                            key={tableData + idx}
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
                                                            key={tableData + idx}
                                                            className='whitespace-nowrap w-[200px] px-3 py-4 text-sm font-medium text-default-500'>
                                                            {row.code}
                                                        </td>
                                                    );
                                                } else if (column.key === 'description') {
                                                    return (
                                                        <td
                                                            key={tableData + idx}
                                                            className='truncate max-w-[300px] px-3 py-4 text-sm font-medium text-default-500'>
                                                            {row.description}
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td
                                                            key={tableData + idx}
                                                            className='whitespace-nowrap px-3 py-4 text-sm font-medium text-default-500'>
                                                            {column.key === 'price' && currentCurrency}
                                                            {formatISODate(tableData)}
                                                        </td>
                                                    );
                                                }
                                            })}
                                            <td className='px-6 py-4'>
                                                <div className='flex gap-3'>
                                                    {row.status === 'inactive' ? (
                                                        <>
                                                            <button
                                                                className='cursor-pointer transition-colors hover:text-primary'
                                                                // onClick={() => handleStatusChange(row.id, "active")}
                                                            >
                                                                Publish
                                                            </button>
                                                            <button
                                                                className='cursor-pointer transition-colors hover:text-red-500'
                                                                // onClick={() => handleStatusChange(row.id, "deleted")}
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Link href={`/${username}/edit-dish/${row.id}`}>
                                                                <LuPencil
                                                                    size={20}
                                                                    className='cursor-pointer transition-colors hover:text-primary'
                                                                />
                                                            </Link>
                                                            <Link href={`/${username}/dishes/${row.id}`}>
                                                                <LuEye
                                                                    size={20}
                                                                    className={`cursor-pointer transition-colors hover:text-primary ${row.status === 'disabled' ? 'text-primary' : ''}`}
                                                                    // onClick={() => handleStatusChange(row.id, row.status === "disabled" ? "active" : "disabled")}
                                                                />
                                                            </Link>
                                                            <LuLock
                                                                size={20}
                                                                className={`cursor-pointer transition-colors hover:text-red-500 ${row.status === 'disabled' ? 'text-red-500' : ''}`}
                                                                // onClick={() => handleStatusChange(row.id, "inactive")}
                                                            />
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
