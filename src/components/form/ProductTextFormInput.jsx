"use client";
import { Controller } from "react-hook-form";
import { LuAlertCircle } from "react-icons/lu";
import { cn } from "@/utils";

const ProductTextFormInput = ({
    control,
    id,
    name,
    label,
    className,
    labelClassName,
    containerClassName,
    noValidate,
    fullWidth,
    startInnerIcon,
    endButtonIcon,
    ...other
}) => {
    return (
        <Controller
            control={control}
            defaultValue={""}
            render={({ field, fieldState }) => (
                <div
                    className={cn(containerClassName, "relative", {
                        "max-w-full": fullWidth,
                    })}
                >
                    {label && (
                        <label
                            className={cn(
                                "mb-2 block text-sm font-medium text-default-900",
                                labelClassName
                            )}
                            htmlFor={name}
                        >
                            {label}
                        </label>
                    )}
                    <div className={cn("relative", fullWidth && "max-w-full")}>
                        <input
                            {...other}
                            {...field}
                            id={id ?? name}
                            className={cn(
                                "form-input focus:border-primary rounded-lg border border-default-200 px-4 py-2.5 dark:bg-default-50",
                                { "ps-10": startInnerIcon },
                                { "pe-14": endButtonIcon },
                                { "w-full": fullWidth },
                                {
                                    "border-red-500 focus:border-red-500":
                                        !noValidate && fieldState.error?.message,
                                },
                                className
                            )}
                        />

                        {startInnerIcon && (
                            <span className="absolute start-3 top-1/2 -translate-y-1/2">
                                {startInnerIcon}
                            </span>
                        )}

                        {endButtonIcon && (
                            <button
                                type="submit"
                                className="absolute end-0 top-1/2 inline-flex h-[2.875rem] w-[2.875rem] flex-shrink-0 -translate-y-1/2 items-center justify-center rounded-e-md border border-transparent bg-primary text-sm font-semibold text-white transition-all hover:bg-primary-600"
                            >
                                {endButtonIcon}
                            </button>
                        )}

                        {!noValidate && fieldState.error?.message && (
                            <div
                                className={cn(
                                    "pointer-events-none absolute inset-y-0 flex items-center",
                                    endButtonIcon ? "end-14" : "end-4"
                                )}
                            >
                                <LuAlertCircle size={20} className="text-red-500" />
                            </div>
                        )}
                    </div>
                    {!noValidate && fieldState.error?.message && (
                        <p className="mt-2 text-xs text-red-600">
                            {fieldState.error.message}
                        </p>
                    )}
                </div>
            )}
            name={name}
        />
    );
};

export default ProductTextFormInput;
