'use client';
import { BreadcrumbAdmin, CategoryDataTable } from '@/components';

import { Authorization } from '@/components/security';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';

const columns = [
	{
		key: 'id',
		name: 'STT',
	},
	{
		key: 'name',
		name: 'Loại sản phẩm',
	},
	{
		key: 'status',
		name: 'Trạng thái',
	},
	{
		key: 'activeProduct',
		name: 'Đang kinh doanh',
	},
	{
		key: 'disabledProduct',
		name: 'Ngừng kinh doanh',
	},
	{
		key: 'inactiveProduct',
		name: 'Sắp kinh doanh',
	},
];
const CategoryList = () => {
	const { username } = useParams();
	const { user, isLoading } = useUser();

	if (isLoading) {
		return <div></div>;
	}

	return (
		<Authorization allowedRoles={['ROLE_ADMIN']} username={username}>
			<div className='w-full lg:ps-64'>
				<div className='page-content space-y-6 p-6'>
					<BreadcrumbAdmin title='Danh sách các loại sản phẩm' subtitle='Các loại sản phẩm' />

					<div className='grid grid-cols-1'>
						<div className='rounded-lg border border-default-200'>
							<CategoryDataTable
								user={user}
								columns={columns}
								title='Danh sách nguyên liệu'
								buttonText='Thêm loại sản phẩm'
							/>
						</div>
					</div>
				</div>
			</div>
		</Authorization>
	);
};

export default CategoryList;
