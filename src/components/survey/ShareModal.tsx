import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSnackbar } from "../../contexts/SnackbarContext";
import Close from "../../assets/icons/close.svg";
import Profile from "../../assets/icons/profile.svg";
import Invite from "../../assets/icons/invite.svg";
import { ChevronDown } from "lucide-react";

type CommentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CommentModal = ({ isOpen, onClose }: CommentModalProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteeStatus, setInviteeStatus] = useState<"Co-owner" | "Edit Only" | "View Only">(
    "View Only"
  );
  const [isReceivingResponses, setIsReceivingResponses] = useState(true);
  const { showSnackbar } = useSnackbar();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // open the confirmation dialog (don't delete immediately)
  const openDeleteConfirm = () => {
    setIsDropdownOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100] m-0">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] space-y-4">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <p className="font-semibold text-sm leading-none tracking-normal">Share</p>
          <div onClick={onClose} className="cursor-pointer">
            <Close />
          </div>
        </div>

        <div className="px-6 flex items-center gap-3">
          <input
            type="email"
            required
            className="w-full px-3 py-2 bg-gray-100 rounded-md text-sm focus:ring-0 focus:outline-none disabled:opacity-50"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Add comma seperated emails to invite"
          />
          <button
            className="px-3 py-1 bg-[#292929] text-white text-sm rounded-md disabled:opacity-50"
            onClick={() => {}}
            disabled={!email.trim()}>
            Invite
          </button>
        </div>

        <div className="px-6">
          <p className="text-sm mb-3 font-medium text-[#292929]">Who has access to this survey</p>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Profile />
              <p className="font-semibold text-base">Eric Joel</p>
            </div>
            <p className="text-xs text-[#696969] font-medium">Owner</p>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Profile />
              <p className="font-medium text-base">Eric Joel</p>
            </div>
            <div ref={dropdownRef} className="relative">
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setIsDropdownOpen((p) => !p)}>
                <span className="text-xs text-[#696969] font-medium">{inviteeStatus}</span>
                <ChevronDown size={12} className="text-[#696969]" />
              </div>

              {isDropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-sm shadow-gray-300 py-1 z-50">
                  <button
                    onClick={() => {
                      setInviteeStatus("View Only");
                      setIsDropdownOpen((p) => !p);
                    }}
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    View Only
                  </button>
                  <button
                    onClick={() => {
                      setInviteeStatus("Edit Only");
                      setIsDropdownOpen((p) => !p);
                    }}
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    Edit Only
                  </button>
                  <button
                    onClick={() => {
                      setInviteeStatus("Co-owner");
                      setIsDropdownOpen((p) => !p);
                    }}
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-sm  hover:bg-gray-100">
                    Co-owner
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <p className="text-sm mb-3 font-medium text-[#292929]">Invites ent</p>
          <div>
            <div className="flex items-center gap-2">
              <Invite />
              <p className="font-medium text-base ">ericjoel@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="pb-2">
          <div className="flex items-center justify-between border-b px-6 py-2">
            <p className="font-semibold text-sm leading-none tracking-normal">Responders</p>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#292929]">
                Collecting response for this survey
              </p>
              <button
                onClick={() => {
                  setIsReceivingResponses(!isReceivingResponses);
                }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  isReceivingResponses ? "bg-[#FE5102]" : "bg-gray-300"
                }`}>
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    isReceivingResponses ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <button className="w-full bg-[#FE51020D] py-1 px-3 text-[#FE5102] text-sm font-medium rounded-md">
              Copy responder link
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CommentModal;
