import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Back from "../assets/icons/back-arrow.svg";
import Profile from "../assets/icons/profile.svg";
import { useAnalyticsApi } from "../services/apiClient";
import { useLoading } from "../contexts/LoadingContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import * as ApiTypes from "../types/api";

const Demographics = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const analyticsApi = useAnalyticsApi();
  const { showLoading, hideLoading } = useLoading();
  const { showSnackbar } = useSnackbar();
  const [demographics, setDemographics] = useState<ApiTypes.DemographicsAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!surveyId) {
      showSnackbar("No survey ID provided.", "error");
      navigate("/projects/dashboard");
      return;
    }

    const fetchDemographics = async () => {
      showLoading();
      try {
        const data = await analyticsApi.getDemographics(surveyId);
        setDemographics(data);
      } catch (error: unknown) {
        console.error("Failed to fetch demographics:", error);
        showSnackbar("Failed to load demographics data.", "error");
      } finally {
        setLoading(false);
        hideLoading();
      }
    };

    fetchDemographics();
  }, [surveyId, navigate, showSnackbar, showLoading, hideLoading, analyticsApi]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen dark:text-gray-300">
        <p>Loading demographics...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 h-screen rounded-l-xl flex flex-col">
      <div className="py-3 px-6 flex justify-between items-center flex-shrink-0 border-b border-[#E5E7EB] dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              surveyId
                ? navigate(`/survey/questionnaires/${surveyId}`)
                : navigate("/projects/dashboard")
            }>
            <Back />
          </button>
          <p className="font-semibold text-lg dark:text-gray-100">Demographics</p>
        </div>
        <div>
          <Profile />
        </div>
      </div>

      <div className="p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <p className="font-medium text-xl dark:text-gray-100">Target Audience Demographics</p>
          {demographics && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {demographics.totalParticipants} participant
              {demographics.totalParticipants === 1 ? "" : "s"}
            </p>
          )}
        </div>

        {demographics ? (
          <div className="space-y-6">
            {demographics.ageGroups && demographics.ageGroups.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Age Distribution</h3>
                <div className="space-y-2">
                  {demographics.ageGroups.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.ageGroup || "Unknown"}</span>
                      <span className="text-sm font-medium dark:text-gray-200">
                        {item.count || 0} ({item.percentage || 0}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {demographics.genderDistribution && demographics.genderDistribution.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Gender Distribution</h3>
                <div className="space-y-2">
                  {demographics.genderDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.gender || "Unknown"}</span>
                      <span className="text-sm font-medium dark:text-gray-200">
                        {item.count || 0} ({item.percentage || 0}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {demographics.locations && demographics.locations.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Location Distribution</h3>
                <div className="space-y-2">
                  {demographics.locations.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {[item.region, item.country].filter(Boolean).join(", ") || "Unknown"}
                      </span>
                      <span className="text-sm font-medium dark:text-gray-200">
                        {item.count || 0} ({item.percentage || 0}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!demographics.ageGroups?.length &&
              !demographics.genderDistribution?.length &&
              !demographics.locations?.length && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No demographic breakdown available yet.</p>
                </div>
              )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No demographics data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demographics;
