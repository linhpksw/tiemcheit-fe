"use client";
import { useState } from "react";
import { BreadcrumbAdmin, DishDataTable } from "@/components";
import { Authorization } from "@/components/security";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";
import { InactiveProductDetailView } from "@/components/data-tables";

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
  const [activeTab, setActiveTab] = useState("all");

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Authorization allowedRoles={['ROLE_ADMIN']} username={username}>
      <div className="w-full lg:ps-64">
        <div className="page-content space-y-6 p-6">
          <BreadcrumbAdmin title="Dishes List" subtitle="Dishes" />
          <div>
            <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '0px' }}>
              <button
                className={`tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: activeTab === "all" ? '#fff' : '#f5f5f5',
                  borderBottom: activeTab === "all" ? 'none' : '',
                  fontWeight: activeTab === "all" ? 'bold' : 'normal'
                }}
              >
                Tất cả
              </button>
              <button
                className={`tab ${activeTab === "inactive" ? "active" : ""}`}
                onClick={() => setActiveTab("inactive")}
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: activeTab === "inactive" ? '#fff' : '#f5f5f5',
                  borderBottom: activeTab === "inactive" ? 'none' : '',
                  fontWeight: activeTab === "inactive" ? 'bold' : 'normal',
                  marginLeft: '-1px' // Thêm margin âm để các nút chuyển tab nằm gần nhau hơn
                }}
              >
                Vừa được tạo
              </button>
            </div>

          <div className="grid grid-cols-1">
            {activeTab === "all" && (
              <div className="rounded-lg border border-default-200 ">
                <DishDataTable
                  user={user}
                  columns={columns}
                  title="Dishes List"
                  buttonLink={`/${username}/add-dish`}
                  buttonText="Add Dish"
                />
              </div>
            )}
            {activeTab === "inactive" && (
              <div className="rounded-lg border border-default-200 ">
                <InactiveProductDetailView
                  user={user}
                  columns={columns}
                  title="Inactive Dishes"
                  buttonLink={`/${username}/add-dish`}
                  buttonText="Add Dish"
                />
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </Authorization>
  );
};

export default ProductList;
