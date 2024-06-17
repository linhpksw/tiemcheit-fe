"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { SpecialMenuSwiper } from "./swipers";
import { leafHomeImg, onionHomeImg } from "@/assets/data";
import { cn } from "@/utils";
import { toNormalText } from "@/helpers/toNormalText";

import { useProductByCategory, useBestSeller } from "@/hooks";
import { set } from "react-hook-form";

const SpecialMenu = ({ categoriesData }) => {
  const topSeller = 10;
  const [selectedCategory, setSelectedCategory] = useState(1);

  const { product, isLoading: isProductLoading } = useProductByCategory(selectedCategory);
  const shouldFetchBestSellers = !isProductLoading;
  const { bestProducts, isLoading: isBestSellerLoading } = useBestSeller( topSeller);

  if (isProductLoading || isBestSellerLoading) {
    return <div>Loading...</div>;
  }
  if (!product) {
    return <div>Product not found.</div>;
  }

  const bestProductData = bestProducts ? bestProducts.data : [];
  const productsData = product ? product.data : [];

  return (
    <section className="py-6 lg:py-16">
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-4 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="relative lg:mt-24">
              <div>
                <h2 className="mb-6 text-3xl font-semibold text-default-900">
                  Bán chạy  
                </h2>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 left-4 flex items-center gap-1 lg:flex">
                <div className="bestseller-menu-left flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary transition-all after:hidden after:content-[]">
                  <FaAngleLeft className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center gap-1 lg:flex">
                <div className="bestseller-menu-right flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-all after:hidden after:content-[]">
                  <FaAngleRight className="h-3 w-3 text-white" />
                </div>
              </div>

              <div className="rounded-lg bg-primary/10 lg:pb-16 lg:px-16 mt-10 lg:mt-0">
                <div className="p-4 lg:p-6">
                  <div className="lg:col-span-4 mb-6">
                    <div className="grid">
                      <SpecialMenuSwiper dishes={bestProductData} isBestSeller={true} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex">
                <div className="swiper-pagination bottom-12 start-0" />
                <span className="absolute bottom-0 start-1/4 z-10">
                  <Image src={onionHomeImg} alt="onion" />
                </span>
                <span className="absolute -bottom-12 -end-0 z-10">
                  <Image src={leafHomeImg} alt="leaf" />
                </span>
              </div>
            </div>
          </div>
        </div>  
        <br /><br /><br />
        <div className="grid gap-6 lg:grid-cols-4 lg:gap-10">
          <div className="lg:col-span-1">
            <div>
              <h2 className="mb-6 text-3xl font-semibold text-default-900">
                Special Menu For You...
              </h2>
            </div>
            <div className="flex w-full flex-wrap">
              <div className="custom-scroll -mx-4 h-auto w-screen overflow-auto px-2 lg:mx-0 lg:h-[30rem] lg:w-full">
                <nav
                  className="flex gap-2 lg:flex-col"
                  aria-label="Tabs"
                  role="tablist"
                  data-hs-tabs-vertical="true"
                >
                  {categoriesData ? (
                    categoriesData.map((category) => (
                      <button
                        type="button"
                        role="tab"
                        key={category.id}
                        className={cn(
                          "flex p-1",
                          selectedCategory === category.id && "active"
                        )}
                        id={toNormalText(category.name) + "-menu-toggle"}
                        data-hs-tab={
                          "#" + toNormalText(category.name) + "-menu"
                        }
                        aria-controls={
                          toNormalText(category.name) + "-menu"
                        }
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span className="flex w-full items-center justify-start gap-4 rounded-full p-2 pe-6 text-default-900 transition-all hover:text-primary hs-tab-active:bg-primary xl:w-2/3">
                          <div>
                            <span className="inline-flex h-14 w-14 grow items-center justify-center rounded-full hs-tab-active:bg-white">
                              <Image
                                src={onionHomeImg}
                                height={32}
                                width={32}
                                className="h-8 w-8"
                                alt="category-img"
                              />
                            </span>
                          </div>
                          <span className="shrink text-base font-medium hs-tab-active:text-white">
                            {category.name}
                          </span>
                        </span>
                      </button>
                    ))
                  ) : null}
                </nav>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="relative lg:mt-24">
              <div className="absolute top-1/2 -translate-y-1/2 left-4 flex items-center gap-1 lg:flex">
                <div className="special-menu-left flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary transition-all after:hidden after:content-[]">
                  <FaAngleLeft className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center gap-1 lg:flex">
                <div className="special-menu-right flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-all after:hidden after:content-[]">
                  <FaAngleRight className="h-3 w-3 text-white" />
                </div>
              </div>

              <div className="rounded-lg bg-primary/10 lg:pb-16 lg:px-16 mt-10 lg:mt-0">
                <div className="p-4 lg:p-6">
                  {categoriesData ? (
                    categoriesData.map((category) => (
                      <div
                        key={category.id}
                        id={toNormalText(category.name) + "-menu"}
                        role="tabpanel"
                        aria-labelledby="pizza-menu-item"
                        className={cn(
                          selectedCategory !== category.id && "hidden"
                        )}
                      >
                        <div className="grid grid-cols-1">
                          <SpecialMenuSwiper dishes={productsData} />
                        </div>
                      </div>
                    ))
                  ) : null}
                </div>
              </div>

              <div className="hidden lg:flex">
                <div className="swiper-pagination bottom-12 start-0" />
                <span className="absolute bottom-0 start-1/4 z-10">
                  <Image src={onionHomeImg} alt="onion" />
                </span>
                <span className="absolute -bottom-12 -end-0 z-10">
                  <Image src={leafHomeImg} alt="leaf" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialMenu;
