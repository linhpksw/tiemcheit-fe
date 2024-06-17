'use client';
import { Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import { LuAlertCircle } from 'react-icons/lu';
import { cn } from '@/utils';

const SelectFormInput = ({
    control,
    id,
    name,
    label,
    value,
    className,
    labelClassName,
    containerClassName,
    noValidate,
    fullWidth,
    placeholder,
    options,
    onChange,
    defaultValue,
    ...other
}) => {
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue ? defaultValue.value : ''}
            render={({ field, fieldState }) => (
                <div className={containerClassName}>
                    {label && (
                        <label
                            htmlFor={id ?? name}
                            className={cn('mb-2 block text-sm font-medium text-default-900', labelClassName)}>
                            {label}
                        </label>
                    )}
                    <div className='relative'>
                        <ReactSelect
                            {...field}
                            {...other}
                            options={options}
                            placeholder={placeholder}
                            classNamePrefix={'react-select'}
                            unstyled
                            id={id ?? name}
                            value={options.find((option) => option.value === value) || ''}
                            className={cn(
                                'block w-full cursor-pointer rounded-lg border border-default-200 bg-transparent focus-within:border focus-within:border-primary dark:bg-default-50',
                                className,
                                fullWidth && 'w-full',
                                {
                                    'border-red-500 focus:border-red-500': !noValidate && fieldState.error?.message,
                                }
                            )}
                            onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value);
                                onChange && onChange(selectedOption);
                            }}
                        />

                        {!noValidate && fieldState.error?.message && (
                            <div className='pointer-events-none absolute end-12 top-1/2 flex -translate-y-1/2 items-center'>
                                <LuAlertCircle size={20} className='text-red-500' />
                            </div>
                        )}
                    </div>
                    {!noValidate && fieldState.error?.message && (
                        <p className='mt-2 text-xs text-red-600'>{fieldState.error.message}</p>
                    )}
                </div>
            )}
        />
    );
};

export default SelectFormInput;
