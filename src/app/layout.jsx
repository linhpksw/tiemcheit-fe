import Image from "next/image";
import dynamic from "next/dynamic";
import { Be_Vietnam_Pro } from "next/font/google";
import { Toaster } from "sonner";

import NextTopLoader from "nextjs-toploader";

const AppProvidersWrapper = dynamic(
    () => import("@/components/AppProvidersWrapper")
);
const BackToTop = dynamic(() => import("@/components/layout/BackToTop"), {
    ssr: false,
});

import logo from '@/assets/images/logo-dark.png';

// styles
import "../assets/css/style.css";


const beVietnamPro = Be_Vietnam_Pro({
    weight: ["200", "300", "400", "500", "600", "700"],
    display: "swap",
    subsets: ["vietnamese"],
});

export const viewport = {
    minimumScale: 1,
    initialScale: 1,
    userScalable: true,
    width: "device-width",
    viewportFit: "cover",
    themeColor: "#67B137",
    colorScheme: "light dark",
    interactiveWidget: "resizes-content",
};

export const metadata = {
    applicationName: "Tiệm chè IT",
    title: {
        template: "%s | Tiệm chè IT | Chè ngon, giá rẻ!",
        default: "Tiệm chè IT | Chè ngon, giá rẻ!"
    },
    authors: {
        name: "tiemcheit",
        url: "https://tiemcheit.com/",
    },
    description: 'Tiệm chè IT - Chè ngon, giá rẻ, giao hàng tận nơi. Đặt chè online, giao hàng tận nơi, nhanh chóng, tiện lợi. Chè ngon, giá rẻ, chất lượng, uy tín.',
    keywords: ["Tiệm chè IT", "Food", "Food Delivery", "Nextjs", "Tailwind", "React"],
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Tiệm chè IT",
        startupImage: ["/icon.png"],
    },
};

const splashScreenStyles = `
#splash-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  background: white;
  display: flex;
  height: 100%;
  width: 100%;
  transform: translate(-50%, -50%);
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  transition: all 15s linear;
  overflow: hidden;
}

#splash-screen.remove {
  animation: fadeout 0.7s forwards;
  z-index: 0;
}

@keyframes fadeout {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
`;

export default function RootLayout({ children }) {
    return (
        <html lang="vi">
            <head>
                <style>{splashScreenStyles}</style>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Delicious+Handrawn&display=swap"
                    rel="stylesheet"
                />
            </head>

            <body
                className={`${beVietnamPro.className} selection:bg-primary selection:text-white`}
            >
                <div id="splash-screen">
                    <Image
                        alt="Logo"
                        width={355}
                        height={83}
                        src={logo}
                        style={{ height: "10%", width: "auto" }}
                    />
                </div>
                <NextTopLoader color="#67B137" showSpinner={false} />
                <div id="__next_splash">
                    <AppProvidersWrapper>
                        {children}
                        <BackToTop />
                        <Toaster richColors expand={true} />
                    </AppProvidersWrapper>
                </div>

                {/* <script src="https://accounts.google.com/gsi/client" async></script> */}
            </body>
        </html>
    );
}
