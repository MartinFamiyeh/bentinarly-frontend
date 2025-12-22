import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useSurveysApi } from "../../services/apiClient";
import * as ApiTypes from "../../types/api";

type SurveySettingsModalProps = { 
  isOpen: boolean; 
  onClose: () => void;
  surveyId: string;
  currentSettings: ApiTypes.SurveySettings;
  onSettingsUpdated?: (updatedSurvey: ApiTypes.SurveyDto) => void;
};

const SurveySettings = ({ 
  isOpen, 
  onClose, 
  surveyId, 
  currentSettings,
  onSettingsUpdated 
}: SurveySettingsModalProps) => {
  const [settings, setSettings] = useState<ApiTypes.SurveySettings>(currentSettings);
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const surveysApi = useSurveysApi();

  useEffect(() => {
    if (isOpen) {
      setSettings(currentSettings);
    }
  }, [isOpen, currentSettings]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof ApiTypes.SurveySettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (key: keyof ApiTypes.SurveySettings, value: string | number | undefined) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Use dedicated settings endpoint
      const updatedSurvey = await surveysApi.updateSurveySettings(surveyId, settings);
      
      showSnackbar("Survey settings updated successfully.", "success");
      if (onSettingsUpdated) {
        onSettingsUpdated(updatedSurvey);
      }
      onClose();
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      showSnackbar(errorMessage || "Failed to update survey settings.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const ToggleSwitch = ({ 
    label, 
    description, 
    checked, 
    onChange 
  }: { 
    label: string; 
    description?: string; 
    checked: boolean; 
    onChange: () => void;
  }) => (
    <div className="flex items-start justify-between py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-[#FE5102]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 m-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto px-6 pt-6 pb-10 space-y-6">
        <div>
          <p className="font-bold text-2xl leading-none tracking-normal">Survey Settings</p>
          <p className="text-[16px] leading-none text-gray-600 mt-2">
            Configure how your survey behaves and what information is collected.
          </p>
        </div>

        <div className="space-y-0">
          <ToggleSwitch
            label="Allow Anonymous Responses"
            description="Allow respondents to submit without logging in"
            checked={settings.allowAnonymous ?? false}
            onChange={() => handleToggle("allowAnonymous")}
          />

          <ToggleSwitch
            label="Require Login"
            description="Require respondents to log in before taking the survey"
            checked={settings.requireLogin ?? false}
            onChange={() => handleToggle("requireLogin")}
          />

          <ToggleSwitch
            label="Collect Email Addresses"
            description="Collect email addresses from respondents"
            checked={settings.collectEmails ?? false}
            onChange={() => handleToggle("collectEmails")}
          />

          <ToggleSwitch
            label="One Response Per Person"
            description="Prevent users from submitting multiple responses"
            checked={settings.oneResponsePerPerson ?? false}
            onChange={() => handleToggle("oneResponsePerPerson")}
          />

          <ToggleSwitch
            label="Shuffle Questions"
            description="Randomize the order of questions for each respondent"
            checked={settings.shuffleQuestions ?? false}
            onChange={() => handleToggle("shuffleQuestions")}
          />

          <ToggleSwitch
            label="Show Progress"
            description="Display progress indicator to respondents"
            checked={settings.showProgress ?? false}
            onChange={() => handleToggle("showProgress")}
          />

          <ToggleSwitch
            label="Allow Save and Continue"
            description="Allow respondents to save their progress and continue later"
            checked={settings.allowSaveAndContinue ?? false}
            onChange={() => handleToggle("allowSaveAndContinue")}
          />
        </div>

        {/* Max Responses */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Maximum Responses
          </label>
          <p className="text-xs text-gray-500">
            Set a limit on the number of responses. Leave empty for unlimited.
          </p>
          <input
            type="number"
            min="1"
            value={settings.maxResponses || ""}
            onChange={(e) => handleChange("maxResponses", e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Unlimited"
            className="w-full p-3 border border-[#A1A5B7] rounded focus:outline-none focus:ring-1 focus:ring-[#FE5102]"
          />
        </div>

        {/* Password Protection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Password Protection
          </label>
          <p className="text-xs text-gray-500">
            Require a password for respondents to access the survey. Leave empty to disable.
          </p>
          <input
            type="password"
            value={settings.password || ""}
            onChange={(e) => handleChange("password", e.target.value || undefined)}
            placeholder="No password"
            className="w-full p-3 border border-[#A1A5B7] rounded focus:outline-none focus:ring-1 focus:ring-[#FE5102]"
          />
        </div>

        {/* Expiration Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Expiration Date
          </label>
          <p className="text-xs text-gray-500">
            Set when the survey should stop accepting responses. Leave empty for no expiration.
          </p>
          <input
            type="datetime-local"
            value={settings.expiresAt ? new Date(settings.expiresAt).toISOString().slice(0, 16) : ""}
            onChange={(e) => handleChange("expiresAt", e.target.value ? new Date(e.target.value).toISOString() : undefined)}
            className="w-full p-3 border border-[#A1A5B7] rounded focus:outline-none focus:ring-1 focus:ring-[#FE5102]"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 rounded text-[#696969] bg-[#F4F4F4] hover:bg-gray-200 w-full transition-all duration-300 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 rounded text-white bg-[#FE5102] hover:bg-orange-600 w-full transition-all duration-300 disabled:opacity-50">
            {isLoading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default SurveySettings;

