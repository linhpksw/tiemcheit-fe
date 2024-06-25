import { useState, useEffect } from "react";
import { getAllUnpublishedProducts } from "@/helpers"; 
import { useProductByStatus } from "@/hooks";

const InactiveProductDetailView = ({ user, columns, title }) => {
  const [unpublishedDishes, setUnpublishedDishes] = useState([]);
  const {product, isLoading} = useProductByStatus("inactive");
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  const productsData = product.data;

  return (
    <div className="rounded-lg border border-default-200 mt-6">
      <div className="overflow-hidden px-6 py-4">
        <h2 className="text-xl font-semibold text-default-800">{title}</h2>
      </div>
      <div className="relative overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-default-200">
              <thead className="bg-default-100">
                <tr className="text-start">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800"
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-default-200">
                {productsData.map((row, idx) => (
                  <tr key={idx} className="bg-yellow-100">
                    {columns.map((column) => {
                      const tableData = row[column.key];
                      if (column.key === "image") {
                        return (
                          <td
                            key={tableData + idx}
                            className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800"
                          >
                            <div className="h-12 w-12">
                              <Image
                                src={require(`../../assets/images/dishes/${row.image}`)}
                                height={48}
                                width={48}
                                alt={row.name}
                                className="h-full max-w-full"
                              />
                            </div>
                          </td>
                        );
                      } else if (column.key === "name") {
                        return (
                          <td
                            key={tableData + idx}
                            className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800"
                          >
                            <Link
                              href={`/${user.username}/dishes/${row.id}`}
                              className="flex items-center gap-3"
                            >
                              <p className="text-base text-default-500 transition-all hover:text-primary">
                                {tableData}
                              </p>
                            </Link>
                          </td>
                        );
                      } else if (column.key === "category_name") {
                        return (
                          <td
                            key={tableData + idx}
                            className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500"
                          >
                            {row.category.name}
                          </td>
                        );
                      } else {
                        return (
                          <td
                            key={tableData + idx}
                            className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500"
                          >
                            {column.key === "price" && currentCurrency}
                            {tableData}
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InactiveProductDetailView;
