"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { FilterProvider, LayoutProvider } from "@/context";
const ShopProvider = dynamic(() => import("@/context/useShoppingContext"), {
    ssr: false,
});


const AppProvidersWrapper = ({ children }) => {
    const handleChangeTitle = () => {
        if (document.visibilityState == "hidden")
            document.title = "Mình nhớ bạn 🥺";
        else
            document.title = "Tiệm chè IT | Chè ngon, giá rẻ!";
    };

    useEffect(() => {
        if (document) {
            const e = document.querySelector("#__next_splash");
            if (e?.hasChildNodes()) {
                document.querySelector("#splash-screen")?.classList.add("remove");
            }
            e?.addEventListener("DOMNodeInserted", () => {
                document.querySelector("#splash-screen")?.classList.add("remove");
            });
        }

        import("preline");

        document.addEventListener("visibilitychange", handleChangeTitle);
        return () => {
            document.removeEventListener("visibilitychange", handleChangeTitle);
        };
    }, []);

    return (
        <LayoutProvider>
            <ShopProvider>
                <FilterProvider>{children}</FilterProvider>
            </ShopProvider>
        </LayoutProvider>
    );
};
export default AppProvidersWrapper;
