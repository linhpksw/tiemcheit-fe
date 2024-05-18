import { AuthFormLayout } from "@/components";
import RegisterForm from "./RegisterForm";

const Register = () => {
    return (
        <AuthFormLayout
            authTitle="Đăng ký tài khoản"
            helpText="Quá trình đăng ký chỉ mất vài phút."
        >
            <RegisterForm />

        </AuthFormLayout>
    );
};

export default Register;
