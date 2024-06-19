'use client'
import ForgotPasswordForm from "./ForgotPasswordForm";
import { AuthFormLayout } from "@/components";

const RecoverPassword = () => {
    return (
        <AuthFormLayout
            authTitle="Đặt lại mật khẩu"
            helpText="Điền email của bạn vào ô bên dưới để nhận hướng dẫn đặt lại mật khẩu."
        >
            <ForgotPasswordForm />
        </AuthFormLayout>
    );
};

export default RecoverPassword;
