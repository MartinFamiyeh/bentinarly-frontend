import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import SortIcon from "../../assets/icons/sort.png";
import { PiCheckCircleFill } from "react-icons/pi";

type ProjectsTopBarProps = {
  activeFilter?: string;
  setActiveFilter?: (filter: string) => void;
  sortOrder?: "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A";
  setSortOrder?: (order: "Newest to Oldest" | "Oldest to Newest" | "A - Z" | "Z - A") => void;
};

const filters = ["All", "Available", "In Progress", "Completed",];

const ProjectsTopBar: React.FC<ProjectsTopBarProps> = ({
  activeFilter = "All",
  setActiveFilter = () => {},
  sortOrder = "Newest to Oldest",
  setSortOrder = () => {},
}) => {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const handleSortChange = (order: typeof sortOrder) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  return (
    <div className="shadow-sm p-4 bg-white">
      <div className="flex justify-between items-center mb-3 relative">
        <div className="relative">
          <div>
            <p className="font-semibold text-xl text-[#292929]">All Surveys</p>
          </div>
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-1 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
      </div>
      <div className="flex justify-between items-center w-full bg-white py-1">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 px-3 py-1 rounded-lg text-sm transition-colors ${
                activeFilter === filter
                  ? "bg-[#B148F3]/10 text-[#B148F3] font-medium"
                  : "bg-[#FAFAFA] text-[#696969] hover:bg-gray-200/40"
              }`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-1 text-sm text-[#292929] hover:text-gray-800 border-l pl-4">
            <img src={SortIcon} className="w-3 h-3" />
            <span className="font-medium">Sort:</span> {sortOrder}
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              {["Newest to Oldest", "Oldest to Newest", "A - Z", "Z - A"].map((order) => (
                <button
                  key={order}
                  onClick={() => handleSortChange(order as typeof sortOrder)}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  {order}
                  {sortOrder === order && <PiCheckCircleFill className="text-orange-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsTopBar;
