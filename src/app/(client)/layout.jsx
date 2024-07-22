import { Footer, FooterLinks, Navbar } from "@/components";
import { Authorization } from "@/components/security";

const Layout = ({ children }) => {
    return (
        <Authorization notAllowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']}>
            <Navbar />
            {children}
            <FooterLinks />
            <Footer />
        </Authorization>
    );
};

export default Layout;
