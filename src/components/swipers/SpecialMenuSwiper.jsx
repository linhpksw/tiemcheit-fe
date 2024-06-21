"use client";
import Image from "next/image";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { currentCurrency } from "@/common";

import { pizzaBanner1Img } from "@/assets/data";
import { getImagePath } from "@/utils";

const SpecialMenuSwiper = ({ dishes, isBestSeller, isHistoryOrderedProducts }) => {
  return (
    <>
      <style jsx>{`
        .swiper-slide-custom {
          width: 100%;
          height: auto;
        }

        .swiper-slide-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        .image-container {
          width: 100%;
          height: auto;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .text-container {
          width: 100%;
          padding: 10px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          text-align: center;
        }
      `}</style>
      <Swiper
        className="menu-swiper h-full w-full"
        modules={[Thumbs, Navigation]}
        spaceBetween={12}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
        }}
        navigation={isBestSeller ? {
          nextEl: ".bestseller-menu-right",
          prevEl: ".bestseller-menu-left",
        }:(isHistoryOrderedProducts ? {
          nextEl: ".history-menu-right",
          prevEl: ".history-menu-left",
          } : {
          nextEl: ".special-menu-right",
          prevEl: ".special-menu-left",
          })
        }
        breakpoints={ isBestSeller ? {
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1300: {
            slidesPerView: 5,
            spaceBetween: 10,
          },
        } : {
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1300: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        
        loop
      >
        {dishes ? dishes.map((dish) => (
          <SwiperSlide key={dish.id} className="swiper-slide-custom">
            <Link href={`/dishes/${dish.id}`}>
              <div className="relative cursor-pointer overflow-hidden rounded-lg swiper-slide-content">
                <div className="image-container">
                  <Image
                    src={getImagePath(dish.image)}
                    alt="img"
                    layout="responsive"
                    width={336.7}
                    height={449.7}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-container absolute inset-0 bg-black/20">
                  <div className="inline-flex h-full w-full items-end">
                    <div className="p-6">
                      <h5 className="mb-2 text-xl font-medium text-white">
                        {dish.name}
                      </h5>
                      <h5 className="mb-2 text-l font-medium text-white">
                        Số lượng: {dish.quantity} 
                      </h5>
                      <h5 className="mb-2 text-xl font-semibold text-white">
                        <span className="text-base font-medium text-yellow-400">
                          {currentCurrency}&nbsp;
                        </span>
                        {dish.price}
                      </h5>
                      <Link
                        href="/dishes"
                        className="inline-flex items-center border-b border-dashed border-white text-white"
                      >
                        Order Now <LuChevronRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))
      : null}
      </Swiper>
    </>
  );
};

export default SpecialMenuSwiper;
