'use client';
import { useState } from 'react';
import { BreadcrumbAdmin, DishDataTable } from '@/components';
import { Authorization } from '@/components/security';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks';
import { DisableProductDetailView, InactiveProductDetailView } from '@/components/data-tables';
import { FilterProvider } from '@/context';
import { getProductAmountByStatus } from '@/helpers';
import { useEffect } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal'; // Adjust the import path if necessary

const columns = [
    {
        key: 'image',
        name: 'Ảnh',
    },
    {
        key: 'name',
        name: 'Tên',
    },
    {
        key: 'category_name',
        name: 'Loại sản phẩm',
    },
    {
        key: 'price',
        name: 'Giá',
    },
    {
        key: 'quantity',
        name: 'Số lượng',
    },
    {
        key: 'createAt',
        name: 'Ngày tạo',
    },
    {
        key: 'status',
        name: 'Trạng thái',
    },
];

const ProductList = () => {
    const { username } = useParams();
    const { user, isLoading } = useUser();
    const [activeTab, setActiveTab] = useState('all');
    const [activeAmount, setActiveAmount] = useState(0);
    const [inactiveAmount, setInactiveAmount] = useState(0);
    const [disabledAmount, setDisabledAmount] = useState(0);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [action, setAction] = useState(() => () => { });

    const [flag, setFlag] = useState(false);

    useEffect(() => {
        const fetchDataStatus = async () => {
            const activeAmountResponse = await getProductAmountByStatus('active');
            const inactiveAmountResponse = await getProductAmountByStatus('inactive');
            const disabledAmountResponse = await getProductAmountByStatus('disabled');

            setActiveAmount(activeAmountResponse);
            setInactiveAmount(inactiveAmountResponse);
            setDisabledAmount(disabledAmountResponse);
        };

        try {
            fetchDataStatus();
            fetchCategoryData();
        } catch (error) {
            console.error('Failed to fetch data: ', error);
        }
    }, [flag]);

    if (isLoading) {
        return <div></div>;
    }

    const handleOpenConfirmModal = (title, actionFunction) => {
        setConfirmTitle(title);
        setAction(() => actionFunction);
        setShowConfirmModal(true);
    };

    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
    };

    const handleConfirm = () => {
        action();
        handleCloseConfirmModal();
    };

    return (
        <Authorization allowedRoles={['ROLE_ADMIN']} username={username}>
            <div className='w-full lg:ps-64'>
                <div className='page-content space-y-6 p-6'>
                    <BreadcrumbAdmin title='Sản phẩm' subtitle='Dishes' />
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
                                    backgroundColor: activeTab === 'all' ? 'bg-primary' : 'bg-default-200',
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
                                    backgroundColor: activeTab === 'inactive' ? 'bg-primary' : 'bg-default-200',
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
                                    backgroundColor: activeTab === 'disabled' ? 'bg-primary' : 'bg-default-200',
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
                                            columns={columns}
                                            // title='Dishes List'
                                            buttonLink={`/${username}/add-dish`}
                                            buttonText='Thêm món ăn'
                                            setActiveAmount={setActiveAmount}
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
                                            columns={columns}
                                            // title='Inactive Dishes'
                                            buttonLink={`/${username}/add-dish`}
                                            buttonText='Thêm món ăn'
                                            setInactiveAmount={setInactiveAmount}
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
                                            columns={columns}
                                            // title='Disabled Dishes'
                                            buttonLink={`/${username}/add-dish`}
                                            buttonText='Thêm món ăn'
                                            setDisabledAmount={setDisabledAmount}
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

export default ProductList;
