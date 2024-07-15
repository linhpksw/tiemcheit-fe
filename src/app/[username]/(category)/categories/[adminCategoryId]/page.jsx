'use client';
import { useEffect, useState } from 'react';
import { BreadcrumbAdmin, DishDataTable } from '@/components';
import { Authorization } from '@/components/security';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';
import { CategoryDataTable, DisableProductDetailView, InactiveProductDetailView } from '@/components/data-tables';
import { FilterProvider } from '@/context';
import { getProductAmountByStatusAndCategoryId, getCategoryById } from '@/helpers';
import { addCategory, deleteCategory, updateCategory } from '@/helpers';
import { AddCategoryModal } from '@/components';
import { ConfirmModal } from '@/components';
import { EditCategoryModal } from '@/components';

const categoryColumns = [
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
		key: 'inactiveProduct',
		name: 'Sắp kinh doanh',
	},
	{
		key: 'disabledProduct',
		name: 'Ngừng kinh doanh',
	},
];
const formData = {
	name: '',
	status: '',
	activeProduct: 0,
	inactiveProduct: 0,
	disabledProduct: 0,
};

const productColumns = [
	{
		key: 'image',
		name: 'Image',
	},
	{
		key: 'name',
		name: 'Dish Name',
	},
	{
		key: 'category_name',
		name: 'Category',
	},
	{
		key: 'price',
		name: 'Price',
	},
	{
		key: 'quantity',
		name: 'Quantity',
	},
	{
		key: 'createdAt',
		name: 'Created At(yyyy/mm/dd)',
	},
	{
		key: 'status',
		name: 'Status',
	},
];

