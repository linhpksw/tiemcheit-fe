'use client';
import { Controller } from 'react-hook-form';
import { LuAlertCircle } from 'react-icons/lu';
import { cn } from '@/utils';

const TextAreaFormInput = ({
    control,
    name,
    label,
    className,
    labelClassName,
    containerClassName,
    noValidate,
    fullWidth,
    rows,
    value,
    onChange,
    defaultValue,
    ...other
}) => {
    return (
        <Controller
            control={control}
            defaultValue={defaultValue}
            render={({ field, fieldState }) => (
                <div className={cn(containerClassName, 'relative', fullWidth && 'w-full')}>
                    {label && (
                        <label
                            className={cn('mb-2 block text-sm font-medium text-default-900', labelClassName)}
                            htmlFor={name}>
                            {label}
                        </label>
                    )}
                    <div className={cn('relative', fullWidth && 'w-full')}>
                        <textarea
                            {...other}
                            {...field}
                            rows={rows ?? 3}
                            className={cn(
                                'rounded-lg border border-default-200 px-4 py-2.5 dark:bg-default-50',
                                className,
                                fullWidth && 'w-full',
                                {
                                    'border-red-500 focus:border-red-500': !noValidate && fieldState.error?.message,
                                }
                            )}
                            //value={value}
                            onChange={(e) => {
                                field.onChange(e); // Propagate onChange event to react-hook-form's Controller
                                if (onChange) onChange(e); // Call onChange prop if provided
                            }}
                        />
                        {!noValidate && fieldState.error?.message && (
                            <div className='pointer-events-none absolute inset-y-0 end-4 flex items-center'>
                                <LuAlertCircle size={20} className='text-red-500' />
                            </div>
                        )}
                    </div>
                    {!noValidate && fieldState.error?.message && (
                        <p className='mt-2 text-xs text-red-600'>{fieldState.error.message}</p>
                    )}
                </div>
            )}
            name={name}
        />
    );
};
export default TextAreaFormInput;
