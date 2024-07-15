"use client";
import { PasswordFormInput, TextFormInput } from "@/components";
import useDeactivate from "./useDeactivate";

const DeactivateAccountForm = ({ user }) => {
    const { loading, deactivate, control } = useDeactivate(user);

    return (
        <form id="tabDeactivateAccount"
            role="tabpanel" onSubmit={deactivate} className="hidden mb-6 rounded-lg border border-default-200 p-6">
            <h4 className="mb-4 text-xl font-medium text-rose-600">
                Xoá tài khoản
            </h4>
            <p className="mb-4 text-default-400">Chúng tôi sẽ xoá tài khoản của bạn vĩnh viễn. Hãy chắc chắn rằng bạn muốn thực hiện hành động này.</p>

            <TextFormInput
                name="confirmDeactivate"
                label='Để xác nhận, vui lòng điền "Xoá tài khoản" vào ô bên dưới'
                containerClassName="mb-4"
                control={control}
                fullWidth
            />

            <PasswordFormInput
                name="currentPassword"
                label="Xác nhận mật khẩu hiện tại"
                containerClassName="mb-4"
                placeholder="Nhập mật khẩu hiện tại của bạn..."
                control={control}
                fullWidth
            />

            <div>
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200  hover:bg-rose-500"
                    disabled={loading}
                >
                    Xóa tài khoản của bạn
                </button>
            </div>
        </form>
    );
};

export default DeactivateAccountForm;