import { useState } from "react";

type CreateSurveyModalProps = { isOpen: boolean; onClose: () => void };

const CreateSurvey = ({ isOpen, onClose }: CreateSurveyModalProps) => {
  const [name, setname] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = () => {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] px-6 pt-6 pb-10 space-y-6">
        <p className="font-bold text-2xl leading-none tracking-normal">New Project</p>
        <p className="font-medium text-[16px] leading-none">Give a name your new project</p>
        <input
          type="text"
          value={name || ""}
          placeholder="Project Name"
          className="w-full p-3 border border-[#A1A5B7] rounded focus:outline-none focus:ring-1 focus:ring-[#FE5102]"
        />
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded text-[#696969] bg-[#F4F4F4] hover:bg-gray-200 w-full transition-all duration-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded text-white bg-[#FE5102] hover:bg-orange-600 w-full transition-all duration-300">
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
