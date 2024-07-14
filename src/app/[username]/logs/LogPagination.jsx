"use client"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ReactPaginate from 'react-paginate';

const LogPagination = ({ pageCount, onPageChange }) => {
    return (
        <>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 md:flex-nowrap md:justify-center text-lg font-medium">
                <ReactPaginate
                    previousLabel={<span className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-default-100 text-default-800 transition-all duration-500 hover:border-primary hover:bg-primary hover:text-white">
                        <LuChevronLeft size={20} />
                    </span>}
                    nextLabel={<span className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-default-100 text-default-800 transition-all duration-500 hover:border-primary hover:bg-primary hover:text-white">
                        <LuChevronRight size={20} />
                    </span>}

                    onPageChange={onPageChange}
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}

                    containerClassName="inline-flex items-center space-x-2 rounded-md"
                    pageClassName="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-default-100 text-default-800 transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white"
                    pageLinkClassName="flex justify-center items-center w-full h-full"
                    activeClassName="border border-primary bg-primary text-white"
                    breakLabel="..."
                    breakClassName="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-default-100 text-default-800 transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white"
                    breakLinkClassName="flex justify-center items-center w-full h-full"
                    renderOnZeroPageCount={null}
                />
            </div>
        </>
    );
};

export default LogPagination;
