"use client";
import Link from "next/link";
import { useShoppingContext } from "@/context";
import { currentCurrency } from "@/common";

const CartTotal = () => {
  const { getCalculatedOrder } = useShoppingContext();
  return (
    <div className="mb-5 rounded-lg border border-default-200 p-5">
      <h4 className="mb-5 text-lg font-semibold text-default-800">
        Thông tin giỏ hàng
      </h4>
      <div className="mb-6">
        <div className="mb-3 flex justify-between">
          <p className="text-sm text-default-500">Thành tiền</p>
          <p className="text-sm font-medium text-default-700">
            {getCalculatedOrder().orderTotal.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
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
            {getCalculatedOrder().totalDiscount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>

        <div className="my-4 border-b border-default-200" />
        <div className="mb-3 flex justify-between">
          <p className="text-base text-default-700">Tổng thành tiền</p>
          <p className="text-base font-medium text-default-700">
            {getCalculatedOrder().total.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>
      </div>
      <Link
        href="/checkout"
        className="inline-flex w-full items-center justify-center rounded-lg border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500"
      >
        THANH TOÁN
      </Link>
    </div>
  );
};

export default CartTotal;
