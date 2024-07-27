'use client';
import BillingInformationForm from './BillingInformationForm';
import { Breadcrumb } from '@/components';
import { useShoppingContext } from '@/context';
import { useUser } from '@/hooks';
import { useRouter } from 'next/navigation';

const Checkout = () => {
	const router = useRouter();

	const { user, isLoading } = useUser();

	const { cartItems } = useShoppingContext();

	if (cartItems.length === 0) {
		router.push('/');
	}

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
