import { useState, useEffect, useMemo } from "react";
import { useWalletApi } from "../services/apiClient";
import { useLoading } from "../contexts/LoadingContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import RewardsHeader from "../components/participants/RewardsHeader";
import RewardsStats from "../components/participants/RewardsStats";
import RewardHistory from "../components/participants/RewardHistory";
import {
  countCompletedSurveys,
  matchesRewardFilter,
  type RewardStatusFilter,
} from "../utils/rewardTransactions";
import * as ApiTypes from "../types/api";

const Rewards = () => {
  const walletApi = useWalletApi();
  const { showLoading, hideLoading } = useLoading();
  const { showSnackbar } = useSnackbar();
  const [wallet, setWallet] = useState<ApiTypes.UserWalletDto | null>(null);
  const [transactions, setTransactions] = useState<ApiTypes.WalletTransactionDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<RewardStatusFilter>("All");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const loadWalletData = async () => {
    showLoading();
    try {
      const [walletData, transactionsData] = await Promise.all([
        walletApi.getWallet(),
        walletApi.getTransactions({ page: 1, pageSize: 100 }),
      ]);
      setWallet(walletData);
      setTransactions(transactionsData.items || []);
    } catch (error: unknown) {
      console.error("Failed to fetch wallet data:", error);
      showSnackbar("Failed to load rewards data.", "error");
      setWallet(null);
      setTransactions([]);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const surveysCompleted = useMemo(() => countCompletedSurveys(transactions), [transactions]);

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !query || (transaction.description || "").toLowerCase().includes(query);

      return matchesSearch && matchesRewardFilter(transaction, activeFilter);
    });
  }, [transactions, searchTerm, activeFilter]);

  const handleWithdraw = async () => {
    if (!wallet || wallet.balance <= 0) {
      showSnackbar("No available balance to withdraw.", "error");
      return;
    }

    setIsWithdrawing(true);
    try {
      await walletApi.requestWithdrawal({ amount: wallet.balance });
      showSnackbar("Withdrawal request submitted.", "success");
      await loadWalletData();
    } catch (error: unknown) {
      console.error("Failed to request withdrawal:", error);
      showSnackbar("Failed to submit withdrawal request.", "error");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-y-auto rounded-l-xl bg-white shadow-sm">
      <RewardsHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="space-y-6 p-6">
        {wallet && (
          <RewardsStats
            wallet={wallet}
            surveysCompleted={surveysCompleted}
            transactions={transactions}
            onWithdraw={handleWithdraw}
            isWithdrawing={isWithdrawing}
          />
        )}

        <RewardHistory
          transactions={filteredTransactions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>
    </div>
  );
};

export default Rewards;
