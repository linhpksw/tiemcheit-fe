"use client";
import { BreadcrumbAdmin, DishDataTable } from "@/components";

import { Authorization } from "@/components/security";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";
// export const metadata = {
//   title: "Dishes List",
// };

const columns = [
  {
    key: "image",
    name: "Image",
  },
  {
    key: "name",
    name: "Dish Name",
  },
  {
    key: "category_name",
    name: "Category",
  },
  {
    key: "price",
    name: "Price",
  },
  {
    key: "quantity",
    name: "Quantity",
  },
];

const ProductList = () => {
  const { username } = useParams();
  const { user, isLoading } = useUser();

  if (isLoading) {
      return <div></div>;
  }

  return (
    <Authorization allowedRoles={['ROLE_CUSTOMER']} username={username}>
      <div className="w-full lg:ps-64">
        <div className="page-content space-y-6 p-6">
          <BreadcrumbAdmin title="Dishes List" subtitle="Dishes" />

          <div className="grid grid-cols-1">
            <div className="rounded-lg border border-default-200">
              <DishDataTable
                user = {user}
                columns={columns}
                title="Dishes List"
                buttonLink={`/${username}/add-dish`}
                buttonText="Add Dish"
              />
            </div>
          </div>
        </div>
    </div>
    </Authorization>
  );
};

export default ProductList;
