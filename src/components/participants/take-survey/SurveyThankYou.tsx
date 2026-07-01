import { Link } from "react-router-dom";
import SurveyCompleteIllustration from "../../../assets/icons/survey-complete.svg";
import SurveyCoinsIllustration from "../../../assets/icons/survey-complete-coins.svg";

type SurveyThankYouProps = {
  rewardAmount?: number;
};

const SurveyThankYou = ({ rewardAmount }: SurveyThankYouProps) => {
  const hasReward = rewardAmount != null && rewardAmount > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <div className="rounded-xl border border-[#EEEEEE] bg-white p-8 text-center shadow-sm">
        <img
          src={SurveyCompleteIllustration}
          alt=""
          className="mx-auto mb-6 h-32 w-auto"
        />
        <h1 className="text-xl font-bold text-[#292929]">Thank You for Completing the Survey!</h1>
        <p className="mt-2 text-sm text-[#696969]">
          Your responses have been submitted successfully.
        </p>
      </div>

      {hasReward && (
        <div className="rounded-xl border border-[#EEEEEE] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#292929]">Reward:</p>
              <p className="text-4xl font-bold text-[#292929]">
                GHS {rewardAmount.toFixed(2)}
              </p>
              <p className="text-sm text-[#696969]">
                Congratulations! You&apos;ve earned this reward for completing this survey. Your
                wallet has been credited. Keep going to earn more rewards!
              </p>
              <Link
                to="/surveys/rewards"
                className="inline-block text-sm font-bold text-[#FE5102] hover:opacity-80">
                Redeem Reward
              </Link>
            </div>
            <img
              src={SurveyCoinsIllustration}
              alt=""
              className="mx-auto h-28 w-auto sm:mx-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyThankYou;
