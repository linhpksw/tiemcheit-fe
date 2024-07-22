import { Footer, FooterLinks, Navbar } from "@/components";
import { Authorization } from "@/components/security";


const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
            <FooterLinks />
            <Footer />
        </>
    );
};

export default Layout;
