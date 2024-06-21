"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { DemoFilterDropdown, DateRangeFilter } from "@/components";
import { cn, toSentenceCase } from "@/utils";
import { currentCurrency } from "@/common";
import { formatISODate } from "@/utils/format-date";
import { useUser } from "@/hooks";
import { useState, useEffect } from "react";
import { getOrdersFromCustomer } from "@/helpers";
import Datepicker from "react-tailwindcss-datepicker";

const sortFilterOptions = ["Ascending", "Descending"];

const statusFilterOptions = ["All", "Price: High to Low", "Price: Low to High"];

const statusStyleColor = [
  "",
  "bg-yellow-500/10 text-yellow-500",
  "bg-slate-500/10 text-slate-500",
  "bg-pink-500/10 text-pink-500",
  "bg-cyan-300/10 text-cyan-300",
  "bg-cyan-600/10 text-cyan-600",
  "bg-orange-500/10 text-orange-500",
  "bg-green-500/10 text-green-500",
];

const CustomerOrderDataTable = ({
  columns,
  title,
  filters,
  onFilterChange,
  customer,
}) => {
  // const { user } = useUser();
  // const currentUser = user.data.username === "admin" ? customer : user;?

  // const [value, setValue] = useState({
  //   startDate: filters.startDate,
  //   endDate: filters.endDate,
  // });
  // const [status, setStatus] = useState(filters.status);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    onFilterChange({
      startDate: newValue.startDate,
      endDate: newValue.endDate,
      status,
    });
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onFilterChange({
      startDate: value.startDate,
      endDate: value.endDate,
      status: newStatus,
    });
  };

  const [orderInfo, setOrderInfo] = useState([]);

  useEffect(() => {
    const fetchOrderInfo = async () => {
      // if (currentUser == customer) {
      try {
        // console.log(customer);
        const orderInfo = await getOrdersFromCustomer(Number(customer.data.id));
        setOrderInfo(orderInfo);
      } catch (error) {
        console.error("Error fetching customers' order infomation:", error);
      }
      // } else {
      //   const orderInfo = rows;
      //   setOrderInfo(orderInfo);
      // }
    };

    fetchOrderInfo();
  }, [customer]);

  return (
    <div className="rounded-lg border border-default-200 bg-cy">
      <div className=" p-6 bg-">
        <div className="flex flex-wrap items-center gap-4 sm:justify-between lg:flex-nowrap">
          <h2 className="text-xl font-semibold text-default-800">{title}</h2>
          <div className="flex items-center justify-start gap-2">
            <DemoFilterDropdown
              filterType="Status"
              filterOptions={statusFilterOptions}
              className="w-20"
              onChange={handleStatusChange}
              //   value={status}
            />
            <Datepicker
              //   value={value}
              onChange={handleValueChange}
              popoverDirection="down"
              useRange={false}
              inputClassName="w-[300px] rounded-md focus:ring-0 b"
            />
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto w-">
        <div className="inline-block min-w-full align-middle bg-pr">
          <div className="overflow-hidden">
            <table className="w-full divide-y divide-default-200">
              <thead className="bg-default-100">
                <tr className="text-start">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800"
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-default-200">
                {orderInfo.map((row, idx) => {
                  const dish = row.orderDetails[0].product;
                  const numOfDish = row.orderDetails.length;
                  const total = row.orderDetails.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  );
                  return (
                    <tr key={idx}>
                      {columns.map((column) => {
                        const tableData = row[column.key];
                        if (column.key == "dish_id") {
                          return (
                            <td
                              key={tableData + idx}
                              className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800"
                            >
                              <div className="flex items-center gap-4">
                                <div className="shrink">
                                  <div className="h-18 w-18">
                                    <Image
                                      //src={dish?.images[0] ?? ''}
                                      className="h-full max-w-full"
                                      width={72}
                                      height={72}
                                      alt={dish?.name ?? ""}
                                    />
                                  </div>
                                </div>
                                <div className="grow">
                                  <p className="mb-1 text-sm text-default-500">
                                    {dish?.name}
                                  </p>
                                  {/* <div className='flex items-center gap-2'>
                                                                        <div className='flex gap-1.5'>
                                                                            {Array.from(
                                                                                new Array(
                                                                                    Math.floor(dish?.review.stars ?? 0)
                                                                                )
                                                                            ).map((_star, idx) => (
                                                                                <FaStar
                                                                                    key={idx}
                                                                                    size={18}
                                                                                    className='fill-yellow-400 text-yellow-400'
                                                                                />
                                                                            ))}
                                                                            {!Number.isInteger(dish?.review.stars) && (
                                                                                <FaStarHalfStroke
                                                                                    size={18}
                                                                                    className='text-yellow-400'
                                                                                />
                                                                            )}
                                                                            {(dish?.review.stars ?? 0) < 5 &&
                                                                                Array.from(
                                                                                    new Array(
                                                                                        5 -
                                                                                            Math.ceil(
                                                                                                dish?.review.stars ?? 0
                                                                                            )
                                                                                    )
                                                                                ).map((_val, idx) => (
                                                                                    <FaStar
                                                                                        key={idx}
                                                                                        size={18}
                                                                                        className='text-default-400'
                                                                                    />
                                                                                ))}
                                                                        </div>
                                                                        <h6 className='mt-1 text-xs text-default-500'>
                                                                            ({dish?.review.count})
                                                                        </h6>
                                                                    </div> */}
                                </div>
                              </div>
                              {numOfDish !== 1 && (
                                <p className="mt-2 text-xs text-default-500">
                                  {row.orderDetails.length - 1} more dishes...
                                </p>
                              )}
                            </td>
                          );
                        } else if (column.key == "orderStatus") {
                          const colorClassName =
                            statusStyleColor[
                              statusFilterOptions.indexOf(tableData)
                            ];
                          return (
                            <td key={tableData + idx} className="px-6 py-4">
                              <span
                                className={cn(
                                  "rounded-md px-3 py-1 text-xs font-medium",
                                  colorClassName
                                )}
                              >
                                {tableData}
                              </span>
                            </td>
                          );
                        } else if (column.key == "id") {
                          return (
                            <td
                              key={tableData + idx}
                              className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500 hover:text-primary-500"
                            >
                              <Link
                                href={`/${customer.data.username}/orders/${row.id}`}
                              >
                                {row.id}
                              </Link>
                            </td>
                          );
                        } else if (column.key == "orderDate") {
                          return (
                            <td
                              key={tableData + idx}
                              className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500"
                            >
                              {formatISODate(tableData)}
                            </td>
                          );
                        } else if (column.key == "amount") {
                          return (
                            <td
                              key={tableData + idx}
                              className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500"
                            >
                              {/* {total}
                              {column.key == "amount" && currentCurrency} */}
                              {total.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </td>
                          );
                        }
                      })}
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

export default CustomerOrderDataTable;
