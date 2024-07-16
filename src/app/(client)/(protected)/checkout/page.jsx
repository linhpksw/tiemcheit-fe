"use client";
import BillingInformationForm from "./BillingInformationForm";
import { Breadcrumb } from "@/components";
import { useUser } from '@/hooks';

const Checkout = () => {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <div></div>;
    }

    return (
        <>
            <Breadcrumb title="Đặt hàng" subtitle="Đơn hàng" />
            <section className="py-6 lg:py-10">
                <div className="container">
                    <BillingInformationForm user={user} />
                </div >
            </section >
        </>
    );
};

export default Checkout;
