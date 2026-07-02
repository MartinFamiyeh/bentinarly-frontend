import React, { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import SortIcon from "../../assets/icons/sort.png";
import { PiCheckCircleFill } from "react-icons/pi";

type TopbarProps = {
  activeFilter?: string;
  setActiveFilter?: (filter: string) => void;
  sortOrder?: "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A";
  setSortOrder?: (order: "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A") => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
};

const filters = ["All", "Available", "In Progress", "Completed"];

const Topbar: React.FC<TopbarProps> = ({
  activeFilter = "All",
  setActiveFilter = () => {},
  sortOrder = "Newest to Oldest",
  setSortOrder = () => {},
  searchTerm = "",
  setSearchTerm = () => {},
}) => {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (order: typeof sortOrder) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  return (
    <div className="shadow-sm p-4 bg-white dark:bg-gray-900 rounded-tl-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold text-xl text-[#292929] dark:text-gray-100">All Surveys</h1>

        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#696969]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-[#E5E7EB] dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE5102]/30 text-sm text-[#292929] dark:text-gray-100 placeholder:text-[#696969] dark:placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex justify-between items-center w-full">
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm transition-colors ${
                activeFilter === filter
                  ? "bg-[#FFF5F0] dark:bg-gray-800 text-[#FE5102] font-semibold"
                  : "text-[#696969] dark:text-gray-400 hover:bg-[#FAFAFA] dark:hover:bg-gray-800 font-medium"
              }`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="relative shrink-0" ref={sortRef}>
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-2 text-sm text-[#292929] dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-100 border-l border-[#E5E7EB] dark:border-gray-700 pl-4">
            <img src={SortIcon} className="w-3 h-3" alt="" />
            <span>
              <span className="font-medium">Sort:</span> {sortOrder}
            </span>
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
              {(["Newest to Oldest", "Oldest to Newest", "A - Z", "Z - A"] as const).map(
                (order) => (
                  <button
                    key={order}
                    onClick={() => handleSortChange(order)}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    {order}
                    {sortOrder === order && <PiCheckCircleFill className="text-[#FE5102]" />}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
