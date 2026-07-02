import { PiCheckCircleFill, PiClockFill, PiXCircleFill } from "react-icons/pi";
import type { WalletTransactionDto } from "../../types/api";
import {
  REWARD_STATUS_FILTERS,
  type RewardStatusFilter,
  formatGhs,
  formatRewardDate,
  getRewardDisplayStatus,
} from "../../utils/rewardTransactions";


type RewardHistoryProps = {
  transactions: WalletTransactionDto[];
  activeFilter: RewardStatusFilter;
  onFilterChange: (filter: RewardStatusFilter) => void;
};

const statusStyles: Record<
  ReturnType<typeof getRewardDisplayStatus>,
  { className: string; Icon: typeof PiCheckCircleFill }
> = {
  Credited: {
    className: "bg-[#E8F7E8] text-[#027B00]",
    Icon: PiCheckCircleFill,
  },
  Pending: {
    className: "bg-[#FFF5F0] text-[#FE5102]",
    Icon: PiClockFill,
  },
  Rejected: {
    className: "bg-[#FEECEC] text-[#D00808]",
    Icon: PiXCircleFill,
  },
};

const StatusBadge = ({ status }: { status: ReturnType<typeof getRewardDisplayStatus> }) => {
  const { className, Icon } = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {status}
    </span>
  );
};

const RewardHistory = ({ transactions, activeFilter, onFilterChange }: RewardHistoryProps) => {
  return (
    <div className="rounded-xl border border-[#EEEEEE] dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex flex-col gap-4 border-b border-[#EEEEEE] dark:border-gray-700 border-dashed px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-[#292929] dark:text-gray-100">Reward History</h2>

        <div className="flex flex-wrap gap-2">
          {REWARD_STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`rounded-lg px-4 py-1.5 text-sm transition-colors ${
                activeFilter === filter
                  ? "bg-[#FFF5F0] dark:bg-gray-800 font-semibold text-[#FE5102]"
                  : "font-medium text-[#696969] dark:text-gray-400 hover:bg-[#FAFAFA] dark:hover:bg-gray-800"
              }`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#EEEEEE] dark:border-gray-700 text-left text-xs font-medium uppercase tracking-wide text-[#696969] dark:text-gray-400">
                <th className="px-5 py-3">Survey</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const displayStatus = getRewardDisplayStatus(transaction.status);

                return (
                  <tr
                    key={transaction.id}
                    className="border-b border-[#F5F5F5] dark:border-gray-800 last:border-b-0">
                    <td className="max-w-md px-5 py-4 text-sm font-medium text-[#292929] dark:text-gray-100">
                      {transaction.description || "Survey reward"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#696969] dark:text-gray-400">
                      {formatRewardDate(transaction.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#292929] dark:text-gray-100">
                      {formatGhs(transaction.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={displayStatus} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-12 text-center text-sm text-[#696969] dark:text-gray-400">
          No reward history found.
        </div>
      )}
    </div>
  );
};

export default RewardHistory;
