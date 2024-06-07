import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { BreadcrumbAdmin, OrderDataTable } from "@/components";
import { orderRows } from "@/app/admin/(order)/orders/page";
import { getSellerById } from "@/helpers";
const PersonDetailsCard = dynamic(
  () => import("@/components/cards/PersonDetailsCard")
);

export const generateMetadata = async ({ params }) => {
  const seller = await getSellerById(Number(params.customerId)).then(
    (seller) => seller
  );
  return { title: seller?.name ?? undefined };
};

const CustomerDetails = async ({ params }) => {
  const seller = await getSellerById(Number(params.customerId));

  if (!seller) notFound();

  const columns = [
    {
      key: "date",
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
      key: "status",
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
            <PersonDetailsCard seller={seller} />
          </div>
          <div className="lg:col-span-2">
            <OrderDataTable
              title="Customer Order history"
              columns={columns}
              rows={orderRows}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
