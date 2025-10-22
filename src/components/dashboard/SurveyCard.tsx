import SurveyImage from "../../assets/icons/survey_file.svg";
import Menu from "../../assets/icons/more.svg";
import { formatDate } from "../../functions";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
import RenameSurvey from "./RenameSurvey";
import MoveSurvey from "./MoveSurvey";
import { useSnackbar } from "../../contexts/SnackbarContext";

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

const Portal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

const SurveyCard = ({ survey }: SurveyCardProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [isRenameSurveyModalOpen, setIsRenameSurveyModalOpen] = useState(false);
  const [isMoveSurveyModalOpen, setIsMoveSurveyModalOpen] = useState(false);
  const [isDeleteSurveyModalOpen, setIsDeleteSurveyModalOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const toggleMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY, left: rect.left });
    }
    setOpen((prev) => !prev);
  };

  const closeMenu = (e: MouseEvent) => {
    if (buttonRef.current && !buttonRef.current.contains(e.target as Node) && open) {
      setOpen(false);
    }
  };

  const handleDuplicate = () => {
    showSnackbar("Survey duplicated successfully.", "success");
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [open]);

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
    <>
      <div className="grid grid-cols-12 items-center py-4 px-6 border border-[#2929291A]/10 rounded-md bg-[#FFFFFF] text-sm">
        <div className="col-span-4 flex items-center gap-4">
          <SurveyImage />
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
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="text-gray-400 hover:text-gray-600  p-2">
            <Menu />
          </button>
        </div>
      </div>

      <RenameSurvey
        isOpen={isRenameSurveyModalOpen}
        onClose={() => setIsRenameSurveyModalOpen(false)}
      />

      <MoveSurvey isOpen={isMoveSurveyModalOpen} onClose={() => setIsMoveSurveyModalOpen(false)} />

      {open && (
        <Portal>
          <div
            style={{
              top: coords.top,
              left: coords.left - 200 + (buttonRef.current?.offsetWidth || 0), // align to right
            }}
            className="absolute bg-white shadow-lg border rounded-md w-52 z-50">
            <ul className="py-1 text-sm text-gray-700">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setIsRenameSurveyModalOpen(true)}>
                Rename
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDuplicate}>
                Duplicate
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setIsMoveSurveyModalOpen(true)}>
                Move to
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Download Questionnaire</li>
            </ul>
          </div>
        </Portal>
      )}
    </>
  );
};

export default SurveyCard;
