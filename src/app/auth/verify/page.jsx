import { AuthFormLayout } from "@/components";
import VerificationAccountForm from "./VerificationAccountForm";

const VerifyAccount = () => {
    return (
        <AuthFormLayout
            authTitle="Xác minh tài khoản"
            helpText="Bạn đã nhận được mã xác minh qua email. Vui lòng nhập mã xác minh để kích hoạt tài khoản."
        >
            {/* <VerificationAccountForm /> */}
        </AuthFormLayout>
    );
};

export default VerifyAccount;
