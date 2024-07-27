import { formatCurrency } from "@/utils";

const TotalPayment = ({ currentCurrency, discount }) => {
    return (
        <div className='rounded-lg border border-default-200'>
            <div className='border-b border-default-200 px-4 py-2'>
                <h4 className='text-lg font-medium text-default-800'>Tổng thanh toán :</h4>
            </div>
            <div className='px-4'>
                <div className='flex justify-between border-b border-default-200 py-2'>
                    <h4 className='text-md text-default-600'>Tổng giá món :</h4>
                    <h4 className='text-md font-medium text-default-800'>{formatCurrency(currentCurrency)}</h4>
                </div>
                <div className='flex justify-between border-b border-default-200 py-2'>
                    <h4 className='text-md text-default-600'>Giảm giá :</h4>
                    <h4 className='text-md font-medium text-default-800'>{formatCurrency(discount)}</h4>
                </div>
                <div className='flex justify-between border-b border-default-200 py-2'>
                    <h4 className='text-md text-default-600'>Phí ship :</h4>
                    <h4 className='text-md font-medium text-default-800'>Free</h4>
                </div>
                <div className='flex justify-between py-4'>
                    <h4 className='text-md text-default-700'>Tổng đơn hàng :</h4>
                    <h4 className='text-md font-medium text-default-800'>{formatCurrency(currentCurrency - discount)}</h4>
                </div>
            </div>
        </div>
    );
};

export default TotalPayment;
