'use client';
import { set, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactQuill from 'react-quill';
import { LuEraser, LuSave } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import Checkbox from '@/components/Checkbox';
import { DateFormInput, SelectFormInput, TextAreaFormInput, TextFormInput, DiscountTextFormInput } from '@/components';

import 'react-quill/dist/quill.snow.css';
import Datepicker from 'react-tailwindcss-datepicker';
import { robustFetch } from '@/helpers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const AddCouponForm = () => {
    Yup.addMethod(Yup.string, 'name', function (message) {
        return this.test('name', message, function (value) {
            const { path, createError } = this;
            const regex = /^[a-zA-Z0-9 ]+$/;
            const trimmedValue = value.trim();
            const hasLeadingOrTrailingSpaces = value !== trimmedValue;
            const hasMultipleSpacesBetweenWords = /\s{2,}/.test(trimmedValue);
            return !hasLeadingOrTrailingSpaces &&
                !hasMultipleSpacesBetweenWords &&
                trimmedValue.length >= 4 &&
                trimmedValue.length <= 64 &&
                regex.test(trimmedValue)
                ? true
                : createError({ path, message: message || 'Tên không hợp lệ' });
        });
    });
    Yup.addMethod(Yup.string, 'code', function (message) {
        return this.test('code', message, function (value) {
            const { path, createError } = this;
            const regex = /^[A-Z0-9]+$/;
            const trimmedValue = value.trim();
            const hasLeadingOrTrailingSpaces = value !== trimmedValue;

            return !hasLeadingOrTrailingSpaces &&
                trimmedValue.length >= 4 &&
                trimmedValue.length <= 64 &&
                regex.test(trimmedValue)
                ? true
                : createError({ path, message: message || 'Mã không hợp lệ' });
        });
    });
    Yup.addMethod(Yup.string, 'integerInRange', function (min, max, message) {
        return this.test('integerInRange', message, function (value) {
            const { path, createError } = this;
            const regex = /^\d+$/; // Regex to ensure the string contains only digits
            const isValidInteger = regex.test(value);
            const intValue = parseInt(value, 10);

            return isValidInteger && intValue >= min && intValue <= max
                ? true
                : createError({ path, message: message || `Value must be an integer between ${min} and ${max}` });
        });
    });
    Yup.addMethod(Yup.string, 'valueFixedValidation', function (valueType) {
        return this.test('valueFixedValidation', function (value) {
            const { path, createError, parent } = this;
            const regex = /^[0-9]+(\.[0-9]+)?$/; // Regex to ensure the string is a valid number
            const numberValue = parseFloat(value);

            if (!regex.test(value)) {
                return createError({ path, message: 'Value must be a valid number' });
            }

            if (numberValue < 0) {
                return createError({ path, message: 'Value must be greater than or equal to 0' });
            }

            if (parent.valueType === 'percent' && numberValue > 100) {
                return createError({ path, message: 'Value must be less than or equal to 100' });
            }

            return true;
        });
    });
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Vui lòng nhập tên').name('Vui lòng nhập tên hợp lệ'),
        code: Yup.string().required('Vui lòng nhập mã').code('Vui lòng nhập mã hợp lệ'),
        dateExpired: Yup.date()
            .nullable() // Allow null values
            //.transform((value, originalValue) => (originalValue === '' ? null : value))
            .required('Date Expired is required'),
        dateValid: Yup.date()
            .nullable() // Allow null values
            //.transform((value, originalValue) => (originalValue === '' ? null : value))
            .required('Date Valid is required'),
        description: Yup.string().required('Vui lòng nhập mô tả'),
        limitAccountUses: Yup.string()
            .required('Limit Account Uses is required')
            .integerInRange(1, Infinity, 'Limit Account Uses must be greater than or equal to 1'),
        limitUses: Yup.string()
            .required('Limit Uses is required')
            .integerInRange(1, Infinity, 'Limit Uses must be greater than or equal to 1'),

        type: Yup.string().required('Discount Type is required'),
        type2: Yup.string(),
        typeItem: Yup.string().when('type', {
            is: (type) => type === 'category',
            then: () => Yup.string().required('Item is required'),
        }),
        valueType: Yup.string().required('Value Type is required'),
        valueFixed: Yup.string().required('Value is required').valueFixedValidation('valueType'),
    });
    const formData = {
        name: '',
        code: '',
        dateExpired: '',
        dateValid: '',
        description: '',
        limitAccountUses: 0,
        limitUses: 0,
        discounts: [
            {
                type: '',
                typeItem: '',
                valueType: '',
                valueFixed: '',
            },
        ],
    };
    const handleFormDataChange = (e) => {
        // const { name, value } = e;
        // setFormData((prevState) => ({
        //     ...prevState,
        //     [name]: value,
        // }));
    };
    const { control, handleSubmit, reset } = useForm({ resolver: yupResolver(validationSchema) });

    const [discounts, setDiscounts] = useState({
        type: '',
        typeItem: '',
        valueType: '',
        valueFixed: '',
    });

    const handleDiscountChange = (e, name) => {
        setDiscounts({ ...discounts, [name]: e });
    };
    // const addDiscount = () => {
    //     setDiscounts((prevDiscounts) => [...prevDiscounts, { type: '', typeItem: '', valueType: '', valueFixed: '' }]);
    // };
    // const removeDiscount = (index) => {
    //     const updatedDiscounts = [...discounts];
    //     updatedDiscounts.splice(index, 1); // Remove the discount at the specified index
    //     console.log(updatedDiscounts);
    //     setDiscounts(updatedDiscounts);
    // };
    //form submit
    const onSubmit = async (data) => {
        try {
            formData.name = data.name;
            formData.code = data.code;
            formData.dateValid = data.dateValid;
            formData.dateExpired = data.dateExpired;
            formData.description = data.description;
            formData.limitAccountUses = data.limitAccountUses;
            formData.limitUses = data.limitUses;
            formData.discount.type = data.type;
            if (data.typeItem) formData.discount.typeItem = data.typeItem;
            formData.discount.valueType = data.valueType;
            formData.discount.valueFixed = data.valueFixed;

            console.log('Valid form data:', formData);
            const response = await robustFetch(`${BASE_URL}/coupons`, 'POST', 'Thêm mã giảm giá thành công', formData);
            // Proceed with form submission logic here
            // Example: await addCoupon(data);
            //reset(); // Optionally reset the form after successful submission
        } catch (error) {
            console.error('Submission Error:', error);
        }
    };

    return (
        <div className=''>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='rounded-lg border border-default-200 p-6'>
                    <div className='grid gap-6 lg:grid-cols-2'>
                        <div className='space-y-6'>
                            <TextFormInput
                                name='name'
                                type='text'
                                label='Coupon Name'
                                placeholder='Coupon Name'
                                control={control}
                                onChange={handleFormDataChange}
                                fullWidth
                            />

                            <TextFormInput
                                name='code'
                                type='text'
                                label='Coupon Code'
                                placeholder='Coupon Code'
                                control={control}
                                fullWidth
                            />

                            <div className='grid gap-6 lg:grid-cols-2'>
                                <div>
                                    <DateFormInput
                                        name='dateValid'
                                        type='date'
                                        label='Date Valid'
                                        className='block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50'
                                        placeholder='Date Valid'
                                        options={{
                                            dateFormat: 'd/m/Y',
                                            enableTime: false,
                                        }}
                                        fullWidth
                                        control={control}
                                    />
                                </div>
                                <div>
                                    <DateFormInput
                                        name='dateExpired'
                                        type='date'
                                        label='Date Expired'
                                        className='block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50'
                                        placeholder='Date Expire'
                                        options={{
                                            dateFormat: 'd/m/Y',
                                            enableTime: false,
                                        }}
                                        fullWidth
                                        control={control}
                                    />
                                </div>
                            </div>

                            <TextAreaFormInput
                                name='description'
                                label='Description'
                                placeholder='Description'
                                rows={5}
                                control={control}
                                fullWidth
                            />
                            <TextFormInput
                                name='limitAccountUses'
                                type='text'
                                label='Limit Account Uses'
                                placeholder='Limit Account Uses'
                                control={control}
                                fullWidth
                            />
                            <TextFormInput
                                name='limitUses'
                                type='text'
                                label='Limit Uses'
                                placeholder='Limit Uses'
                                control={control}
                                fullWidth
                            />
                        </div>
                        <div className=''>
                            <label className='mb-2 block text-sm font-medium text-default-900'>Discounts</label>

                            <div className='rounded-lg border border-default-200 p-6 mb-4'>
                                <div className='grid gap-6 lg:grid-cols-2'>
                                    <SelectFormInput
                                        label='Type:'
                                        name={`type`}
                                        control={control}
                                        onChange={(e) => handleDiscountChange(e, 'type')}
                                        //value={discounts.type}
                                        options={[
                                            { value: 'category', label: 'Category' },
                                            // { value: 'product', label: 'Product' },
                                            { value: 'total', label: 'Total' },
                                            { value: 'shipping', label: 'Shipping' },
                                        ]}
                                    />

                                    {discounts.type === 'category' && (
                                        <SelectFormInput
                                            label='Item of type:'
                                            name={`typeItem`}
                                            control={control}
                                            //onChange={(e) => handleDiscountChange(index, e, 'typeItem')}
                                            //value={discounts.typeItem}
                                            options={[
                                                { value: 'category', label: 'Category' },
                                                { value: 'product', label: 'Product' },
                                            ]}
                                        />
                                    )}
                                    <SelectFormInput
                                        label='Value Type:'
                                        name={`valueType`}
                                        control={control}
                                        //onChange={(e) => handleDiscountChange(e, 'valueType')}
                                        //value={discounts.valueType}
                                        options={[
                                            { value: 'percent', label: 'Percent' },
                                            { value: 'fixed', label: 'Fixed' },
                                        ]}
                                    />

                                    <DiscountTextFormInput
                                        name={`valueFixed`}
                                        type='text'
                                        label='Value:'
                                        placeholder='Value'
                                        control={control}
                                        //value={discounts.valueFixed}
                                        //onChange={(e) => handleDiscountChange(e.target.value, 'valueFixed')}
                                        fullWidth
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <div className='flex flex-wrap items-center justify-end gap-4'>
                        <div className='flex flex-wrap items-center gap-4'>
                            <button
                                type='reset'
                                onClick={() => {
                                    handleDiscountChange(null, 'type');
                                    reset();
                                }}
                                className='flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-6 py-2.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white'>
                                <LuEraser size={20} />
                                Clear
                            </button>
                            <button
                                type='submit'
                                className='flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500'>
                                <LuSave size={20} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddCouponForm;
