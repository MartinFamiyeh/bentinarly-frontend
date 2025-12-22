import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTemplatesApi } from "../services/apiClient";
import { useLoading } from "../contexts/LoadingContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import * as ApiTypes from "../types/api";

const Templates = () => {
  const templatesApi = useTemplatesApi();
  const { showLoading, hideLoading } = useLoading();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ApiTypes.SurveyTemplateDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      showLoading();
      try {
        const response = await templatesApi.getTemplates({
          page: 1,
          pageSize: 50,
          searchTerm: searchTerm || undefined,
        });
        setTemplates(response.items || []);
      } catch (error: any) {
        console.error("Failed to fetch templates:", error);
        showSnackbar("Failed to load templates.", "error");
      } finally {
        setLoading(false);
        hideLoading();
      }
    };

    fetchTemplates();
  }, [searchTerm]);

  const handleCreateFromTemplate = async (templateId: string) => {
    showLoading();
    try {
      const survey = await templatesApi.createSurveyFromTemplate(templateId, {
        title: `Survey from Template`,
        description: "",
      });
      showSnackbar("Survey created from template!", "success");
      navigate(`/survey/questionnaires/${survey.id}`);
    } catch (error: any) {
      showSnackbar("Failed to create survey from template.", "error");
    } finally {
      hideLoading();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen rounded-l-xl flex flex-col overflow-y-auto">
      <div className="py-6 px-8 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Survey Templates</h1>
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE5102]"
          />
        </div>
      </div>

      <div className="p-8">
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {template.category || "Uncategorized"}
                  </span>
                  <button
                    onClick={() => handleCreateFromTemplate(template.id)}
                    className="px-4 py-2 bg-[#FE5102] text-white rounded-lg hover:bg-orange-600 transition-colors text-sm">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
