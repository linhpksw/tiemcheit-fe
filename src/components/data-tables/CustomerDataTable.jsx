"use client";

import { currentCurrency } from "@/common";
import Link from "next/link";
import { cn, toSentenceCase } from "@/utils";
import TableSearchBox from "./TableSearchBox";
import { DemoFilterDropdown } from "../filter";
import DateRangeFilter from "./DateRangeFilter";
import GoToAddButton from "./GoToAddButton";
import { robustFetch } from "@/helpers";
import {
  LuEye,
  LuBan,
  LuUnlock,
  LuLock,
  LuArrowUpSquare,
} from "react-icons/lu";
import { useUser } from "@/hooks";
import { updateCustomer, getRole } from "@/helpers";
import { useEffect, useState } from "react";

const sortFilterOptions = [
  "None",
  "Order Number: High to Low",
  "Order Number: Low to High",
  "Order Total: High to Low",
  "Order Total: Low to High",
  "Created Date: Latest to Oldest",
  "Created Date: Oldest to Latest",
];

const statusFilterOptions = ["All", "Active", "Unactive", "Deactivated"];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const INIT_STATE = {
  rows: [],
};

const CustomerDataTable = ({
  rows,
  columns,
  title,
  buttonLink,
  buttonText,
}) => {
  const originalData = rows;
  const { user } = useUser();
  const { username = "" } = user?.data || {};
  const [state, setState] = useState(INIT_STATE);
  const [loading, setLoading] = useState(true);
  // state.rows = rows;
  const [filters, setFilters] = useState({
    status: "All",
    sortOption: "None",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    //fetchOrders(newFilters);
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      rows: rows,
    }));

    if (user) fetchFilteredData(filters);
  }, [rows, user, filters]);

  const fetchFilteredData = async (filters) => {
    setLoading(true);
    try {
      let baseURL = "http://localhost:8080/admin/customers/filter";

      const params = new URLSearchParams();
      if (filters.status && filters.status != "All")
        params.append("status", filters.status);
      if (filters.sortOption && filters.sortOption != "None") {
        switch (true) {
          case filters.sortOption.startsWith("Order Number"):
            params.append("sortOption", "order_number");
            break;
          case filters.sortOption.startsWith("Order Total"):
            params.append("sortOption", "order_total");
            break;
          case filters.sortOption.startsWith("Created Date"):
            console.log("RUN");
            params.append("sortOption", "created_at");
            break;
        }

        switch (true) {
          case filters.sortOption.endsWith("High to Low"):
            params.append("order", "desc");
            break;
          case filters.sortOption.endsWith("Oldest to Latest"):
            params.append("order", "desc");
            break;
          case filters.sortOption.endsWith("Low to High"):
            params.append("order", "asc");
            break;
          case filters.sortOption.endsWith("Latest to Oldest"):
            params.append("order", "asc");
            break;
        }
      }

      const query = params.toString();
      // console.log(query);
      const fullURL = query ? `${baseURL}?${query}` : baseURL;
      const response = await robustFetch(fullURL, "GET", "", null);
      // console.log(response.data);
      const newCustomerData = response.data.map((customer) => {
        const [date, offsetTime] = customer.createdAt.split("T");
        const [time] = offsetTime.split(".");
        const formattedTime = time.slice(0, 8);

        return {
          id: customer.id ?? 0,
          name: customer.fullname,
          username: customer.username,
          photo: "",
          contact_no: customer.phone,
          email: customer.email,
          location: "",
          order_total: customer.orderTotal ?? 0,
          orders: customer.orderNumber ?? 0,
          joining_date: date,
          joining_time: formattedTime,
          status: customer.status,
          roles: customer.roles,
        };
      });

      setState((prevState) => ({
        ...prevState,
        rows: newCustomerData,
      }));
    } catch (err) {
      console.error("Error fetching customers filter:", err);
    } finally {
      setLoading(false);
    }
    // }
  };

  const updateCustomerStatus = async (username, status, roleName) => {
    let roles = [];
    try {
      const response = await getRole(roleName);
      roles.push(response);
      console.log(roles);
    } catch (error) {
      console.error("Error in fetching roles: ", error);
    }

    const data = {
      username: username,
      updateData: {
        status: status,
        roles: roles,
      },
    };

    const userConfirmed = window.confirm(
      `Are you sure you want to update the status for ${username} to ${status} and the role to ${roles[0].name}?`
    );

    if (!userConfirmed) {
      return;
    }

    try {
      const response = await updateCustomer(data);

      setState((prevState) => ({
        ...prevState,
        rows: prevState.rows.map((row) =>
          row.username === response.username
            ? { ...row, status: response.status }
            : row
        ),
      }));
    } catch (error) {
      console.error("Error in updating customers:", error);
    }
  };

  return (
    <div className="rounded-lg border border-default-200">
      {/* <div className="border-b border-b-default-200 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="text-xl font-medium text-default-900">{title}</h2>

          <GoToAddButton buttonText={buttonText} buttonLink={buttonLink} />
        </div>
      </div> */}

      <div className="p-6">
        <div className="flex flex-wrap items-center justify-end gap-4">
          {/* <TableSearchBox /> */}

          <div className="flex flex-wrap items-center gap-2">
            {/* <DateRangeFilter /> */}

            <DemoFilterDropdown
              filterType="Sort"
              filterOptions={sortFilterOptions}
              onChange={(sortOption) =>
                handleFilterChange({ ...filters, sortOption })
              }
              value={filters.sortOption}
            />
            <DemoFilterDropdown
              filterType="Filter"
              filterOptions={statusFilterOptions}
              onChange={(status) => handleFilterChange({ ...filters, status })}
              value={filters.status}
            />
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto border-t border-default-200">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-default-200">
              <thead className="bg-default-100">
                <tr>
                  <th scope="col" className="max-w-[1rem] px-6 py-4">
                    <div className="flex h-5 items-center">
                      <input
                        id="hs-table-search-checkbox-all"
                        type="checkbox"
                        className="form-checkbox h-5 w-5 rounded border border-default-300 bg-transparent text-primary focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0"
                      />
                      <label
                        htmlFor="hs-table-search-checkbox-all"
                        className="sr-only"
                      >
                        Checkbox
                      </label>
                    </div>
                  </th>

                  <th className="text-start text-sm font-medium text-default-500">
                    Action
                  </th>

                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="whitespace-nowrap px-6 py-4 text-start text-sm font-medium text-default-500"
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-default-200">
                {state.rows.map((row, idx) => {
                  return (
                    <tr key={idx}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex h-5 items-center">
                          <input
                            id="hs-table-search-checkbox-1"
                            type="checkbox"
                            className="form-checkbox h-5 w-5 rounded border border-default-300 bg-transparent text-primary focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0"
                          />
                          <label
                            htmlFor="hs-table-search-checkbox-1"
                            className="sr-only"
                          >
                            Checkbox
                          </label>
                        </div>
                      </td>

                      <td>
                        <div className="flex gap-3">
                          <Link href={`/${username}/customers/${row.id}`}>
                            <LuEye
                              size={20}
                              className="cursor-pointer transition-colors hover:text-primary"
                            />
                          </Link>
                          {/* <LuBan
                              size={20}
                              className="cursor-pointer transition-colors hover:text-red-500"
                            /> */}

                          {row.status === "ACTIVE" ? (
                            <button
                              onClick={() =>
                                updateCustomerStatus(
                                  row.username,
                                  "UNACTIVE",
                                  row.roles[0].name
                                )
                              }
                            >
                              <LuLock
                                size={20}
                                className="cursor-pointer transition-colors hover:text-red-500"
                              />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                updateCustomerStatus(
                                  row.username,
                                  "ACTIVE",
                                  row.roles[0].name
                                )
                              }
                            >
                              <LuUnlock
                                size={20}
                                className="cursor-pointer transition-colors hover:text-primary"
                              />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              updateCustomerStatus(
                                row.username,
                                row.status,
                                "EMPLOYEE"
                              )
                            }
                          >
                            <LuArrowUpSquare
                              size={20}
                              className="cursor-pointer transition-colors hover:text-primary"
                            ></LuArrowUpSquare>
                          </button>
                        </div>
                      </td>

                      {columns.map((column, idx) => {
                        const tableData = row[column.key];

                        if (column.key == "joining_date") {
                          return (
                            <td
                              key={tableData + idx}
                              className="whitespace-nowrap px-6 py-4 text-base text-default-800"
                            >
                              {tableData} |&nbsp;
                              <span className="text-xs">
                                {row["joining_time"]}
                              </span>
                            </td>
                          );
                        } else if (column.key == "status") {
                          const colorClassName =
                            tableData == "ACTIVE"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500";
                          return (
                            <td
                              key={tableData + idx}
                              className="whitespace-nowrap px-6 py-4"
                            >
                              <span
                                className={cn(
                                  "rounded-md px-3 py-1 text-xs font-medium",
                                  colorClassName
                                )}
                              >
                                {toSentenceCase(tableData)}
                              </span>
                            </td>
                          );
                        } else if (column.key == "order_total") {
                          return (
                            <td
                              key={tableData + idx}
                              className="whitespace-nowrap px-6 py-4 text-base text-default-800"
                            >
                              {tableData.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </td>
                          );
                        } else {
                          return (
                            <td
                              key={tableData + idx}
                              className="whitespace-nowrap px-6 py-4 text-base text-default-800"
                            >
                              {tableData}
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

export default CustomerDataTable;
