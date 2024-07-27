'use client';
import Link from 'next/link';
import { useShoppingContext } from '@/context';
import { useState } from 'react';

const CartTotal = () => {
    const { getCalculatedOrder, cartItems, removeFromCart } =
        useShoppingContext();
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleButtonClick = () => {
        setIsPopupVisible(true);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

    const deleteInvalidItem = () => {
        cartItems.forEach((item) => {
            if (item.product.status !== 'active') {
                removeFromCart(item);
            }
        });

        setIsPopupVisible(false);
    };

    return (
        <div className="mb-5 rounded-lg border border-default-200 p-5">
            <h4 className="mb-5 text-lg font-semibold text-default-800">
                Thông tin giỏ hàng
            </h4>
            <div className="mb-6">
                <div className="mb-3 flex justify-between">
                    <p className="text-sm text-default-500">Thành tiền</p>
                    <p className="text-sm font-medium text-default-700">
                        {getCalculatedOrder().total.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                    </p>
                </div>
                <div className="mb-3 flex justify-between">
                    <p className="text-sm text-default-500">Phí giao hàng</p>
                    <p className="text-sm font-medium text-default-700">Miễn phí</p>
                </div>
                <div className="mb-3 flex justify-between">
                    <p className="text-sm text-default-500">Khuyến mãi</p>
                    <p className="text-sm font-medium text-default-700">
                        -
                        {getCalculatedOrder().totalDiscount.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                    </p>
                </div>

                <div className="my-4 border-b border-default-200" />
                <div className="mb-3 flex justify-between">
                    <p className="text-base text-default-700">Tổng thành tiền</p>
                    <p className="text-base font-medium text-default-700">
                        {getCalculatedOrder().orderTotal.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                    </p>
                </div>
            </div>
            {cartItems.length > 0 ? (
                cartItems.some((item) => item.product.status !== 'active') ? (
                    <button
                        onClick={handleButtonClick}
                        className="inline-flex w-full items-center justify-center rounded-lg border border-red-500 bg-red-500 px-10 py-3 text-center text-sm font-medium text-white shadow-sm"
                    >
                        Không thể thanh toán
                    </button>
                ) : (
                    <Link
                        href="/checkout"
                        className="inline-flex w-full items-center justify-center rounded-lg border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500"
                    >
                        THANH TOÁN
                    </Link>
                )
            ) : (
                <button
                    disabled
                    className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-300 px-10 py-3 text-center text-sm font-medium text-gray-600 shadow-sm"
                >
                    Giỏ hàng trống
                </button>
            )}

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p>Bạn cần phải xóa trước khi tiếp tục</p>
                        <button
                            onClick={deleteInvalidItem}
                            className="mt-4 inline-flex items-center justify-center rounded-lg border-red-500 bg-red-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-red-400"
                        >
                            Xóa các sản phẩm ngừng bán
                        </button>
                        <button
                            onClick={closePopup}
                            className="mt-4 ml-2 inline-flex items-center justify-center rounded-lg border px-4 py-2 text-center text-sm font-medium shadow-sm transition-all duration-500 bg-transparent hover:bg-gray-200"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartTotal;
