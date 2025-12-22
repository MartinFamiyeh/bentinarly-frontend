import { useNavigate } from "react-router-dom";
import SurveyImage from "../../assets/icons/survey_file.svg";
import { formatDate } from "../../functions";
import * as ApiTypes from "../../types/api";

type SurveyCardProps = {
  survey: ApiTypes.SurveyDto;
};

const SurveyCard = ({ survey }: SurveyCardProps) => {
  const navigate = useNavigate();

  const handleTakeSurvey = () => {
    // Navigate to survey preview/take survey page
    if (survey.shareableLink) {
      window.open(survey.shareableLink, "_blank");
    } else {
      navigate(`/survey/preview?surveyId=${survey.id}`);
    }
  };

  return (
    <div className="p-4 border border-[#EEEEEE] rounded-xl bg-[#FFFFFF] space-y-4">
      <div className="bg-[#EFEFEF] rounded-md w-full h-[140px]"></div>
      <p className="text-sm font-medium text-[#292929]">{survey.title || "Untitled Survey"}</p>
      <p className="text-xs text-[#696969] line-clamp-2">{survey.description || "No description"}</p>
      {survey.rewardPerResponse && (
        <p className="text-sm font-bold text-[#292929]">
          GHS {survey.rewardPerResponse.toFixed(2)}
        </p>
      )}
      <div className="flex justify-between items-center">
        <p className="italic text-[#696969] text-xs">
          {survey.questionCount || 0} questions
        </p>
        <button
          onClick={handleTakeSurvey}
          className="w-[60%] btn bg-gradient-to-r from-[#FE5102] to-[#B148F3] border-none">
          Take Survey
        </button>
      </div>
    </div>
  );
};

export default SurveyCard;
