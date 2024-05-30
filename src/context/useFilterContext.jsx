// "use client";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { createContext, useContext, useState, useMemo, useEffect } from "react";

// const FilterContext = createContext(undefined);

// export const useFilterContext = () => {
// 	const context = useContext(FilterContext);
// 	if (context == undefined) {
// 		throw new Error("useFilterContext must be used within an FilterProvider");
// 	}
// 	return context;
// };

// export const FilterProvider = ({ children }) => {
// 	const router = useRouter();
// 	const pathname = usePathname();
// 	const searchParams = useSearchParams();
// 	const queryParams = Object.fromEntries([...searchParams]);

// 	const INIT_FILTER_STATE = {
// 		categories: searchParams.has("categories")
// 			? queryParams["categories"].split(",").map((id) => Number(id))
// 			: [],
// 		name: searchParams.has("name") ? queryParams["name"] : undefined,
// 		minPrice: searchParams.has("minPrice")
// 			? Number(queryParams["minPrice"])
// 			: undefined,
// 		maxPrice: searchParams.has("maxPrice")
// 			? Number(queryParams["maxPrice"])
// 			: undefined,
// 		updateCategory: () => {},
// 		updateSearch: () => {},
// 		updateMinPrice: () => {},
// 		updateMaxPrice: () => {},
// 	};

// 	const [state, setState] = useState(INIT_FILTER_STATE);

// 	const updateState = (changes) => setState({ ...state, ...changes });

// 	const updateCategory = (categoryId) => {
// 		const categories = state.categories;
// 		if (!categories.length || !categories.includes(categoryId)) {
// 			categories.push(categoryId);
// 			updateState({ categories });
// 		} else if (categories.includes(categoryId)) {
// 			updateState({ categories: categories.filter((id) => id != categoryId) });
// 		}
// 	};

// 	const updateSearch = (name) => updateState({ name });

// 	const updateMinPrice = (minPrice) => updateState({ minPrice });

// 	const updateMaxPrice = (maxPrice) => updateState({ maxPrice });

// 	useEffect(() => {
// 		let query = "";
// 		if (!(!state.categories || !state.categories.length)) {
// 			query += `categories=${state.categories?.join(",")}&`;
// 		}

// 		if (state.minPrice) {
// 			query += `minPrice=${state.minPrice.toString()}&`;
// 		}
// 		if (state.maxPrice) {
// 			query += `maxPrice=${state.maxPrice.toString()}&`;
// 		}

// 		if (state.name && state.name.length != 0) {
// 			query += `name=${state.name}&`;
// 		}
// 		router.push(`${pathname}?${query}`, { scroll: false });
// 	}, [state]);

// 	return (
// 		<FilterContext.Provider
// 			value={useMemo(
// 				() => ({
// 					...state,
// 					updateCategory,

// 					updateSearch,
// 					updateMinPrice,
// 					updateMaxPrice,
// 				}),
// 				[state]
// 			)}
// 		>
// 			{children}
// 		</FilterContext.Provider>
// 	);
// };

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
};

export const FilterProvider = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryParams = Object.fromEntries([...searchParams]);

	const INIT_FILTER_STATE = {
		categories: searchParams.has("categories")
			? queryParams["categories"].split(",").map((id) => Number(id))
			: [],
		name: searchParams.has("name") ? queryParams["name"] : undefined,
		minPrice: searchParams.has("minPrice")
			? Number(queryParams["minPrice"])
			: undefined,
		maxPrice: searchParams.has("maxPrice")
			? Number(queryParams["maxPrice"])
			: undefined,
		sortBy: searchParams.has("sortBy") ? queryParams["sortBy"] : undefined,
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
			// Add sortBy to the query params
			query.set("sortBy", state.sortBy);
		}

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
		}),
		[state]
	);

	return (
		<FilterContext.Provider value={value}>{children}</FilterContext.Provider>
	);
};
