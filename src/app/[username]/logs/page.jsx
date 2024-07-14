"use client";
import { BreadcrumbAdmin } from "@/components";
import LogDataTable from "./LogDataTable";
import { useEffect, useState } from "react";
import LogPagination from "./LogPagination";
import { toEnglish } from '@/utils';

const LogList = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [logsData, setLogsData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        async function fetchLogs(page = 0) {
            try {
                const URL = `${BASE_URL}/logs?page=${page}&size=10&sort=${sortOrder}`;

                console.log('URL:', URL);
                const response = await fetch(URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch logs');
                }

                const result = await response.json();
                console.log('result:', result);

                setLogsData(result.data.logs);  // Update state with fetched data
                setPageCount(result.data.totalPages);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        }

        fetchLogs(currentPage);  // Call the async function to fetch logs
    }, [sortOrder, currentPage]);

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

    const handleSortChange = (newSortOrder) => {
        console.log('newSortOrder:', newSortOrder);
        console.log('toEnglish(newSortOrder)', toEnglish(newSortOrder));
        setSortOrder(toEnglish(newSortOrder));
    };

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
                    onSortChange={handleSortChange}
                />

            </div>
        </div>
    );
};

export default LogList;
