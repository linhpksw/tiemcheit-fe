import LoginForm from "./LoginForm";
import { AuthFormLayout } from "@/components";

export const metadata = {
    title: "Login",
};


const Login = () => {
    return (
        <AuthFormLayout
            authTitle="Đăng nhập"
            helpText="Nhập tài khoản và mật khẩu của bạn để truy cập tiệm chè IT."
        >
            <LoginForm />
        </AuthFormLayout>
    );
};

export default Login;
