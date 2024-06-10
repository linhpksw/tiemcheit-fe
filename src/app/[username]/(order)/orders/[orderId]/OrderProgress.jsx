import { LuCheck } from 'react-icons/lu';

const orderStatus = ['Order Received', 'Processing', 'Out for Delivery', 'Delivered'];
const OrderProgress = ({ status }) => {
    let progressBarWidth = ((orderStatus.indexOf(status) + 1) * 100) / (orderStatus.length - 1);
    if (status === 'Delivered') {
        progressBarWidth = 100;
    }

    return (
        <div className='relative my-10'>
            <div className='mx-28 -mb-6 hidden md:flex'>
                <div className='flex h-1.5 w-full overflow-hidden rounded-full bg-default-200'>
                    <div
                        style={{ width: `${progressBarWidth}%` }}
                        className='flex flex-col justify-center rounded-full bg-primary'
                    />
                </div>
            </div>
            <div className='absolute inset-y-0 start-1/2 flex -translate-x-1/2 md:hidden'>
                <div className='absolute inset-y-0 start-1/2 flex h-full w-1.5 -translate-x-1/2 overflow-hidden rounded-full bg-default-200'>
                    <div className='absolute bottom-1/2 start-1/2 top-0 flex w-1.5 -translate-x-1/2 flex-col justify-center overflow-hidden rounded-full bg-primary' />
                </div>
            </div>
            {/* <div className='relative z-10 grid grid-cols-4  items-center justify-between'>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white'>
                            <LuCheck />
                        </div>
                        <h4 className='mt-3 rounded-lg bg-default-100 p-2 text-sm text-default-800 shadow md:bg-transparent md:shadow-none'>
                            Order received
                        </h4>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
                            <span className='text-sm font-medium text-white'>02</span>
                        </div>
                        <h4 className='mt-3 rounded-lg bg-default-100 p-2 text-sm text-default-800 shadow md:bg-transparent md:shadow-none'>
                            Processing
                        </h4>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-primary backdrop-blur-sm'>
                            <span className='text-sm font-medium text-primary'>03</span>
                        </div>
                        <h4 className='mt-3 rounded-lg bg-default-100 p-2 text-sm text-default-800 shadow md:bg-transparent md:shadow-none'>
                            On the way
                        </h4>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-primary backdrop-blur-sm'>
                            <span className='text-sm font-medium text-primary'>04</span>
                        </div>
                        <h4 className='mt-3 rounded-lg bg-default-100 p-2 text-sm text-default-800 shadow md:bg-transparent md:shadow-none'>
                            Delivered
                        </h4>
                    </div>
                    
                </div> */}
            <div className='relative z-10 grid grid-cols-4 items-center justify-between'>
                {orderStatus.map((statusText, index) => (
                    <div key={index} className='flex flex-col items-center justify-center'>
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${index <= orderStatus.indexOf(status) + 1 ? 'bg-primary text-white' : 'bg-default-200'}`}>
                            {index <= orderStatus.indexOf(status) ? (
                                <LuCheck />
                            ) : (
                                <span className='text-sm font-medium'>{index + 1}</span>
                            )}
                        </div>
                        <h4 className='mt-3 rounded-lg bg-default-100 p-2 text-sm text-default-800 shadow md:bg-transparent md:shadow-none'>
                            {statusText}
                        </h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderProgress;
