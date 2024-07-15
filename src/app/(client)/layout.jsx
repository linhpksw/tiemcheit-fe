import { Footer, FooterLinks, Navbar } from "@/components";

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
