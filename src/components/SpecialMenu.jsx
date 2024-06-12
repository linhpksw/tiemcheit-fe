"use client";
import Image from "next/image";
import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { SpecialMenuSwiper } from "./swipers";
import { leafHomeImg, onionHomeImg } from "@/assets/data";
import { cn } from "@/utils";
import {toNormalText} from "@/helpers/toNormalText";

import { useProductByCatgory } from "@/hooks";
import { set } from "react-hook-form";

const SpecialMenu = ({categoriesData}) => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const {product, isLoading: isProductLoading} = useProductByCatgory(selectedCategory);
  console.log(product);
  if (isProductLoading) {
    return <div></div>
  }
  const productsData = product.data;

  return (
    <section className="py-6 lg:py-16">
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-4 lg:gap-10">
          <div>
            <div>
              <span className="mb-6 inline-flex rounded-full bg-primary/20 px-4 py-2 text-sm text-primary">
                Menu
              </span>
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
                  {categoriesData ? categoriesData.map((category) => (
                    <button
                      type="button"
                      role="tab"
                      key={category.id}
                      className={cn(
                        "flex p-1",
                        selectedCategory == category.id && "active"
                      )}
                      id={toNormalText(category.name) + "-menu-toggle"}
                      data-hs-tab={"#" + toNormalText(category.name) + "-menu"}
                      aria-controls={toNormalText(category.name) + "-menu"}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span className="flex w-full items-center justify-start gap-4 rounded-full p-2 pe-6 text-default-900 transition-all hover:text-primary hs-tab-active:bg-primary xl:w-2/3">
                        <div>
                          <span className="inline-flex h-14 w-14 grow items-center justify-center rounded-full hs-tab-active:bg-white">
                            <Image
                              // src={category.image }
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
                  : null}
                </nav>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="relative lg:mt-24">
              <div className="absolute -top-14 end-15 hidden items-center gap-1 lg:flex">
                <div className="special-menu-left flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-primary transition-all after:hidden after:content-[]">
                  <FaAngleLeft className="!h-4 !w-4 text-white" />
                </div>
                <div className="special-menu-right flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-all after:hidden after:content-[]">
                  <FaAngleRight className="!h-4 !w-4 text-white" />
                </div>
              </div>

              <div className="rounded-lg bg-primary/10 lg:pb-16">
                <div className="p-4 lg:p-6">
                  { categoriesData  ? categoriesData.map((category) => {
                    return (
                      <div
                        key={category.id}
                        id={toNormalText(category.name) + "-menu"}
                        role="tabpanel"
                        aria-labelledby="pizza-menu-item"
                        className={cn(
                          selectedCategory != category.id && "hidden"
                        )}
                      >
                        <div className="grid grid-cols-1">
                          <SpecialMenuSwiper
                            // dishes={specialMenuData.filter(
                            //   (dish) => dish.category_id == selectedCategory
                            // )}

                            dishes={productsData}
                          />
                        </div>
                      </div>
                    );
                  })
                  : null}
                </div>
              </div>

              <div className="hidden lg:flex">
                <div className="swiper-pagination !bottom-12 !start-0" />
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
