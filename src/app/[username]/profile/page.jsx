'use client'
import PersonalDetailForm from "./PersonalDetailForm";
import CredentialsManagementForm from "./CredentialsManagementForm";
import DeactivateAccountForm from "./DeactivateAccountForm";
import AddressForm from "./AddressForm";
import { BreadcrumbAdmin } from "@/components";
import { Authorization } from "@/components/security";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks";

const Settings = () => {
    const { username } = useParams();
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <div></div>;
    }

    return (
        <Authorization allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']} username={username}>
            <div className="w-full lg:ps-64">
                <div className="page-content space-y-6 p-6">
                    <BreadcrumbAdmin title="Thông tin cá nhân" />

                    <div>
                        <nav
                            className="mb-6 flex flex-wrap justify-center gap-4"
                            aria-label="Tabs"
                            role="tablist"
                        >
                            <button
                                type="button"
                                className="active flex w-full justify-center rounded-lg bg-primary/10 px-6 py-3 text-center text-sm font-medium text-primary hs-tab-active:bg-primary hs-tab-active:text-white sm:w-auto"
                                data-hs-tab="#tabPersonalDetail"
                                aria-controls="tabPersonalDetail"
                                role="tab"
                            >
                                Thông tin cá nhân
                            </button>
                            <button
                                type="button"
                                className="flex w-full justify-center rounded-lg bg-primary/10 px-6 py-3 text-center text-sm font-medium text-primary hs-tab-active:bg-primary hs-tab-active:text-white sm:w-auto"
                                data-hs-tab="#tabCredentialManagement"
                                aria-controls="tabCredentialManagement"
                                role="tab"
                            >
                                Quản lý mật khẩu
                            </button>
                            <button
                                type="button"
                                className="flex w-full justify-center rounded-lg bg-primary/10 px-6 py-3 text-center text-sm font-medium text-primary hs-tab-active:bg-primary hs-tab-active:text-white sm:w-auto"
                                data-hs-tab="#tabAddress"
                                aria-controls="tabAddress"
                                role="tab"
                            >
                                Địa chỉ giao hàng
                            </button>

                            <button
                                type="button"
                                className="flex w-full justify-center rounded-lg bg-primary/10 px-6 py-3 text-center text-sm font-medium text-primary hs-tab-active:bg-primary hs-tab-active:text-white sm:w-auto"
                                data-hs-tab="#tabDeactivateAccount"
                                aria-controls="tabDeactivateAccount"
                                role="tab"
                            >
                                Xoá tài khoản
                            </button>
                        </nav>
                        <div className="rounded-lg border border-default-200 p-6">
                            <PersonalDetailForm user={user} />

                            <CredentialsManagementForm user={user} />

                            <AddressForm user={user} />

                            <DeactivateAccountForm user={user} />
                        </div>
                    </div>
                </div>
            </div>
        </Authorization>
    );
};

export default Settings;
