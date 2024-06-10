import { AuthFormLayout } from "@/components";
import ActiveAccountForm from "./ActiveAccountForm";

export const metadata = {
    title: "Xác minh tài khoản",
};


const ActiveAccount = () => {
    return (
        <AuthFormLayout
            authTitle="Xác minh tài khoản"
            helpText="Bạn đã nhận được mã xác minh qua email. Vui lòng nhập mã xác minh để kích hoạt tài khoản."
            bottomLink={<BottomLink />}
            hasThirdPartyAuth
        >
            <ActiveAccountForm />
        </AuthFormLayout>
    );
};

export default ActiveAccount;
