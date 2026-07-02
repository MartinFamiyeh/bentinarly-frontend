import { FiSearch } from "react-icons/fi";

type RewardsHeaderProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

const RewardsHeader = ({ searchTerm, onSearchChange }: RewardsHeaderProps) => {
  return (
    <div className="border-b border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-5 rounded-tl-xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-[#292929] dark:text-gray-100">Rewards & Earnings</h1>

        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#696969]" />
          <input
            type="text"
            placeholder="Search survey..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-[#E5E7EB] dark:border-gray-600 dark:bg-gray-800 py-2.5 pl-11 pr-4 text-sm text-[#292929] dark:text-gray-100 placeholder:text-[#696969] dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FE5102]/30"
          />
        </div>
      </div>
    </div>
  );
};

export default RewardsHeader;
