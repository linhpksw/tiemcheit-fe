import { currentCurrency } from '@/common';

const TotalPayment = ({ currentCurrency, discount }) => {
    return (
        <div className='rounded-lg border border-default-200'>
            <div className='border-b border-default-200 px-4 py-2'>
                <h4 className='text-lg font-medium text-default-800'>Total Payment :</h4>
            </div>
            <div className='px-4'>
                <div className='flex justify-between border-b border-default-200 py-2'>
                    <h4 className='text-md text-default-600'>Subtotal :</h4>
                    <h4 className='text-md font-medium text-default-800'>{currentCurrency}</h4>
                </div>
                <div className='flex justify-between border-b border-default-200 py-2'>
                    <h4 className='text-md text-default-600'>Discount :</h4>
                    <h4 className='text-md font-medium text-default-800'>{discount}</h4>
                </div>
                <div className='flex justify-between border-b border-default-200 py-2'>
                    <h4 className='text-md text-default-600'>Shipping :</h4>
                    <h4 className='text-md font-medium text-default-800'>Free</h4>
                </div>
                <div className='flex justify-between py-4'>
                    <h4 className='text-xl text-default-700'>Total :</h4>
                    <h4 className='text-xl font-medium text-default-800'>{currentCurrency - discount}</h4>
                </div>
            </div>
        </div>
    );
};

export default TotalPayment;
