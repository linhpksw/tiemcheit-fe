'use client';
import { BreadcrumbAdmin, CategoryDataTable } from '@/components';
import { AddCategoryModal } from '@/components';
import { ConfirmModal } from '@/components';
import { EditCategoryModal, SelectModal } from '@/components';
import { Authorization } from '@/components/security';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';
import { useEffect, useState } from 'react';
import { addCategory, deleteCategory, updateCategory, updateCategoryStatus } from '@/helpers';

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

const formData = {
	name: '',
	status: '',
	activeProduct: 0,
	inactiveProduct: 0,
	disabledProduct: 0,
};

const filter = {
	categories: 0,
	status: '',
};
const CategoryList = () => {
	const { username } = useParams();
	const { user, isLoading } = useUser();
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showSelectModal, setShowSelectModal] = useState(false);

	const [confirmTitle, setConfirmTitle] = useState('');
	const [action, setAction] = useState(() => () => {});
	const [defaultCategory, setDefaultCategory] = useState({});
	const [flag, setFlag] = useState(false);
	const [loading, setLoading] = useState(true);

	const [firstAction, setFirstAction] = useState(() => () => {});
	const [secondAction, setSecondAction] = useState(() => () => {});

	const handleStatusChange = async (category, newStatus) => {
		try {
			if (newStatus === 'disabled') {
				await updateCategoryStatus(category.id, 'disabled', 'all');
			} else if (newStatus === 'active') {
				handleOpenSelectModal(
					'Are you sure to activate all products?',
					async () => {
						try {
							setLoading(true);
							console.log('Activate all products');
							await updateCategoryStatus(category.id, 'active', 'all');
							handleCloseEditModal();
						} catch (error) {
						} finally {
							setFlag(!flag);
							setLoading(false);
						}
					},
					async () => {
						try {
							setLoading(true);
							console.log('Restore previous status');
							await updateCategoryStatus(category.id, 'active', 'restore');
							handleCloseEditModal();
						} catch (error) {
						} finally {
							setFlag(!flag);
							setLoading(false);
						}
					}
				);
			}
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
	const handleOpenSelectModal = (title, firstAction, secondAction) => {
		setConfirmTitle(title);
		setFirstAction(() => firstAction);
		setSecondAction(() => secondAction);
		setShowSelectModal(true);
	};

	const handleCloseSelectModal = () => {
		setShowSelectModal(false);
	};

	const handleFirstConfirm = () => {
		firstAction();
		handleCloseSelectModal();
	};
	const handleSecondConfirm = () => {
		secondAction();
		handleCloseSelectModal();
	};

	useEffect(() => {
		setLoading(false);
	}, [flag]);

	if (isLoading || loading) {
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
								buttonText='Thêm loại sản phẩm'
								setShowAddModal={setShowAddModal}
								setShowEditModal={setShowEditModal}
								setShowConfirmModal={setShowConfirmModal}
								setAction={setAction}
								handleOpenAddModal={handleOpenAddModal}
								handleOpenEditModal={handleOpenEditModal}
								handleDelete={handleDelete}
								handleStatusChange={handleStatusChange}
								handleOpenConfirmModal={handleOpenConfirmModal}
								flag={flag}
							/>
							<div id='modal-root'>
								<AddCategoryModal
									show={showAddModal}
									handleClose={handleCloseAddModal}
									onSubmit={handleAdd}
								/>
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
								<SelectModal
									show={showSelectModal}
									handleClose={handleCloseSelectModal}
									onFirstConfirm={handleFirstConfirm}
									onSecondConfirm={handleSecondConfirm}
									confirmationText={confirmTitle}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Authorization>
	);
};

export default CategoryList;
