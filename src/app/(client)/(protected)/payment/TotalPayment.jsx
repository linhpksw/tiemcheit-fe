import { formatCurrency } from '@/utils';

const TotalPayment = ({ subTotal, discount }) => {
    return (
        <div className='rounded-lg border border-default-200'>
            <div className='border-b border-default-200 px-4 py-2'>
                <h4 className='text-lg font-medium text-default-800'>Chi tiết đơn hàng: </h4>
            </div>
            <div className='px-4'>
                <div className='flex justify-between border-b border-default-200 py-2'>
                    <h4 className='text-md text-default-600'>Tổng tiền hàng:</h4>
                    <h4 className='text-md font-medium text-default-800'>{formatCurrency(subTotal)}</h4>
                </div>

                <div className='flex justify-between border-b border-default-200 py-2'>
                    <h4 className='text-md text-default-600'>Giảm giá sản phẩm:</h4>
                    <h4 className='text-md font-medium text-default-800'>{formatCurrency(discount)}</h4>
                </div>
                <div className='flex justify-between border-b border-default-200 py-2'>
                    <h4 className='text-md text-default-600'>Phí vận chuyển:</h4>
                    <h4 className='text-md font-medium text-default-800'>Miễn phí</h4>
                </div>
                <div className='flex justify-between py-4'>
                    <h4 className='text-xl text-default-700'>Tổng thanh toán:</h4>
                    <h4 className='text-xl font-medium text-default-800'>{formatCurrency(subTotal - discount)}</h4>
                </div>
            </div>
        </div>
    );
};

export default TotalPayment;
