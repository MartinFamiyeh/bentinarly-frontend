type AuthAccountType = "Researcher" | "Participant";

interface AuthBrandHeaderProps {
  accountType: AuthAccountType;
  title: string;
  description: string;
}

const AuthBrandHeader = ({ accountType, title, description }: AuthBrandHeaderProps) => {
  const isParticipant = accountType === "Participant";

  return (
    <div className="space-y-3">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <img src="/logo.svg" alt="Logo" className="w-6 h-6 shrink-0" />
          <span className="text-[25px] font-semibold text-[#292929]">Bentinarly Poll</span>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
            isParticipant
              ? "bg-[#FFF5F0] text-[#FE5102]"
              : "bg-[#F3F0FF] text-[#7C3AED]"
          }`}>
          {accountType}
        </span>
      </div>
      <div>
        <h1 className="text-[24px] font-bold text-[#313131] mb-2">{title}</h1>
        <p className="text-sm text-[#696969]">{description}</p>
      </div>
    </div>
  );
};

export default AuthBrandHeader;
