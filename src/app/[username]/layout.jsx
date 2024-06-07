'use client'
import { Footer } from "@/components";
import { Navbar, Topbar } from "@/components/layout/admin";

const Layout = ({ children }) => {
    return (
        <>
            <Topbar />
            <Navbar />
            {children}
            <Footer hideLinks />
        </>
    );
};

export default Layout;
