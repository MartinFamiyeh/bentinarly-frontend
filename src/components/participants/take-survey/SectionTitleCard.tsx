import type { SurveySection } from "../../../types/api";

type SectionTitleCardProps = {
  section: SurveySection;
};

const SectionTitleCard = ({ section }: SectionTitleCardProps) => {
  return (
    <div className="rounded-xl border border-[#FE510233] bg-[#FFF5F0] p-5">
      <h2 className="text-base font-bold text-[#FE5102]">{section.title}</h2>
      {section.description && (
        <p className="mt-2 text-sm text-[#696969]">{section.description}</p>
      )}
    </div>
  );
};

export default SectionTitleCard;
