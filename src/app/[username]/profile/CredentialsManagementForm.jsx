"use client";
import { PasswordFormInput } from "@/components";
import usePassword from "./usePassword";

const CredentialsManagementForm = ({ user }) => {
    const { loading, update, control } = usePassword(user);

    const { isHavePassword } = user.data;

    return (
        <form onSubmit={update} className="mb-6 rounded-lg border border-default-200 p-6">
            <h4 className="mb-4 text-xl font-medium text-default-900">
                Thay đổi mật khẩu
            </h4>
            {isHavePassword && <PasswordFormInput
                name="currentPassword"
                label="Mật khẩu hiện tại"
                containerClassName="mb-4"
                placeholder="Nhập mật khẩu hiện tại của bạn..."
                control={control}
                fullWidth
            />}
            <PasswordFormInput
                name="newPassword"
                label="Mật khẩu mới"
                containerClassName="mb-4"
                placeholder="Nhập mật khẩu mới của bạn..."
                control={control}
                fullWidth
            />
            <PasswordFormInput
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                containerClassName="mb-4"
                placeholder="Nhập lại mật khẩu mới của bạn..."
                control={control}
                fullWidth
            />
            <div>
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200  hover:bg-primary-600"
                    disabled={loading}
                >
                    Lưu thay đổi
                </button>
            </div>
        </form>
    );
};

export default CredentialsManagementForm;
