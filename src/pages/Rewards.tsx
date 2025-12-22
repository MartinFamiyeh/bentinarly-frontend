import { useState, useEffect } from "react";
import { useWalletApi } from "../services/apiClient";
import { useLoading } from "../contexts/LoadingContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import * as ApiTypes from "../types/api";

const Rewards = () => {
  const walletApi = useWalletApi();
  const { showLoading, hideLoading } = useLoading();
  const { showSnackbar } = useSnackbar();
  const [wallet, setWallet] = useState<ApiTypes.UserWalletDto | null>(null);
  const [transactions, setTransactions] = useState<ApiTypes.WalletTransactionDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      showLoading();
      try {
        const [walletData, transactionsData] = await Promise.all([
          walletApi.getWallet(),
          walletApi.getTransactions({ page: 1, pageSize: 50 }),
        ]);
        setWallet(walletData);
        setTransactions(transactionsData.items || []);
      } catch (error: any) {
        console.error("Failed to fetch wallet data:", error);
        showSnackbar("Failed to load wallet data.", "error");
      } finally {
        setLoading(false);
        hideLoading();
      }
    };

    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen rounded-l-xl flex flex-col overflow-y-auto">
      <div className="py-6 px-8 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Rewards & Wallet</h1>
      </div>

      <div className="p-8">
        {wallet && (
          <div className="bg-gradient-to-r from-[#FE5102] to-[#B148F3] rounded-lg p-8 mb-8 text-white">
            <h2 className="text-lg font-medium mb-2">Wallet Balance</h2>
            <p className="text-4xl font-bold">{wallet.balance?.toFixed(2) || "0.00"}</p>
            <p className="text-sm mt-2 opacity-90">
              Available: {wallet.availableBalance?.toFixed(2) || "0.00"} | 
              Pending: {wallet.pendingBalance?.toFixed(2) || "0.00"}
            </p>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description || transaction.type}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === ApiTypes.TransactionType.Credit
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                      {transaction.type === ApiTypes.TransactionType.Credit ? "+" : "-"}
                      {transaction.amount?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ApiTypes.TransactionStatus[transaction.status || 0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
