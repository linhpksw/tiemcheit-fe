'use client'
import { AuthFormLayout } from "@/components";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPassword = () => {
    return (
        <AuthFormLayout
            authTitle="Nhập mật khẩu mới của bạn"
            helpText="Hãy tạo một mật khẩu đủ mạnh để bảo vệ tài khoản của bạn."
        >
            <ResetPasswordForm />
        </AuthFormLayout>
    );
};

export default ResetPassword;
