'use client'
import PersonalDetailForm from "./PersonalDetailForm";
import CredentialsManagementForm from "./CredentialsManagementForm";
import ShippingAddressForm from "./ShippingAddressForm";
import DeactivateAccountForm from "./DeactivateAccountForm";
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
        <Authorization allowedRoles={['ROLE_CUSTOMER']} username={username}>
            <div className="w-full lg:ps-64">
                <div className="page-content space-y-6 p-6">
                    <BreadcrumbAdmin title="Thông tin cá nhân" />

                    <PersonalDetailForm user={user} />

                    <CredentialsManagementForm user={user} />

                    <ShippingAddressForm user={user} />

                    <DeactivateAccountForm user={user} />
                </div>
            </div>
        </Authorization>
    );
};

export default Settings;
