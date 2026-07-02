import { useNavigate } from "react-router-dom";
import Thumbnail1 from "../../assets/images/survey-dummy-1.png";
import Thumbnail2 from "../../assets/images/survey-dummy-2.png";
import Thumbnail3 from "../../assets/images/survey-dummy-3.png";
import * as ApiTypes from "../../types/api";
import {
  estimateSurveyDuration,
  getParticipantStatus,
  getSurveyActionLabel,
} from "../../utils/participantSurvey";

const THUMBNAILS = [Thumbnail1, Thumbnail2, Thumbnail3];

type SurveyCardProps = {
  survey: ApiTypes.SurveyDto;
  thumbnailIndex?: number;
};

const SurveyCard = ({ survey, thumbnailIndex = 0 }: SurveyCardProps) => {
  const navigate = useNavigate();
  const participantStatus = getParticipantStatus(survey);
  const actionLabel = getSurveyActionLabel(participantStatus);
  const thumbnail = THUMBNAILS[thumbnailIndex % THUMBNAILS.length];

  const handleTakeSurvey = () => {
    navigate(`/surveys/takesurvey?surveyId=${survey.id}`, {
      state: { rewardPerResponse: survey.rewardPerResponse },
    });
  };

  return (
    <div className="flex flex-col rounded-xl border border-[#EEEEEE] dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      <img
        src={thumbnail}
        alt=""
        className="h-[140px] w-full object-cover"
      />

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[#292929] dark:text-gray-100 line-clamp-2">
            {survey.title || "Untitled Survey"}
          </p>
          <p className="text-xs text-[#696969] dark:text-gray-400">
            {estimateSurveyDuration(survey.questionCount)} • {participantStatus}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          {survey.rewardPerResponse != null && (
            <p className="text-sm font-bold text-[#292929] dark:text-gray-100">
              GHS {survey.rewardPerResponse.toFixed(2)}
            </p>
          )}

          {actionLabel && (
            <button
              onClick={handleTakeSurvey}
              className="ml-auto shrink-0 rounded-full bg-gradient-to-r from-[#FE5102] to-[#B148F3] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity">
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyCard;
