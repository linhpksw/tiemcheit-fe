"use client";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { BreadcrumbAdmin, EmployeeOrderDataTable } from "@/components";
import { orderRows } from "@/app/[username]/(order)/orders/page";
import { getEmployeeById } from "@/helpers";
import { useState, useEffect } from "react";

const PersonDetailsCard = dynamic(
  () => import("@/components/cards/PersonDetailsCard")
);

// export const generateMetadata = async ({ params }) => {
//   const seller = await getEmployeeById(Number(params.employeeId)).then(
//     (seller) => seller
//   );
//   return { title: seller?.name ?? undefined };
// };

const EmployeeDetails = async ({ params }) => {
  //   const seller = await getEmployeeById(Number(params.employeeId));
  const [employeeInfo, setEmployeeInfo] = useState([]);

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      try {
        const employeeInfo = await getEmployeeById(Number(params.employeeId));
        setEmployeeInfo(employeeInfo);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployeeInfo();
  }, []);

  if (!employeeInfo) notFound();

  const employeeData = {
    data: employeeInfo,
  };

  const columns = [
    {
      key: "orderDate",
      name: "Date",
    },
    {
      key: "id",
      name: "Order ID",
    },
    {
      key: "dish_id",
      name: "Dish",
    },
    {
      key: "amount",
      name: "Amount",
    },
    {
      key: "orderStatus",
      name: "Status",
    },
  ];

  return (
    <div className="w-full lg:ps-64">
      <div className="page-content space-y-6 p-6">
        <BreadcrumbAdmin
          title="Employees Details"
          link="/admin/employees"
          subtitle="Employees"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PersonDetailsCard user={employeeInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
