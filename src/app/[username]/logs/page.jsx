"use client";
import { BreadcrumbAdmin } from "@/components";
import LogDataTable from "./LogDataTable";
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import LogPagination from "./LogPagination";
import { toEnglish } from '@/utils';
import { robustFetch } from "@/helpers";
import * as yup from "yup";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const LogList = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [logsData, setLogsData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortOrder, setSortOrder] = useState('desc');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [status, setStatus] = useState('all');

    const dateFilterSchema = yup.object({
        filterByDateStart: yup.date()
            .max(new Date(), "Ngày bắt đầu không thể ở tương lai")
            .nullable()
            .test(
                'start-before-end',
                'Ngày bắt đầu phải nằm trước ngày kết thúc',
                function (value) {
                    const { filterByDateEnd } = this.parent;
                    if (!value || !filterByDateEnd) {
                        return true; // If one of the dates is missing, validation passes, assuming other rules handle emptiness appropriately
                    }
                    return yup.date().isValid(value) && yup.date().isValid(filterByDateEnd) && value <= filterByDateEnd;
                }
            ),

        filterByDateEnd: yup.date()
            .max(new Date(), "Ngày kết thúc không thể ở tương lai")
            .nullable()
            .test(
                'end-after-start',
                'Ngày kết thúc phải nằm sau hoặc trùng với ngày bắt đầu',
                function (value) {
                    const { filterByDateStart } = this.parent;
                    if (!value || !filterByDateStart) {
                        return true; // Validation logic is similar to above
                    }
                    return yup.date().isValid(value) && yup.date().isValid(filterByDateStart) && value >= filterByDateStart;
                }
            )
    });


    const { control } = useForm({
        resolver: yupResolver(dateFilterSchema),
        mode: "onChange",
        defaultValues: {
            filterByDateStart: new Date(),
            filterByDateEnd: new Date(),
        }
    });

    const startDateValue = useWatch({ control, name: "filterByDateStart", });
    const endDateValue = useWatch({ control, name: "filterByDateEnd", });

    const formatDate = (date) => {
        if (!date) return ''; // Return empty if no date provided
        const d = new Date(date);

        // Get the time zone offset in minutes and convert it to milliseconds
        const timeZoneOffset = d.getTimezoneOffset() * 60000;

        // Subtract the timezone offset to get the correct local date
        const localDate = new Date(d.getTime() - timeZoneOffset);

        // Format to 'yyyy-MM-dd'
        return localDate.toISOString().split('T')[0];
    };

    const isValidDateRange = (startDate, endDate) => {
        if (!startDate || !endDate) return false; // Ensure both dates are present

        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        // Check if dates are in the future
        if (start > now || end > now) {
            return false;
        }

        // Check if end date is after or on the same day as start date
        if (end < start) {
            return false;
        }

        return true;
    };

    useEffect(() => {
        if (startDateValue && endDateValue && isValidDateRange(startDateValue, endDateValue)) {
            async function fetchLogs(page = 0) {
                toast.loading('Đang xử lý...', { position: 'bottom-right' });

                const formattedStartDate = formatDate(startDateValue);
                const formattedEndDate = formatDate(endDateValue);
                const URL = `${BASE_URL}/logs?page=${page}&size=${rowsPerPage}&sortDirection=${sortOrder}&status=${status}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

                try {
                    const result = await fetch(
                        URL,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            method: 'GET',

                        }
                    ).then(res => res.json()
                    );

                    setLogsData(result.data.logs);
                    setPageCount(result.data.totalPages);
                } catch (error) {
                    console.error('Error fetching logs:', error);
                } finally {
                    toast.dismiss();
                }
            }
            fetchLogs(currentPage);
        }
    }, [sortOrder, currentPage, rowsPerPage, status, startDateValue, endDateValue]);

    const columns = [
        { key: "id", name: "ID" },
        { key: "timestamp", name: "Dấu thời gian" },
        { key: "username", name: "Tài khoản" },
        { key: "requestMethod", name: "Phương thức" },
        { key: "apiEndpoint", name: "API" },
        { key: "responseStatus", name: "Trạng thái" },
        { key: "executionTime", name: "Thực thi" },
        { key: "message", name: "Thông báo" },
        { key: "userAgent", name: "Thiết bị" },
    ];

    const handleSortOrderChange = (newSortOrder) => {
        setSortOrder(toEnglish(newSortOrder));
    };

    const handleRowPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
    }

    const handleStatusChange = (newStatus) => {
        setStatus(toEnglish(newStatus));
    }

    return (
        <div className="w-full lg:ps-64">
            <div className="page-content space-y-6 p-6">
                <BreadcrumbAdmin title="Nhật ký hệ thống" />
                <LogPagination
                    pageCount={pageCount}
                    onPageChange={({ selected }) => setCurrentPage(selected)}
                />

                <LogDataTable
                    rows={logsData || []}
                    columns={columns}
                    onSortOrderChange={handleSortOrderChange}
                    onRowPerPageChange={handleRowPerPageChange}
                    onStatusChange={handleStatusChange}
                    control={control}
                />

            </div>
        </div>
    );
};

export default LogList;
