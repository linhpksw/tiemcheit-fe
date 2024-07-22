'use client';
import Image from 'next/image';
import { LuClock3 } from 'react-icons/lu';
import { circleLineHomeImg, arrowHomeImg, heroHomeImg } from '@/assets/data/images';
import { Navbar, Footer, FooterLinks, SpecialMenu } from '@/components';
import { useState, useEffect } from 'react';
import { getActiveStatusCategory } from '@/helpers';
import Link from 'next/link';
import { Authorization } from '@/components/security';

export default function Home() {

    const [categoriesData, setCategoriesData] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getActiveStatusCategory();
                setCategoriesData(response ? response : []);
            } catch (error) {
                console.log('Error in fetching categories: ', error.message);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Authorization notAllowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
            <Navbar />

            <section className='relative'>
                <div className='absolute inset-0 bg-gradient-to-l from-orange-600/20 via-orange-600/5 to-orange-600/0 blur-[60px]' />

                <div className='container relative'>
                    <div className='grid items-center lg:grid-cols-2'>
                        <div className='px-10 py-10'>
                            <div className='z-10 order-last flex items-center justify-center lg:order-first lg:justify-start'>
                                <div className='text-center lg:text-start'>
                                    <div className='mb-5 text-4xl font-bold capitalize text-default-950 tracking-wide md:text-6xl/snug lg:text-7xl/normal'>
                                        Chè IT
                                        <div className='text-2xl  font-bold  tracking-wide md:text-3xl lg:text-4xl'>
                                            <span className='text-primary'>hương vị</span> ngọt ngào - mát lạnh
                                            <br />
                                            <span className='text-primary'>đậm đà</span> tình&nbsp;
                                            <span className='relative inline-flex'>
                                                <span>quê hương</span>
                                                <Image
                                                    src={circleLineHomeImg}
                                                    width={282}
                                                    height={90}
                                                    alt='circle'
                                                    className='absolute -z-10 hidden h-full w-full lg:flex'
                                                />
                                            </span>
                                            !
                                        </div>
                                    </div>
                                    <p className='mx-auto mb-8 text-lg font-medium text-default-700 md:max-w-md lg:mx-0'>
                                        "Ngọt ngào từ thiên nhiên, mát lạnh trong từng ly!"
                                    </p>

                                    <div className='mt-10 flex flex-wrap items-center justify-center gap-5 lg:justify-normal'>
                                        <Link href="/dishes">
                                            <button className='rounded-full bg-primary px-10 py-5 font-medium text-white transition-all hover:bg-primary-600'>
                                                Gọi món ngay
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='relative flex items-center justify-center py-10'>
                            <span className='absolute start-0 top-0 -rotate-[40deg] text-3xl'>🔥</span>
                            <span className='absolute end-[10%] top-0 inline-flex h-14 w-14 -rotate-12 items-center justify-center rounded-lg bg-yellow-400 text-white'>
                                <LuClock3 size={24} />
                            </span>
                            <span className='absolute end-0 top-1/4 inline-flex h-4 w-4 -rotate-12 items-center justify-center rounded bg-primary text-white' />
                            <div className='absolute -end-0 bottom-1/4 hidden md:block lg:hidden xl:block 2xl:-end-24'>
                                <Image src={arrowHomeImg} alt='arrow' height={169} width={84} />
                            </div>

                            <span className='absolute bottom-0 end-0 inline-flex h-4 w-4 -rotate-12 items-center justify-center rounded-full bg-primary text-white' />
                            <span className='absolute -bottom-16 end-1/3 text-3xl'>🔥</span>

                            <Image src={heroHomeImg} width={497} height={537} alt='hero' className='mx-auto' priority />
                        </div>
                    </div>
                </div>
            </section>

            <SpecialMenu categoriesData={categoriesData} />

            <FooterLinks />

            <Footer />
        </Authorization>
    );
}
