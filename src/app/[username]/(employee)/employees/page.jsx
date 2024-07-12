"use client";
import { BreadcrumbAdmin, EmployeeDataTable } from "@/components";
import { useState, useEffect } from "react";

//data
import { sellersData } from "@/assets/data";
import { getAllEmployees } from "@/helpers";

// export const metadata = {
//   title: "Employees List",
// };

const EmployeesList = () => {
  const [employeeData, setEmployeeData] = useState([]);
  // const [loading, setLoading] = useState(true);

  const columns = [
    {
      key: "name",
      name: "Name",
    },
    {
      key: "contact_no",
      name: "Phone",
    },
    {
      key: "email",
      name: "Email",
    },
    {
      key: "joining_date",
      name: "Employee Since",
    },
    {
      key: "status",
      name: "Status",
    },
  ];

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const data = await getAllEmployees();

        const employeeData = data.map((employee) => {
          const [date, offsetTime] = employee.createdAt.split("T");
          const [time] = offsetTime.split(".");
          const formattedTime = time.slice(0, 8);

          return {
            id: employee.id ?? 0,
            name: employee.fullname,
            username: employee.username,
            photo: "",
            contact_no: employee.phone,
            email: employee.email,
            location: "",
            joining_date: date,
            joining_time: formattedTime,
            status: employee.status,
            roles: employee.roles,
          };
        });

        setEmployeeData(employeeData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployeeData();
  }, []);

  return (
    <div className="w-full lg:ps-64">
      <div className="page-content space-y-6 p-6">
        <BreadcrumbAdmin title="Employees List" subtitle="Employees" />

        <EmployeeDataTable
          rows={employeeData}
          columns={columns}
          title="Employees"
          buttonText="Add a new Employee"
          buttonLink="/admin/add-employee"
        />
      </div>
    </div>
  );
};

export default EmployeesList;
