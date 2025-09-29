import SurveyImage from "../../assets/icons/survey.png";
import Menu from "../../assets/icons/menu.png";
import { formatDate } from "../../functions";

type SurveyCardProps = {
  survey: SurveyType;
};

type SurveyType = {
  id: string;
  name: string;
  members: number;
  status: "draft" | "scheduled" | "live" | "paused" | "closed" | "completed";
  createdAt: number;
};

const SurveyCard = ({ survey }: SurveyCardProps) => {
  const getStatusColors = (status: SurveyType["status"]) => {
    switch (status) {
      case "draft":
        return { bg: "bg-[#6A6A6A0A]", text: "text-[#6A6A6A]" };
      case "scheduled":
        return { bg: "bg-[#4F46E50A]", text: "text-[#4F46E5]" };
      case "live":
        return { bg: "bg-[#02E1090A]", text: "text-[#02E109]" };
      case "paused":
        return { bg: "bg-[#E691000A]", text: "text-[#E69100]" };
      case "closed":
        return { bg: "bg-[#FD246D0A]", text: "text-[#FD246D]" };
      case "completed":
        return { bg: "bg-[#027B000A]", text: "text-[#027B00]" };
      default:
        return { bg: "bg-[#F3F4F6]", text: "text-[#4B5563]" };
    }
  };

  const { bg, text } = getStatusColors(survey.status);

  const completion = "0/1000";
  const createdBy = "Emmanuella";
  const access = survey.name.includes("1")
    ? "Owner"
    : survey.name.includes("2")
    ? "Edit Only"
    : survey.name.includes("3")
    ? "Co-owner"
    : "View Only";

  return (
    <div className="grid grid-cols-12 items-center py-4 px-6 border border-[#2929291A]/10 rounded-md bg-[#FFFFFF] text-sm">
      <div className="col-span-4 flex items-center gap-4">
        <img src={SurveyImage} alt="survey-icon" />
        <div>
          <p className="font-medium text-sm text-[#292929] leading-[18px] text-nowrap w-[18rem] overflow-hidden text-ellipsis">
            {survey.name}
          </p>
          <p className="text-[#696969] text-xs">{survey.members} Member(s)</p>
        </div>
      </div>
      <div className="col-span-2">
        <p className="text-xs text-[#696969]">Completion</p>
        <p className="font-medium text-sm text-[#292929]">{completion}</p>
      </div>
      <div className="col-span-1 flex ">
        <span className={`px-3 py-1 rounded-lg text-xs ${bg} ${text}`}>
          {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
        </span>
      </div>
      <div className="col-span-3 ml-2">
        <p className="text-xs text-[#696969]"> Created By</p>
        <p className="text-sm text-[#292929]">
          <span>{createdBy}</span> | {formatDate(survey.createdAt)}
        </p>
      </div>
      <div className="col-span-1 text-gray-700">
        <p className="text-xs text-[#696969]">Access</p>
        <p className="font-medium text-[#292929] text-sm">{access}</p>
      </div>
      <div className="col-span-1 text-right">
        <button className="text-gray-400 hover:text-gray-600">
          <img src={Menu} alt="menu-icon" className="rotate-90" />
        </button>
      </div>
    </div>
  );
};

export default SurveyCard;
