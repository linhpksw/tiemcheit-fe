'use client';
import Image from 'next/image';
import Link from 'next/link';
import { LuChevronRight } from 'react-icons/lu';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { currentCurrency } from '@/common';

import { pizzaBanner1Img } from '@/assets/data';
import { getImagePath } from '@/utils';

const SpecialMenuSwiper = ({ dishes, isBestSeller, isHistoryOrderedProducts }) => {
	return (
		<>
			<style jsx>{`
				.swiper-slide-custom {
					width: 100%;
					height: auto;
					position: relative;
				}

				.swiper-slide-content {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					height: 100%;
				}

				.image-container {
					width: 100%;
					height: 0;
					padding-bottom: 133%; /* Adjust this percentage to maintain aspect ratio */
					position: relative;
					overflow: hidden;
				}

				.image-container img {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					object-fit: cover; /* Ensures the image covers the container without distortion */
				}

				.text-container {
					width: 100%;
					padding: 10px;
					background: rgba(0, 0, 0, 0.5);
					color: white;
					text-align: center;
					position: absolute;
					bottom: 0;
				}

				.text-container h5 {
					margin: 0;
				}

				.no-products {
					text-align: center;
					font-size: 1.25rem;
					color: #999;
					padding: 2rem;
				}
			`}</style>

			{dishes && dishes.length > 0 ? (
				<Swiper
					className='menu-swiper h-full w-full'
					modules={[Thumbs, Navigation]}
					spaceBetween={12}
					pagination={{
						el: '.swiper-pagination',
						clickable: true,
					}}
					navigation={
						isBestSeller
							? {
									nextEl: '.bestseller-menu-right',
									prevEl: '.bestseller-menu-left',
								}
							: isHistoryOrderedProducts
								? {
										nextEl: '.history-menu-right',
										prevEl: '.history-menu-left',
									}
								: {
										nextEl: '.special-menu-right',
										prevEl: '.special-menu-left',
									}
					}
					breakpoints={
						isBestSeller
							? {
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
								}
							: isHistoryOrderedProducts
								? {
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
									}
								: {
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
									}
					}
					loop>
					{dishes.map((dish) => (
						<SwiperSlide key={dish.id} className='swiper-slide-custom'>
							<Link href={`/dishes/${dish.id}`}>
								<div className='relative cursor-pointer overflow-hidden rounded-lg swiper-slide-content'>
									<div className='image-container'>
										<Image
											src={getImagePath(dish.image)}
											alt={dish.name}
											layout='fill'
											className='object-cover'
										/>
									</div>
									<div className='text-container'>
										<div className='inline-flex h-full w-full items-end'>
											<div className='p-6'>
												<h5 className='mb-2 text-xl font-medium text-white'>{dish.name}</h5>
												<h5 className='mb-2 text-l font-medium text-white'>
													Số lượng: {dish.quantity}
												</h5>
												<h5 className='mb-2 text-xl font-semibold text-white'>
													<span className='text-base font-medium text-yellow-400'>
														{currentCurrency}&nbsp;
													</span>
													{dish.price}
												</h5>
												<Link
													href='/dishes'
													className='inline-flex items-center border-b border-dashed border-white text-white'>
													Order Now <LuChevronRight size={20} />
												</Link>
											</div>
										</div>
									</div>
								</div>
							</Link>
						</SwiperSlide>
					))}
				</Swiper>
			) : (
				<div className='no-products'>Không có sản phẩm nào</div>
			)}
		</>
	);
};

export default SpecialMenuSwiper;
