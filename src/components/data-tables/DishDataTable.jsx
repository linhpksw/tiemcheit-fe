"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuEye, LuPencil, LuLock } from 'react-icons/lu';
import { DemoFilterDropdown } from '@/components/filter';
import GoToAddButton from './GoToAddButton';
import { currentCurrency } from '@/common';
import { getProductsByStatus, updateProduct } from '@/helpers';
import { useFilterContext } from '@/context';
import { getProductWithPaginationAndFilter } from '@/helpers';
import { getImagePath } from '@/utils';

const DishDataTable = ({ user, columns, title, buttonText, buttonLink }) => {
  const sortFilterOptions = ['Ascending', 'Descending', 'Trending', 'Recent'];
  const { username } = user.data;
  const [productsData, setProductsData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [sortByPriceAsc, setSortByPriceAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({ category: '', status: '' });
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    const fetchData = async () => {
      const productPage = await getProductWithPaginationAndFilter(currentPage, pageSize, {
        ...filters,
        status: 'active'
      });
      setProductsData(productPage.content);
      setTotalPages(productPage.totalPages);
    };
    fetchData();
  }, [flag, currentPage]);

  const handleStatusChange = async (product, newStatus) => {
    try {
      const updatedProduct = {
        ...product,
        status: newStatus,
        description: product.description || '',
      };

      const response = await updateProduct(updatedProduct, product.id);

      setFlag(!flag);
    } catch (error) {
      console.error('Failed to update product status: ', error);
    }
  };

  const sortByPrice = () => {
    const sortedProducts = [...productsData].sort((a, b) => {
      if (sortByPriceAsc) {
        return b.price - a.price;
      } else {
        return a.price - b.price;
      }
    });

    setProductsData(sortedProducts);
    setSortByPriceAsc(!sortByPriceAsc);
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 0; i < totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 text-sm rounded ${i === currentPage ? 'bg-primary text-white' : 'bg-default-200'}`}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  };

  return (
    <>
      <div className="overflow-hidden px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
          <h2 className="text-xl font-semibold text-default-800">{title}</h2>
          <div className="flex flex-wrap items-center gap-4">
            <DemoFilterDropdown filterType="Sort" filterOptions={sortFilterOptions} />
            <GoToAddButton buttonText={buttonText} buttonLink={buttonLink} />
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-default-200">
              <thead className="bg-default-100">
                <tr className="text-start">
                  {columns.map((column) => (
                    <th key={column.key} className="whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800">
                      {column.name}
                      {column.key === "price" && (
                        <span className="ml-1 cursor-pointer" onClick={sortByPrice}>
                          {sortByPriceAsc ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="whitespace-nowrap px-6 py-3 text-start text-sm font-medium text-default-800">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-200">
                {productsData.length > 0 ? (
                  productsData.map((row, idx) => (
                    <tr key={row} className={`${row.status === "disabled" ? "bg-gray-200 line-through" : ""} ${row.quantity === 0 ? "bg-red-100" : ""}`}>
                      {columns.map((column) => {
                        const tableData = row[column.key];
                        if (column.key === "image") {
                          return (
                            <td key={column.key} className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800">
                              <div className="h-12 w-12">
                                <Image src={getImagePath(row.image)} height={48} width={48} alt={row.name} className="h-full max-w-full" />
                              </div>
                            </td>
                          );
                        } else if (column.key === "name") {
                          return (
                            <td key={column.key} className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-800">
                              <Link href={`/${username}/dishes/${row.id}`} className="flex items-center gap-3">
                                <p className={`text-base text-default-500 transition-all hover:text-primary ${row.status === "disabled" ? "line-through" : ""}`}>
                                  {tableData}
                                  {row.quantity === 0 && <span className="text-red-500 ml-2">(Out of Stock)</span>}
                                </p>
                              </Link>
                            </td>
                          );
                        } else if (column.key === "category_name") {
                          return (
                            <td key={column.key} className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500">
                              {row.category.name}
                            </td>
                          );
                        } else if (column.key === "createdAt") {
                          return (
                            <td key={column.key} className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500">
                              {row.createAt}
                            </td>
                          );
                        } else {
                          return (
                            <td key={column.key} className="whitespace-nowrap px-6 py-4 text-sm font-medium text-default-500">
                              {column.key === "price" && currentCurrency}
                              {tableData}
                            </td>
                          );
                        }
                      })}
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          {row.status === "inactive" ? (
                            <>
                              <button className="cursor-pointer transition-colors hover:text-primary" onClick={() => handleStatusChange(row, "active")}>
                                Publish
                              </button>
                              <button className="cursor-pointer transition-colors hover:text-red-500" onClick={() => handleStatusChange(row, "deleted")}>
                                Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <Link href={`/${username}/edit-dish/${row.id}`}>
                                <LuPencil size={20} className="cursor-pointer transition-colors hover:text-primary" />
                              </Link>
                              <Link href={`/${username}/dishes/${row.id}`}>
                                <LuEye size={20} className={`cursor-pointer transition-colors hover:text-primary ${row.status === "disabled" ? "text-primary" : ""}`} />
                              </Link>
                              <LuLock size={20} className={`cursor-pointer transition-colors hover:text-red-500 ${row.status === "disabled" ? "text-red-500" : ""}`} onClick={() => handleStatusChange(row, row.status === "disabled" ? "active" : "disabled")} />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1} className="text-center py-4 text-default-500">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        {renderPageButtons()}
      </div>
    </>
  );
}  

export default DishDataTable;
