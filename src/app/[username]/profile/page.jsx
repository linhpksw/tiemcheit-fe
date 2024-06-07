'use client'
import PersonalDetailForm from "./PersonalDetailForm";
import CredentialsManagementForm from "./CredentialsManagementForm";
import BillingAddressForm from "./BillingAddressForm";
import ShippingAddressForm from "./ShippingAddressForm";
import { BreadcrumbAdmin } from "@/components";
import { Authorization } from "@/components/security";
import { useParams } from "next/navigation";

const Settings = () => {
    const { username } = useParams();

    return (
        <Authorization allowedRoles={['ROLE_CUSTOMER']} username={username}>
            <div className="w-full lg:ps-64">
                <div className="page-content space-y-6 p-6">
                    <BreadcrumbAdmin title="Thông tin cá nhân" />
                    <PersonalDetailForm />
                    <div className="mb-6 rounded-lg border border-default-200 p-6">
                        <CredentialsManagementForm />
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <BillingAddressForm />
                        <ShippingAddressForm />
                    </div>
                </div>
            </div>
        </Authorization>
    );
};

export default Settings;
