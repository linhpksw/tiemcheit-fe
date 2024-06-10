'use client'
import { BreadcrumbAdmin } from "@/components";
import AddDishForm from "./AddDishForm";
import DishUploader from "./DishUploader";

import { Authorization } from "@/components/security";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";


// export const metadata = {
//   title: "Add Dish",
// };

const AddProduct = () => {
  const { username } = useParams();
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <div></div>;
    }

  return (
    <Authorization allowedRoles={['ROLE_CUSTOMER']} username={username}>
      <div className="w-full lg:ps-64">
        <div className="page-content space-y-6 p-6">
          <BreadcrumbAdmin title="Add Dish" subtitle="Dishes" />
          <div className="grid gap-6 xl:grid-cols-3">
            <div>
              <DishUploader />
            </div>
            <AddDishForm />
          </div>
        </div>
      </div>
    </Authorization>
  );
};

export default AddProduct;
