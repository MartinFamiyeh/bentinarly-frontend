import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAnalyticsApi } from "../services/apiClient";
import { useLoading } from "../contexts/LoadingContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import * as ApiTypes from "../types/api";

const SurveyAnalytics = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const analyticsApi = useAnalyticsApi();
  const { showLoading, hideLoading } = useLoading();
  const { showSnackbar } = useSnackbar();
  const [analytics, setAnalytics] = useState<ApiTypes.SurveyAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!surveyId) {
      showSnackbar("No survey ID provided.", "error");
      return;
    }

    const fetchAnalytics = async () => {
      showLoading();
      try {
        const data = await analyticsApi.getSurveyAnalytics(surveyId);
        setAnalytics(data);
      } catch (error: any) {
        console.error("Failed to fetch survey analytics:", error);
        showSnackbar("Failed to load analytics data.", "error");
      } finally {
        setLoading(false);
        hideLoading();
      }
    };

    fetchAnalytics();
  }, [surveyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen rounded-l-xl flex flex-col overflow-y-auto">
      <div className="py-6 px-8 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Survey Analytics</h1>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Responses</h3>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalResponses || 0}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Completion Rate</h3>
            <p className="text-3xl font-bold text-green-600">
              {analytics.completionRate ? `${analytics.completionRate.toFixed(1)}%` : "0%"}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Average Time</h3>
            <p className="text-3xl font-bold text-blue-600">
              {analytics.averageCompletionTime ? `${analytics.averageCompletionTime.toFixed(0)}s` : "0s"}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Response Rate</h3>
            <p className="text-3xl font-bold text-purple-600">
              {analytics.responseRate ? `${analytics.responseRate.toFixed(1)}%` : "0%"}
            </p>
          </div>
        </div>

        {analytics.responseTrends && analytics.responseTrends.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Response Trends</h2>
            <div className="space-y-2">
              {analytics.responseTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{trend.date || trend.period}</span>
                  <span className="text-sm font-medium">{trend.count || 0} responses</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyAnalytics;
