"use client"
import { notFound, useParams } from "next/navigation";
import {
  BreadcrumbAdmin,
  DishDetailsSwiper,
  ProductDetailView,
} from "@/components";
import { useProductDetail } from "@/hooks";

const DishDetails = () => {
  const params = useParams();
    const { product, isLoading } = useProductDetail(Number(params.adminDishId));
  
    if (isLoading) {
      return <div></div>;
    }
    const productData = product.data;
  if (!productData) notFound();

  return (
    <div className="w-full lg:ps-64">
      <div className="page-content space-y-6 p-6">
        <BreadcrumbAdmin
          title={productData.name}
          subtitle="Dishes"
          link="/admin/dishes"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-default-200 p-6">
            <DishDetailsSwiper images={productData.images} />
          </div>
          <div className="rounded-lg border border-default-200 p-6">
            <ProductDetailView dish={productData} showButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetails;
