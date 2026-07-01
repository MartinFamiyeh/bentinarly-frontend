import type { TransactionStatus, WalletTransactionDto } from "../types/api";

export type RewardDisplayStatus = "Credited" | "Pending" | "Rejected";

export const REWARD_STATUS_FILTERS = ["All", "Credited", "Pending", "Rejected"] as const;
export type RewardStatusFilter = (typeof REWARD_STATUS_FILTERS)[number];

const SURVEY_REWARD_TYPE = 1 as const;
const COMPLETED_STATUS = 3 as const;

export function getRewardDisplayStatus(status: TransactionStatus): RewardDisplayStatus {
  if (status === 3) return "Credited";
  if (status === 1 || status === 2) return "Pending";
  return "Rejected";
}

export function matchesRewardFilter(
  transaction: WalletTransactionDto,
  filter: RewardStatusFilter
): boolean {
  if (filter === "All") return true;
  return getRewardDisplayStatus(transaction.status) === filter;
}

export function countCompletedSurveys(transactions: WalletTransactionDto[]): number {
  return transactions.filter(
    (transaction) =>
      transaction.type === SURVEY_REWARD_TYPE && transaction.status === COMPLETED_STATUS
  ).length;
}

export function formatRewardDate(dateInput: string): string {
  return new Date(dateInput).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatGhs(amount: number): string {
  return `GHS ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatGhsAmount(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function isThisMonth(dateInput: string): boolean {
  const date = new Date(dateInput);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function isLastMonth(dateInput: string): boolean {
  const date = new Date(dateInput);
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return (
    date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
  );
}

function sumAmounts(transactions: WalletTransactionDto[]): number {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0);
}

function monthOverMonthPercent(
  transactions: WalletTransactionDto[],
  predicate: (transaction: WalletTransactionDto) => boolean
): string | null {
  const thisMonthTotal = sumAmounts(
    transactions.filter((transaction) => predicate(transaction) && isThisMonth(transaction.createdAt))
  );
  const lastMonthTotal = sumAmounts(
    transactions.filter((transaction) => predicate(transaction) && isLastMonth(transaction.createdAt))
  );

  if (thisMonthTotal === 0 && lastMonthTotal === 0) return null;
  if (lastMonthTotal === 0) return "+100% this month";

  const percent = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(1)}% this month`;
}

export function getPendingTrend(transactions: WalletTransactionDto[]): string | null {
  return monthOverMonthPercent(
    transactions,
    (transaction) => transaction.status === 1 || transaction.status === 2
  );
}

export function getLifetimeEarningsTrend(transactions: WalletTransactionDto[]): string | null {
  return monthOverMonthPercent(
    transactions,
    (transaction) => transaction.type === SURVEY_REWARD_TYPE && transaction.status === COMPLETED_STATUS
  );
}

export function getSurveysCompletedTrend(transactions: WalletTransactionDto[]): string | null {
  const thisMonthCount = transactions.filter(
    (transaction) =>
      transaction.type === SURVEY_REWARD_TYPE &&
      transaction.status === COMPLETED_STATUS &&
      isThisMonth(transaction.createdAt)
  ).length;

  if (thisMonthCount === 0) return null;
  return `+${thisMonthCount} surveys this month`;
}
