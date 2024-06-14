'use client';
import { useState, useEffect } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import { cn } from '@/utils';
import { robustFetch } from '@/helpers';

const DropdownMenu = ({ orderId, orderStatus, statusOptions, refresh }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const getStyles = (value) => {
        switch (value) {
            case 'Order Received':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'Cancelled':
                return 'bg-slate-500/10 text-slate-500';
            case 'Processing':
                return 'bg-cyan-300/10 text-cyan-300';
            case 'Out for Delivery':
                return 'bg-cyan-600/10 text-cyan-600';
            case 'Delivered':
                return 'bg-orange-500/10 text-orange-500';
            case 'Order Confirmed':
                return 'bg-green-500/10 text-green-500';
            case 'Refunded':
                return 'bg-pink-500/10 text-pink-500';
            default:
                return {};
        }
    };
    const updateStatus = async (option) => {
        try {
            const baseURL = `http://localhost:8080/orders/${orderId}/status?status=${option}`;
            console.log(baseURL);
            const response = await robustFetch(baseURL, 'PATCH', 'Success Updated', null, 'accessToken');
            refresh();
        } catch (err) {
            console.error('Error fetching order details:', err);
        } finally {
        }
    };

    const handleOptionClick = (option) => {
        console.log(option);
        updateStatus(option);
        setSelectedOption(option);
    };

    return (
        <div className='hs-dropdown relative inline-flex'>
            <button
                type='button'
                className={`${getStyles(orderStatus)} s-dropdown-toggle flex items-center gap-2 rounded-md  px-4 py-3 text-sm font-medium text-default-700 transition-all xl:px-5`}>
                {orderStatus} <LuChevronDown size={16} />
            </button>
            <div className='hs-dropdown-menu z-20 mt-4 hidden min-w-[200px] rounded-lg border border-default-100 bg-white p-1.5 opacity-0 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50'>
                <ul className='flex flex-col gap-1'>
                    {statusOptions.map((option, idx) => (
                        <li key={option + idx}>
                            <span
                                onClick={() => handleOptionClick(option)}
                                className={cn(
                                    'flex items-center gap-3 rounded px-3 py-2 font-normal transition-all hover:bg-default-100 hover:text-default-700',
                                    selectedOption == option ? ' bg-default-100 text-default-700' : 'text-default-600'
                                )}>
                                {option}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DropdownMenu;
