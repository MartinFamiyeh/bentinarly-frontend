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
      } catch (error: any) {
        console.error("Failed to fetch demographics:", error);
        showSnackbar("Failed to load demographics data.", "error");
      } finally {
        setLoading(false);
        hideLoading();
      }
    };

    fetchDemographics();
  }, [surveyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading demographics...</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen rounded-l-xl flex flex-col">
      <div className="py-3 px-6 flex justify-between items-center flex-shrink-0 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <Back />
          </button>
          <p className="font-semibold text-lg">Demographics</p>
        </div>
        <div>
          <Profile />
        </div>
      </div>

      <div className="p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <p className="font-medium text-xl">Target Audience Demographics</p>
        </div>

        {demographics ? (
          <div className="space-y-6">
            {demographics.ageDistribution && demographics.ageDistribution.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
                <div className="space-y-2">
                  {demographics.ageDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.range || item.label}</span>
                      <span className="text-sm font-medium">{item.count || 0} ({item.percentage || 0}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {demographics.genderDistribution && demographics.genderDistribution.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
                <div className="space-y-2">
                  {demographics.genderDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.gender || item.label}</span>
                      <span className="text-sm font-medium">{item.count || 0} ({item.percentage || 0}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {demographics.locationDistribution && demographics.locationDistribution.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Location Distribution</h3>
                <div className="space-y-2">
                  {demographics.locationDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.location || item.label}</span>
                      <span className="text-sm font-medium">{item.count || 0} ({item.percentage || 0}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No demographics data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demographics;
