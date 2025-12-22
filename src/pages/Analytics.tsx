import { useState, useEffect } from "react";
import { useAnalyticsApi } from "../services/apiClient";
import { useLoading } from "../contexts/LoadingContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import * as ApiTypes from "../types/api";

const Analytics = () => {
  const analyticsApi = useAnalyticsApi();
  const { showLoading, hideLoading } = useLoading();
  const { showSnackbar } = useSnackbar();
  const [dashboardData, setDashboardData] = useState<ApiTypes.DashboardAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      showLoading();
      try {
        const data = await analyticsApi.getDashboardAnalytics();
        setDashboardData(data);
      } catch (error: any) {
        console.error("Failed to fetch analytics:", error);
        showSnackbar("Failed to load analytics data.", "error");
      } finally {
        setLoading(false);
        hideLoading();
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen rounded-l-xl flex flex-col overflow-y-auto">
      <div className="py-6 px-8 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
      </div>

      <div className="p-8">
        {dashboardData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Surveys</h3>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.totalSurveys || 0}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Active Surveys</h3>
              <p className="text-3xl font-bold text-green-600">{dashboardData.activeSurveys || 0}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Responses</h3>
              <p className="text-3xl font-bold text-blue-600">{dashboardData.totalResponses || 0}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Response Rate</h3>
              <p className="text-3xl font-bold text-purple-600">
                {dashboardData.averageResponseRate ? `${dashboardData.averageResponseRate.toFixed(1)}%` : "0%"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
