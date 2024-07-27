'use client';
import BillingInformationForm from './BillingInformationForm';
import { Breadcrumb } from '@/components';
import { useShoppingContext } from '@/context';
import { useUser } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCookie } from '@/helpers';
import { usePathname } from 'next/navigation';

const Checkout = () => {
	const accessToken = getCookie('accessToken');
	const router = useRouter();
	const pathname = usePathname();

	if (!accessToken) {
		const loginUrl = `/auth/login?redirectTo=${encodeURIComponent(pathname)}`;
		router.push(loginUrl);
		return;
	}

	const { user, isLoading } = useUser();

	const { cartItems, fetchCartData } = useShoppingContext();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch the cart items
		const loadCartItems = async () => {
			await fetchCartData();
			setLoading(false);
		};

		console.log('lmao');
		loadCartItems();
	}, []);

	useEffect(() => {
		// Check if cartItems is empty and loading is complete
		if (!loading && cartItems.length === 0) {
			router.push('/');
		}
	}, [loading, cartItems]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<Breadcrumb title='Đặt hàng' subtitle='Đơn hàng' />
			<section className='py-6 lg:py-10'>
				<div className='container'>
					<BillingInformationForm user={user} />
				</div>
			</section>
		</>
	);
};

export default Checkout;