const ProductCategoryList = () => {
	const { username, adminCategoryId } = useParams();
	const { user, isLoading } = useUser();
	const [activeTab, setActiveTab] = useState('all');
	const [activeAmount, setActiveAmount] = useState(0);
	const [inactiveAmount, setInactiveAmount] = useState(0);
	const [disabledAmount, setDisabledAmount] = useState(0);

	const [loading, setLoading] = useState(true);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const [confirmTitle, setConfirmTitle] = useState('');
	const [action, setAction] = useState(() => () => {});
	const [defaultCategory, setDefaultCategory] = useState({});
	const [flag, setFlag] = useState(false);

	const handleStatusChange = async (category, newStatus) => {
		try {
			const updatedCategory = {
				...category,
				status: newStatus,
			};

			await updateCategory(updatedCategory, category.id);
			setFlag(!flag);
		} catch (error) {
			console.error('Failed to update category status: ', error);
		}
	};

	//#region Handle Action
	const handleAdd = async (data) => {
		try {
			handleOpenConfirmModal('Are you sure to add the category?', async () => {
				formData.name = data.categoryName;
				formData.status = 'inactive';
				const res = await addCategory(formData);
				if (!res) {
					console.error('Failed to add category');
				}
				handleCloseAddModal();
				setFlag(!flag);
			});
		} catch (error) {
			console.error('Failed to save category: ', error);
		}
	};

	const handleDelete = async (category) => {
		try {
			const response = await deleteCategory(category.id);
			if (!response) {
				throw new Error('Failed to delete category');
			}
			setFlag(!flag);
		} catch (error) {
			console.error('Failed to delete category: ', error);
		}
	};

	const handleUpdate = async (data) => {
		try {
			handleOpenConfirmModal('Are you sure to update the category?', async () => {
				formData.name = data.categoryName;
				formData.status = defaultCategory.status;
				const res = await updateCategory(formData, defaultCategory.id);
				if (!res) {
					console.error('Failed to update category');
				}
				handleCloseEditModal();
				setFlag(!flag);
			});
		} catch (error) {
			console.error('Failed to update category: ', error);
		}
	};
	//#endregion

	//#region Handle Modal
	const handleOpenAddModal = (category) => {
		setDefaultCategory(category);
		setShowAddModal(true);
	};

	const handleCloseAddModal = () => {
		setShowAddModal(false);
	};

	const handleOpenEditModal = (category) => {
		setDefaultCategory(category);
		setShowEditModal(true);
	};

	const handleCloseEditModal = () => {
		setShowEditModal(false);
	};

	const handleOpenConfirmModal = (title, actionFunction) => {
		setConfirmTitle(title);
		setAction(() => actionFunction);
		setShowConfirmModal(true);
	};

	const handleCloseConfirmModal = () => {
		setShowConfirmModal(false);
	};
	//#endregion

	const handleConfirm = () => {
		action();
		handleCloseConfirmModal();
	};

	useEffect(() => {
		const fetchDataStatus = async () => {
			const activeAmountResponse = await getProductAmountByStatusAndCategoryId(adminCategoryId, 'active');
			const inactiveAmountResponse = await getProductAmountByStatusAndCategoryId(adminCategoryId, 'inactive');
			const disabledAmountResponse = await getProductAmountByStatusAndCategoryId(adminCategoryId, 'disabled');

			setActiveAmount(activeAmountResponse);
			setInactiveAmount(inactiveAmountResponse);
			setDisabledAmount(disabledAmountResponse);
		};

		try {
			setLoading(false);
			fetchDataStatus();
			fetchCategoryData();
		} catch (error) {
		} finally {
			setLoading(false);
		}
	}, [adminCategoryId, flag]);

	if (isLoading || loading) {
		return <div></div>;
	}

	return (
		<Authorization allowedRoles={['ROLE_ADMIN']} username={username}>
			<div className='w-full lg:ps-64'>
				<div className='page-content space-y-10 p-6'>
					<BreadcrumbAdmin title='Chi tiết loại sản phẩm' subtitle='Dishes' />
					<div className='rounded-lg border border-default-200 '>
						<CategoryDataTable
							adminCategoryId={adminCategoryId}
							user={user}
							columns={categoryColumns}
							setShowAddModal={setShowAddModal}
							setShowEditModal={setShowEditModal}
							setShowConfirmModal={setShowConfirmModal}
							setAction={setAction}
							handleOpenAddModal={handleOpenAddModal}
							handleStatusChange={handleStatusChange}
							handleOpenEditModal={handleOpenEditModal}
							handleDelete={handleDelete}
							handleOpenConfirmModal={handleOpenConfirmModal}
							flag={flag}
						/>
					</div>
					<div>
						<div className='tabs' style={{ display: 'flex', gap: '10px', marginBottom: '0px' }}>
							<button
								className={`tab ${activeTab === 'all' ? 'active' : ''}`}
								onClick={() => setActiveTab('all')}
								style={{
									padding: '10px 20px',
									cursor: 'pointer',
									border: '1px solid #ddd',
									borderRadius: '4px',
									backgroundColor: activeTab === 'all' ? '#fff' : '#f5f5f5',
									borderBottom: activeTab === 'all' ? 'none' : '',
									fontWeight: activeTab === 'all' ? 'bold' : 'normal',
								}}>
								Đang kinh doanh ({activeAmount})
							</button>
							<button
								className={`tab ${activeTab === 'inactive' ? 'active' : ''}`}
								onClick={() => setActiveTab('inactive')}
								style={{
									padding: '10px 20px',
									cursor: 'pointer',
									border: '1px solid #ddd',
									borderRadius: '4px',
									backgroundColor: activeTab === 'inactive' ? '#fff' : '#f5f5f5',
									borderBottom: activeTab === 'inactive' ? 'none' : '',
									fontWeight: activeTab === 'inactive' ? 'bold' : 'normal',
									marginLeft: '-1px', // Thêm margin âm để các nút chuyển tab nằm gần nhau hơn
								}}>
								Vừa được tạo ({inactiveAmount})
							</button>
							<button
								className={`tab ${activeTab === 'disabled' ? 'active' : ''}`}
								onClick={() => setActiveTab('disabled')}
								style={{
									padding: '10px 20px',
									cursor: 'pointer',
									border: '1px solid #ddd',
									borderRadius: '4px',
									backgroundColor: activeTab === 'disabled' ? '#fff' : '#f5f5f5',
									borderBottom: activeTab === 'disabled' ? 'none' : '',
									fontWeight: activeTab === 'disabled' ? 'bold' : 'normal',
									marginLeft: '-1px', // Thêm margin âm để các nút chuyển tab nằm gần nhau hơn
								}}>
								Ngừng kinh doanh ({disabledAmount})
							</button>
						</div>
						<FilterProvider>
							<div className='grid grid-cols-1'>
								{activeTab === 'all' && (
									<div className='rounded-lg border border-default-200 '>
										<DishDataTable
											user={user}
											categoryId={adminCategoryId}
											columns={productColumns}
											title='Dishes List'
											buttonLink={`/${username}/add-dish`}
											buttonText='Add Dish'
											setFlag={setFlag}
											flag={flag}
											handleOpenConfirmModal={handleOpenConfirmModal}
										/>
									</div>
								)}
								{activeTab === 'inactive' && (
									<div className='rounded-lg border border-default-200 '>
										<InactiveProductDetailView
											user={user}
											categoryId={adminCategoryId}
											columns={productColumns}
											title='Inactive Dishes'
											buttonLink={`/${username}/add-dish`}
											buttonText='Add Dish'
											setFlag={setFlag}
											flag={flag}
											handleOpenConfirmModal={handleOpenConfirmModal}
										/>
									</div>
								)}
								{activeTab === 'disabled' && (
									<div className='rounded-lg border border-default-200 '>
										<DisableProductDetailView
											user={user}
											categoryId={adminCategoryId}
											columns={productColumns}
											title='Disabled Dishes'
											buttonLink={`/${username}/add-dish`}
											buttonText='Add Dish'
											setFlag={setFlag}
											flag={flag}
											handleOpenConfirmModal={handleOpenConfirmModal}
										/>
									</div>
								)}
							</div>
						</FilterProvider>
					</div>
					<div id='modal-root'>
						<AddCategoryModal show={showAddModal} handleClose={handleCloseAddModal} onSubmit={handleAdd} />
						<EditCategoryModal
							show={showEditModal}
							handleClose={handleCloseEditModal}
							onSubmit={handleUpdate}
							defaultValue={defaultCategory}
						/>
						<ConfirmModal
							show={showConfirmModal}
							handleClose={handleCloseConfirmModal}
							onConfirm={handleConfirm}
							confirmationText={confirmTitle}
						/>
					</div>
				</div>
			</div>
		</Authorization>
	);
};

export default ProductCategoryList;
