"use client";
import { useState, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";
import { cn } from "@/utils";
import { useFilterContext } from "@/context"; // Import context

const IngredientFilterDropDown = ({
	filterType,
	filterOptions,
	onChange,
	value,
}) => {
	const [selectedOption, setSelectedOption] = useState(value);

	const handleOptionClick = (option) => {
		setSelectedOption(option.name);
		onChange(option.key);
	};

	return (
		<div className="hs-dropdown relative inline-flex">
			<button
				type="button"
				className="hs-dropdown-toggle flex items-center rounded-md bg-default-100 px-5 py-3 text-sm font-medium text-default-700 transition-all text-nowrap"
			>
				{selectedOption ?? ""} <LuChevronDown size={16} />
			</button>
			<div className="hs-dropdown-menu z-20 mt-4 hidden min-w-[200px] rounded-lg border border-default-100 bg-white p-1.5 opacity-0 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-default-50">
				<ul className="flex flex-col gap-1">
					{filterOptions.map((option, idx) => (
						<li key={option + idx}>
							<span
								onClick={() => handleOptionClick(option)}
								className={cn(
									"flex items-center gap-3 rounded px-3 py-2 font-normal transition-all hover:bg-default-100 hover:text-default-700",
									selectedOption == option.name
										? " bg-default-100 text-default-700"
										: "text-default-600"
								)}
							>
								{option.name}
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default IngredientFilterDropDown;
