'use client'
import Image from 'next/image';
import { currentCurrency } from '@/common';
import { getImagePath } from '@/utils';
import { formatCurrency } from '@/utils';

const OrderDetailsDataTable = ({ columns, rows }) => {
    return (
        <div className='overflow-hidden rounded-lg border border-default-200'>
            <div className='relative overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <table className='min-w-full divide-y divide-default-200'>
                            <thead className='bg-default-400/10'>
                                <tr>
                                    {columns.map((column) => (
                                        <th
                                            key={column.key}
                                            scope='col'
                                            className='whitespace-nowrap px-5 py-3 text-start text-xs font-medium uppercase text-default-500'>
                                            {column.name}
                                        </th>
                                    ))}
                                    <th
                                        scope='col'
                                        className='whitespace-nowrap px-5 py-3 text-start text-xs font-medium uppercase text-default-500'>
                                        Tổng giá món
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-default-200'>
                                {rows.map((row, idx) => {
                                    return (
                                        <tr key={idx}>
                                            {columns.map((column, idx) => {
                                                const tableData = row[column.key];

                                                if (column.key == 'name') {
                                                    return (
                                                        <td
                                                            className='min-w-[190px] whitespace-nowrap px-5 py-3'
                                                            key={tableData + idx}>
                                                            <div className='flex items-center gap-2'>
                                                                <Image
                                                                    src={getImagePath(row.product.image)}
                                                                    width={72}
                                                                    height={72}
                                                                    className='h-18 w-18'
                                                                    alt='onion'
                                                                />
                                                                <h4 className='text-sm font-medium text-default-800'>
                                                                    {row.product.name}
                                                                </h4>
                                                            </div>
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td
                                                            key={idx}
                                                            className='whitespace-nowrap px-5 py-3 text-sm text-default-800'>
                                                            {column.key == 'price' && currentCurrency}
                                                            {column.key == 'quantity' && 'x'}
                                                            {tableData}
                                                        </td>
                                                    );
                                                }
                                            })}
                                            <td className='whitespace-nowrap px-5 py-3 text-sm text-default-800'>
                                                {row.price * row.quantity}
                                                {currentCurrency}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsDataTable;
