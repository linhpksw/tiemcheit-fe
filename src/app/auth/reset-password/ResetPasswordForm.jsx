"use client";

import { PasswordFormInput } from "@/components";
import useReset from "./useReset";

const ResetPasswordForm = () => {
    const { control, reset, loading } = useReset();

    return (
        <form onSubmit={reset}>
            <PasswordFormInput
                name="newPassword"
                control={control}
                label="Mật khẩu mới"
                labelClassName="block text-sm font-medium text-default-900 mb-2"
                containerClassName="mb-6"
                fullWidth
            />

            <PasswordFormInput
                name="confirmNewPassword"
                control={control}
                label="Nhập lại mật khẩu mới"
                labelClassName="block text-sm font-medium text-default-900 mb-2"
                containerClassName="mb-6"
                fullWidth
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-6 py-3 text-primary-50 transition-all hover:bg-primary-600"
            >
                Đặt lại mật khẩu
            </button>
        </form>
    );
};

export default ResetPasswordForm;
