"use client"
import React from 'react';
import { ProductTextFormInput } from '../form';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
    categoryName: yup.string().required('Loại sản phẩm không được để trống'),
});

const AddCategoryModal = ({ show, handleClose, onSubmit }) => {
    if (!show) return null;

    const { handleSubmit, control, errors } = useForm({
        resolver: yupResolver(schema),
    });

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='bg-white p-6 rounded shadow-lg w-96'>
                    <h2 className='text-xl mb-4'>Thêm loại sản phẩm mới</h2>
                    <ProductTextFormInput
                        name='categoryName'
                        type='text'
                        label='Nhập loại sản phẩm mới'
                        placeholder='Loại sản phẩm mới'
                        control={control}
                        fullWidth
                    />
                    <div className='flex justify-end space-x-4 mt-4'>
                        <button
                            type='button'
                            onClick={handleClose}
                            className='cursor-pointer transition-colors hover:text-white hover:bg-gray-500 rounded px-5 py-2 text-sm font-medium text-gray-500 border border-gray-500'>
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='cursor-pointer transition-colors hover:text-white hover:bg-green-500 rounded px-6 py-2 text-sm font-medium text-green-500 border border-green-500'>
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddCategoryModal;
