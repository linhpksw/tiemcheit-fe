"use client";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { BreadcrumbAdmin, CustomerOrderDataTable } from "@/components";
import { orderRows } from "@/app/[username]/(order)/orders/page";
import { getCustomerById } from "@/helpers";
import { useState, useEffect } from "react";

const PersonDetailsCard = dynamic(
  () => import("@/components/cards/PersonDetailsCard")
);

// export const generateMetadata = async ({ params }) => {
//   const seller = await getCustomerById(Number(params.customerId)).then(
//     (seller) => seller
//   );
//   return { title: seller?.name ?? undefined };
// };

const CustomerDetails = async ({ params }) => {
  //   const seller = await getCustomerById(Number(params.customerId));
  const [customerInfo, setCustomerInfo] = useState([]);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const customerInfo = await getCustomerById(Number(params.customerId));
        setCustomerInfo(customerInfo);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomerInfo();
  }, []);

  if (!customerInfo) notFound();

  const customerData = {
    data: customerInfo,
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
          title="Customers Details"
          link="/admin/customers"
          subtitle="Customers"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PersonDetailsCard user={customerInfo} />
          </div>
          <div className="lg:col-span-2">
            <CustomerOrderDataTable
              title="Order History"
              columns={columns}
              // rows={orderRows}
              customer={customerData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
