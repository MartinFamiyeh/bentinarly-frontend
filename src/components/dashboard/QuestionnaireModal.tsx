import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";
import Rafiki from "../../assets/images/rafiki.png";

type Question = {
  id: string;
  type: "radio" | "text" | "checkbox";
  question: string;
  options?: string[];
  placeholder?: string;
};

type QuestionnaireModalProps = {
  questions: Question[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answers: Record<string, string | string[]>) => void;
  title: string;
  description?: string;
  initialAnswers?: Record<string, string | string[]>;
};

const QuestionnaireModal = ({
  questions,
  isOpen,
  onClose,
  onSubmit,
  title,
  initialAnswers = {},
}: QuestionnaireModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setAnswers(initialAnswers);
      setShowThankYou(false);
    }
  }, [isOpen, initialAnswers]);

  if (!isOpen) return null;

  const currentQuestion = questions[currentStep];

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowThankYou(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    onSubmit(answers);
    setCurrentStep(0);
    setAnswers({});
    setShowThankYou(false);
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-[600px] px-6 pt-6 pb-10 space-y-6">
        {!showThankYou && (
          <div className="flex justify-between items-center gap-4">
            <div className="h-[6px] bg-[#F2F2F2] dark:bg-gray-700 rounded-md w-full">
              <div
                className="h-full bg-[#FE5102] rounded-md transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close">
              <AiOutlineClose size={18} color="#696969" />
            </button>
          </div>
        )}

        {!showThankYou && (
          <div className="">
            <h2 className="text-lg font-bold text-[#313131] dark:text-gray-100">{title}</h2>
          </div>
        )}

        <div className="">
          {!showThankYou ? (
            <>
              {currentQuestion && (
                <div className="mb-6">
                  <p className="font-medium text-[#292929] dark:text-gray-200 mb-8">{currentQuestion.question}</p>
                  {currentQuestion.type === "radio" && (
                    <div className="space-y-4">
                      {currentQuestion.options?.map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={currentQuestion.id}
                            value={option}
                            checked={answers[currentQuestion.id] === option}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                            className="text-[#FE5102] focus:ring-[#FE5102] w-5 h-5"
                          />
                          <span className="text-[#292929] dark:text-gray-200">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === "text" && (
                    <input
                      type="text"
                      value={(answers[currentQuestion.id] as string) || ""}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      placeholder={currentQuestion.placeholder}
                      className="w-full p-3 border border-[#A1A5B7] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#FE5102]"
                    />
                  )}
                </div>
              )}

              <div className="flex justify-between gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-2 rounded text-[#696969] dark:text-gray-300 bg-[#F4F4F4] dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 w-full transition-all duration-300">
                    Previous
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion?.id || ""]}
                  className={`px-6 py-2 rounded text-white w-full transition-all duration-300 ${
                    !answers[currentQuestion?.id || ""]
                      ? "bg-[#FE510233] cursor-not-allowed"
                      : "bg-[#FE5102] hover:bg-orange-600"
                  } ${currentStep === 0 ? "ml-auto" : ""}`}>
                  {currentStep < questions.length - 1 ? "Next" : "Save"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <img src={Rafiki} alt="Thank You" className="mx-auto mb-6 w-[316px]" />
              <h3 className="text-xl font-semibold text-[#222222] dark:text-gray-100 mb-3">Thank You for Sharing!</h3>
              <p className="text-[#222222] dark:text-gray-300 mb-6 leading-[100%]">
                Your feedback helps us serve you better. Look out for a more personalized and
                impactful experience from now on.
              </p>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#FE5102] text-white font-semibold rounded hover:bg-orange-500 w-full transition-all duration-300">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;
