'use client'
import ForgotPasswordForm from "./ForgotPasswordForm";
import { AuthFormLayout } from "@/components";

const RecoverPassword = () => {
    return (
        <AuthFormLayout
            authTitle="Đặt lại mật khẩu"
            helpText="Điền email liên kết với tài khoản của bạn vào ô bên dưới để nhận mã xác minh."
        >
            <ForgotPasswordForm />
        </AuthFormLayout>
    );
};

export default RecoverPassword;
