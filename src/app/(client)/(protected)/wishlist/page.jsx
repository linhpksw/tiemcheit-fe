import { Breadcrumb } from '@/components';
import AllWishList from './AllWishList';

export const metadata = {
	title: 'Wishlist',
};

const Wishlist = () => {
	return (
		<>
			<Breadcrumb title="Danh sách yêu thích" />
			<section className="py-6 lg:py-10">
				<div className="container">
					<div className="divide-y divide-default-200 overflow-hidden rounded-lg border border-default-200 ">
						<AllWishList />
					</div>
				</div>
			</section>
		</>
	);
};

export default Wishlist;
