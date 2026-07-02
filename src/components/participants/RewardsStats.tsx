import type { FunctionComponent, ReactNode, SVGProps } from "react";
import WalletWhite from "../../assets/icons/wallet-white.svg";
import WalletActive from "../../assets/icons/wallet-active.svg";
import AllSurveysActive from "../../assets/icons/all-surveys-active.svg";
import type { UserWalletDto, WalletTransactionDto } from "../../types/api";
import {
  formatGhsAmount,
  getLifetimeEarningsTrend,
  getPendingTrend,
  getSurveysCompletedTrend,
} from "../../utils/rewardTransactions";

type SvgIcon = FunctionComponent<SVGProps<SVGSVGElement>>;

const WalletWhiteIcon = WalletWhite as unknown as SvgIcon;
const WalletActiveIcon = WalletActive as unknown as SvgIcon;
const AllSurveysActiveIcon = AllSurveysActive as unknown as SvgIcon;

type RewardsStatsProps = {
  wallet: UserWalletDto;
  surveysCompleted: number;
  transactions: WalletTransactionDto[];
  onWithdraw: () => void;
  isWithdrawing: boolean;
};

type IconBadgeProps = {
  icon: SvgIcon;
  variant: "primary" | "default";
};

const IconBadge = ({ icon: Icon, variant }: IconBadgeProps) => (
  <div
    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
      variant === "primary" ? "bg-white/20" : "bg-[#FFF5F0]"
    }`}>
    <Icon className="h-[18px] w-[18px]" aria-hidden />
  </div>
);

type CurrencyValueProps = {
  amount: number;
  variant: "primary" | "default";
};

const CurrencyValue = ({ amount, variant }: CurrencyValueProps) => (
  <p className="leading-none">
    <span
      className={`mr-1 text-base font-medium ${
        variant === "primary" ? "text-white/80" : "text-[#696969] dark:text-gray-400"
      }`}>
      GHS
    </span>
    <span
      className={`text-[28px] font-bold tracking-tight ${
        variant === "primary" ? "text-white" : "text-[#292929] dark:text-gray-100"
      }`}>
      {formatGhsAmount(amount)}
    </span>
  </p>
);

type PrimaryBalanceCardProps = {
  balance: number;
  onWithdraw: () => void;
  isWithdrawing: boolean;
};

const PrimaryBalanceCard = ({ balance, onWithdraw, isWithdrawing }: PrimaryBalanceCardProps) => (
  <div className="relative flex min-h-[156px] flex-col justify-between overflow-hidden rounded-2xl bg-[#FE5102] p-5">
    <div
      className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full border-2 border-white/20"
      aria-hidden
    />
    <div
      className="pointer-events-none absolute -right-6 -bottom-12 h-20 w-20 rounded-full border-2 border-white/20"
      aria-hidden
    />

    <div className="relative flex items-start justify-between gap-3">
      <p className="text-sm font-medium text-white">Available Balance</p>
      <IconBadge icon={WalletWhiteIcon} variant="primary" />
    </div>

    <div className="relative flex items-end justify-between gap-4">
      <CurrencyValue amount={balance} variant="primary" />
      <button
        type="button"
        onClick={onWithdraw}
        disabled={isWithdrawing || balance <= 0}
        className="shrink-0 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-[#FE5102] transition-opacity hover:opacity-90 disabled:cursor-not-allowed">
        {isWithdrawing ? "Processing..." : "Withdraw"}
      </button>
    </div>
  </div>
);

type DefaultStatCardProps = {
  label: string;
  icon: SvgIcon;
  footer?: string | null;
  children: ReactNode;
};

const DefaultStatCard = ({ label, icon, footer, children }: DefaultStatCardProps) => (
  <div className="flex min-h-[156px] flex-col justify-between rounded-2xl border border-[#EEEEEE] dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm font-medium text-[#696969] dark:text-gray-400">{label}</p>
      <IconBadge icon={icon} variant="default" />
    </div>

    <div className="space-y-2">
      {children}
      <p className={`text-xs font-medium ${footer ? "text-[#FE5102]" : "text-transparent"}`}>
        {footer ?? "."}
      </p>
    </div>
  </div>
);

const RewardsStats = ({
  wallet,
  surveysCompleted,
  transactions,
  onWithdraw,
  isWithdrawing,
}: RewardsStatsProps) => {
  const pendingTrend = getPendingTrend(transactions);
  const lifetimeTrend = getLifetimeEarningsTrend(transactions);
  const surveysTrend = getSurveysCompletedTrend(transactions);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <PrimaryBalanceCard
        balance={wallet.balance}
        onWithdraw={onWithdraw}
        isWithdrawing={isWithdrawing}
      />

      <DefaultStatCard
        label="Pending Approval"
        icon={WalletActiveIcon}
        footer={pendingTrend}>
        <CurrencyValue amount={wallet.pendingBalance} variant="default" />
      </DefaultStatCard>

      <DefaultStatCard
        label="Lifetime Earnings"
        icon={WalletActiveIcon}
        footer={lifetimeTrend}>
        <CurrencyValue amount={wallet.totalEarned} variant="default" />
      </DefaultStatCard>

      <DefaultStatCard
        label="Surveys Completed"
        icon={AllSurveysActiveIcon}
        footer={surveysTrend}>
        <p className="text-[28px] font-bold tracking-tight text-[#292929]">{surveysCompleted}</p>
      </DefaultStatCard>
    </div>
  );
};

export default RewardsStats;
