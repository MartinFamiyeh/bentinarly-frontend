import { useState } from "react";
import Back from "../assets/icons/back-arrow.svg";
import Profile from "../assets/icons/profile.svg";

const Demographics = () => {
  const [isTargetDemographicSet, setIsTargetDemographicsSet] = useState(false);

  return (
    <div className="bg-white h-screen rounded-l-xl flex flex-col">
      <div className="py-3 px-6 flex justify-between items-center flex-shrink-0 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-4">
          <Back />
          <p className="font-semibold text-lg">Lorem Ipsium</p>
        </div>

        <div>
          <Profile />
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Target Audience</p>
          <div>
            <button
              className="btn bg-[#FE5102] text-sm"
              onClick={() => {
                setIsTargetDemographicsSet(!isTargetDemographicSet);
              }}>
              Add Targeting Option
            </button>
          </div>
        </div>
        {isTargetDemographicSet && (
          <div className="h-[50vh] text-center content-center">
            <p className="font-medium">
              Define your audience. Click on ❝{" "}
              <span className="text-[#FE5102]"> add targeting option </span>❞ to set who should your
              take your survey
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Demographics;
