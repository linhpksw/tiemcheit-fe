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

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    code: Yup.string().required('Code is required'),
    dateExpired: Yup.date().required('Date Expired is required'),
    dateValid: Yup.date().required('Date Valid is required'),
    description: Yup.string().required('Description is required'),
    limitAccountUses: Yup.number().integer().min(1, 'Limit Account Uses must be greater than or equal to 1'),
    limitUses: Yup.number().integer().min(1, 'Limit Uses must be greater than or equal to 1'),

    discounts: Yup.array().of(
        Yup.object().shape({
            type: Yup.string().required('Discount Type is required'),
            type2: Yup.string(),
            typeItem: Yup.string().when('type', {
                is: (type) => type === 'category' || type === 'product',
                then: () => Yup.string().required('Item is required'),
            }),
            valueType: Yup.string().required('Value Type is required'),
            valueFixed: Yup.number()
                .required('Value is required')
                .min(0, 'Value must be greater than or equal to 0')
                .when('valueType', {
                    is: 'percent',
                    then: () => Yup.number().max(100),
                    otherwise: () => Yup.number(),
                }),
        })
    ),
});
const AddCouponForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        active: true,
        code: '',
        currency: 'USD',
        dateCreated: '',
        dateExpired: '',
        dateValid: '',
        description: '',
        discountGroup: '',
        limitAccountUses: 0,
        limitCodeUses: 0,
        limitUses: 0,
        multiCodes: false,
        useCount: 0,
    });
    const handleFormDataChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const { control, handleSubmit, reset } = useForm({ resolver: yupResolver(validationSchema) });

    const [discounts, setDiscounts] = useState([
        {
            type: '',
            typeItem: '',
            valueType: '',
            valueFixed: '',
        },
    ]);

    const handleDiscountChange = (index, e, name) => {
        const updatedDiscounts = [...discounts];
        updatedDiscounts[index] = { ...updatedDiscounts[index], [name]: e };
        setDiscounts(updatedDiscounts);
    };
    const addDiscount = () => {
        setDiscounts((prevDiscounts) => [...prevDiscounts, { type: '', typeItem: '', valueType: '', valueFixed: '' }]);
    };
    const removeDiscount = (index) => {
        const updatedDiscounts = [...discounts];
        updatedDiscounts.splice(index, 1); // Remove the discount at the specified index
        console.log(updatedDiscounts);
        setDiscounts(updatedDiscounts);
    };
    //form submit
    const onSubmit = async (data) => {
        try {
            //await validationSchema.validate(data, { abortEarly: false }); // Validate with Yup schema
            console.log('Valid form data:', data);
            const response = robustFetch(`${BASE_URL}/coupons`, 'POST', null, data);
            // Proceed with form submission logic here
            // Example: await addCoupon(data);
            //reset(); // Optionally reset the form after successful submission
        } catch (error) {
            if (error.name === 'ValidationError') {
                console.error('Validation Error:', error.errors);
            } else {
                console.error('Submission Error:', error);
            }
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
                            {discounts.map((discount, index) => (
                                <div className='rounded-lg border border-default-200 p-6 mb-4'>
                                    <div key={index} className='grid gap-6 lg:grid-cols-2'>
                                        <SelectFormInput
                                            label='Type:'
                                            name={`discounts[${index}].type`}
                                            control={control}
                                            onChange={(e) => handleDiscountChange(index, e, 'type')}
                                            value={discount.type}
                                            options={[
                                                { value: 'category', label: 'Category' },
                                                { value: 'product', label: 'Product' },
                                                { value: 'total', label: 'Total' },
                                                { value: 'shipping', label: 'Shipping' },
                                            ]}
                                        />

                                        {(discount.type === 'category' || discount.type === 'product') && (
                                            <SelectFormInput
                                                label='Item of type:'
                                                name={`discounts[${index}].typeItem`}
                                                control={control}
                                                onChange={(e) => handleDiscountChange(index, e, 'typeItem')}
                                                value={discount.typeItem}
                                                options={[
                                                    { value: 'category', label: 'Category' },
                                                    { value: 'product', label: 'Product' },
                                                ]}
                                            />
                                        )}
                                        <SelectFormInput
                                            label='Value Type:'
                                            name={`discounts[${index}].valueType`}
                                            control={control}
                                            onChange={(e) => handleDiscountChange(index, e, 'valueType')}
                                            value={discount.valueType}
                                            options={[
                                                { value: 'percent', label: 'Percent' },
                                                { value: 'fixed', label: 'Fixed' },
                                            ]}
                                        />

                                        <DiscountTextFormInput
                                            name={`discounts[${index}].valueFixed`}
                                            type='text'
                                            label='Value:'
                                            placeholder='Value'
                                            control={control}
                                            value={discount.valueFixed}
                                            onChange={(e) => handleDiscountChange(index, e.target.value, 'valueFixed')}
                                            fullWidth
                                        />
                                        <div className='col-span-2 flex items-center justify-end'>
                                            <button
                                                type='button'
                                                onClick={() => removeDiscount(index)}
                                                className=' gap-2 rounded-lg bg-red-500/10 px-6 py-2.5 text-center text-sm font-semibold text-red-500 shadow-sm transition-colors duration-200 hover:bg-red-500 hover:text-white'>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className='flex justify-center'>
                                <button
                                    type='button'
                                    onClick={addDiscount}
                                    className='flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500'>
                                    Add Discount
                                </button>
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
                                    reset();
                                    setSelectedIngredients([]);
                                    setIsCheckAll(false);
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
