"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useState, useMemo, useEffect } from "react";

const FilterContext = createContext(undefined);

export const useFilterContext = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
    	throw new Error("useFilterContext must be used within a FilterProvider");
    }
    return context;
    // return null;
};

export const FilterProvider = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryParams = Object.fromEntries([...searchParams]);

    const INIT_FILTER_STATE = {
        categories: searchParams.has("category")
            ? queryParams["category"].split(",").map((id) => Number(id))
            : [],
        name: searchParams.has("name") ? queryParams["name"] : undefined,
        minPrice: searchParams.has("minPrice")
            ? Number(queryParams["minPrice"])
            : undefined,
        maxPrice: searchParams.has("maxPrice")
            ? Number(queryParams["maxPrice"])
            : undefined,
        sortBy: searchParams.has("sortBy") ? queryParams["sortBy"] : "",
        status: searchParams.has("status") ? queryParams["status"] : "",
        // direction: searchParams.has("direction") ? queryParams["direction"] : "asc",
    };

    const [state, setState] = useState(INIT_FILTER_STATE);

    const updateState = (changes) =>
        setState((prevState) => ({ ...prevState, ...changes }));

    const updateCategory = (categoryId) => {
        const categories = [...state.categories];
        if (!categories.includes(categoryId)) {
            categories.push(categoryId);
        } else {
            const index = categories.indexOf(categoryId);
            categories.splice(index, 1);
        }
        updateState({ categories });
    };

    const updateSearch = (name) => updateState({ name });

    const updateMinPrice = (minPrice) => updateState({ minPrice });

    const updateMaxPrice = (maxPrice) => updateState({ maxPrice });
    const updateSortBy = (sortBy) => updateState({ sortBy });
    const updateStatus = (status) => updateState({ status });
    // const toggleDirection = () => {
    // 	const newDirection = state.direction === "asc" ? "desc" : "asc";
    // 	updateState({ direction: newDirection });
    // };
    useEffect(() => {
        const query = new URLSearchParams();

        if (state.categories.length) {
            query.set("categories", state.categories.join(","));
        }
        if (state.minPrice) {
            query.set("minPrice", state.minPrice);
        }
        if (state.maxPrice) {
            query.set("maxPrice", state.maxPrice);
        }
        if (state.name) {
            query.set("name", state.name);
        }
        if (state.sortBy) {
            query.set("sortBy", state.sortBy);
        }
        if(state.status){
            query.set("status", state.status);
        }
        // if (state.direction) {
        // 	query.set("direction", state.direction);
        // }

        router.push(`${pathname}?${query.toString()}`, { scroll: false });
    }, [state, router, pathname]);

    const value = useMemo(
        () => ({
            ...state,
            updateCategory,
            updateSearch,
            updateMinPrice,
            updateMaxPrice,
            updateSortBy,
            updateStatus,
            // toggleDirection,
        }),
        [state]
    );

    return (
        <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
    );
};
