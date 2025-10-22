import SurveyImage from "../../assets/icons/survey_file.svg";
import { formatDate } from "../../functions";

type SurveyCardProps = {
  survey: SurveyType;
};

type SurveyType = {
  id: string;
  name: string;
  description: string;
  status: "all" | "available" | "progress" | "completed";
  price: number;
  createdAt: number;
};

const SurveyCard = ({ survey }: SurveyCardProps) => {
  return (
    <>
      <div className="p-4 border border-[#EEEEEE] rounded-xl bg-[#FFFFFF] space-y-4">
        <div className="bg-[#EFEFEF] rounded-md w-full h-[140px]"></div>
        <p className="text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit?</p>
        <p className="text-sm font-bold text-[#292929]">GHS {survey.price.toFixed(2)}</p>
        <div className="flex justify-between items-center">
          <p className="italic text-[#696969] text-xs">5 mins</p>
          <button className="w-[60%] btn bg-gradient-to-r from-[#FE5102] to-[#B148F3] border-none">
            Take Survey
          </button>
        </div>
      </div>
    </>
  );
};

export default SurveyCard;
