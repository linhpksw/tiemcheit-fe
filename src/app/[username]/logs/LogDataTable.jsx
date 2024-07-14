import { cn, truncateString, formatDateTime } from "@/utils";
import LogSearchBox from "./LogSearchBox";
import LogFilterDropdown from "./LogFilterDropdown";
import DateRangeFilter from "./LogDateRangeFilter";

const sortFilterOptions = ["giảm dần", "tăng dần"];

const statusFilterOptions = ["200", "khác"];

const LogDataTable = ({
    rows,
    columns,
    onSortChange,
}) => {
    return (
        <div className="rounded-lg border border-default-200">
            <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <LogSearchBox />

                    <div className="flex flex-wrap items-center gap-2">
                        <DateRangeFilter />

                        <LogFilterDropdown
                            filterType="Thứ tự"
                            filterOptions={sortFilterOptions}
                            value="giảm dần"
                            onChange={onSortChange}
                        />

                        <LogFilterDropdown
                            filterType="Trạng thái"
                            filterOptions={statusFilterOptions}
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
                                    {columns.map((column) => (
                                        <th
                                            key={column.key}
                                            scope="col"
                                            className="whitespace-nowrap px-4 py-4 text-start text-sm font-medium text-default-500"
                                        >
                                            {column.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-default-200">
                                {rows && rows.map((row, idx) => {
                                    return (
                                        <tr key={idx}>
                                            {columns.map((column, idx) => {
                                                const tableData = row[column.key];

                                                if (column.key == "timestamp") {
                                                    return (
                                                        <td
                                                            key={tableData + idx}
                                                            className="whitespace-nowrap px-4 py-4 text-default-800"
                                                        >
                                                            {formatDateTime(tableData)}
                                                        </td>
                                                    );
                                                }
                                                else if (column.key == "executionTime") {
                                                    return (
                                                        <td
                                                            key={tableData + idx}
                                                            className="whitespace-nowrap px-4 py-4 text-default-800 text-end"
                                                        >
                                                            {tableData} ms
                                                        </td>
                                                    );
                                                }
                                                else if (column.key == "responseStatus") {
                                                    const colorClassName =
                                                        tableData == "200"
                                                            ? "bg-green-500/10 text-green-500"
                                                            : "bg-red-500/10 text-red-500";
                                                    return (
                                                        <td
                                                            key={tableData + idx}
                                                            className="whitespace-nowrap px-4 py-4 text-center"
                                                        >
                                                            <span
                                                                className={cn(
                                                                    "rounded-md px-3 py-1 font-medium",
                                                                    colorClassName
                                                                )}
                                                            >
                                                                {tableData}
                                                            </span>
                                                        </td>
                                                    );
                                                }
                                                else if (column.key == "requestMethod") {
                                                    let colorClassName = "";

                                                    switch (tableData) {
                                                        case "GET":
                                                            colorClassName = "bg-green-500/10 text-green-500";
                                                            break;
                                                        case "POST":
                                                            colorClassName = "bg-yellow-500/10 text-yellow-500";
                                                            break;
                                                        case "PUT":
                                                            colorClassName = "bg-blue-500/10 text-blue-500";
                                                            break;
                                                        case "DELETE":
                                                            colorClassName = "bg-red-500/10 text-red-500";
                                                            break;
                                                        case "PATCH":
                                                            colorClassName = "bg-purple-500/10 text-purple-500";
                                                            break;
                                                        default:
                                                            break;
                                                    }

                                                    return (
                                                        <td
                                                            key={tableData + idx}
                                                            className="whitespace-nowrap px-4 py-4 text-center"
                                                        >
                                                            <span
                                                                className={cn(
                                                                    "rounded-md px-3 py-1 font-medium",
                                                                    colorClassName
                                                                )}
                                                            >
                                                                {tableData}
                                                            </span>
                                                        </td>
                                                    );
                                                }
                                                else if (column.key == "apiEndpoint") {
                                                    return (
                                                        <td
                                                            key={tableData + idx}
                                                            className="px-4 py-4 font-medium text-blue-500"
                                                        >
                                                            {truncateString(tableData, 48)}
                                                        </td>
                                                    );
                                                }
                                                else if (column.key == "username") {
                                                    return (
                                                        <td
                                                            key={tableData + idx}
                                                            className=" px-4 py-4 text-center font-medium text-fuchsia-500"
                                                        >
                                                            {tableData}
                                                        </td>
                                                    );
                                                }
                                                else if (column.key == "message") {
                                                    const colorClassName =
                                                        tableData?.includes("thành công")
                                                            ? "text-green-500"
                                                            : "text-red-500";

                                                    return (
                                                        <td
                                                            key={tableData + idx}
                                                            className={"px-4 py-4 text-left " + colorClassName}
                                                        >
                                                            {tableData}
                                                        </td>
                                                    );
                                                }

                                                else {
                                                    return (
                                                        <td
                                                            key={tableData + idx}
                                                            className="px-4 py-4 text-default-800"
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
        </div >
    );
};

export default LogDataTable;
