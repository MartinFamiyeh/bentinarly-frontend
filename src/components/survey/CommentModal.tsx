import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSnackbar } from "../../contexts/SnackbarContext";
import Menu from "../../assets/icons/more.svg";
import Close from "../../assets/icons/close.svg";
import Emoji from "../../assets/icons/emoji.svg";
import Profile from "../../assets/icons/profile.svg";
import Edit from "../../assets/icons/edit.svg";

type CommentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onResolve?: () => void;
  onDelete?: () => void;
};

const CommentModal = ({ isOpen, onClose, onResolve, onDelete }: CommentModalProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { showSnackbar } = useSnackbar();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleResolve = () => {
    setIsDropdownOpen(false);
    if (typeof onResolve === "function") {
      onResolve();
    } else {
      showSnackbar("Comment resolved.", "success");
      onClose();
    }
  };

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // open the confirmation dialog (don't delete immediately)
  const openDeleteConfirm = () => {
    setIsDropdownOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  // execute actual delete (called from confirm modal)
  const executeDelete = () => {
    setIsDeleteConfirmOpen(false);
    if (typeof onDelete === "function") {
      onDelete();
    } else {
      showSnackbar("Comment deleted.", "success");
      onClose();
    }
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] space-y-6">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <p className="font-semibold text-sm leading-none tracking-normal">Comment</p>
          <div className="flex items-center gap-4">
            <div ref={dropdownRef} className="relative">
              <div
                onClick={() => setIsDropdownOpen((p) => !p)}
                className="cursor-pointer"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}>
                <Menu />
              </div>

              {isDropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-sm shadow-gray-300 py-1 z-50">
                  <button
                    onClick={handleResolve}
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    Resolve
                  </button>
                  <button
                    onClick={openDeleteConfirm}
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div onClick={onClose} className="cursor-pointer">
              <Close />
            </div>
          </div>
        </div>
        <div className="px-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Profile />
              <p className="font-semibold text-base">Eric Joel</p>
              <p className="text-xs text-[#696969] font-medium">3 mins ago</p>
            </div>
            <div
              onClick={() => {
                setIsEditing(!isEditing);
              }}
              className="cursor-pointer">
              <Edit />
            </div>
          </div>

          {isEditing ? (
            <div>
              <textarea
                rows={2}
                className="w-full px-3 py-3 bg-gray-100 rounded-md text-sm focus:ring-0 focus:outline-none">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. A porro quia totam
                explicabo animi error. A porro quia totam explicabo animi error.
              </textarea>

              <div className="pt-4 flex justify-between items-center">
                <div>
                  <Emoji />
                </div>
                <div className="flex gap-3">
                  <button
                    className="px-3 py-1 bg-[#F4F4F4] text-xs rounded-md"
                    onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 bg-[#292929] text-white text-xs rounded-md"
                    onClick={() => setIsEditing(false)}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm leading-none">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. A porro quia totam
                explicabo animi error. A porro quia totam explicabo animi error.
              </p>
            </div>
          )}
        </div>
        <div className="px-6">
          <input
            className="w-full px-3 py-3 bg-gray-100 rounded-md text-sm focus:ring-0 focus:outline-none disabled:opacity-50"
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder="Type your comment here"
            disabled={isEditing}
          />
        </div>
        <div className="px-6 pb-4 flex justify-between items-center">
          <div>
            <Emoji />
          </div>
          <button
            className="px-3 py-1 bg-[#292929] text-white text-sm rounded-md disabled:opacity-50"
            onClick={onClose}
            disabled={isEditing}>
            Submit
          </button>
        </div>
      </div>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[110]">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[600px] p-6">
            <h3 className="font-bold text-2xl leading-none tracking-normal mb-4">Delete comment</h3>
            <p className="text-sm text-gray-700 mb-5">
              Are you sure you want to delete this comment thread? All comments in this thread will
              be deleted permanently.
            </p>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded text-[#696969] text-sm bg-[#F4F4F4] hover:bg-gray-200 w-full transition-all duration-300">
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded text-white text-sm bg-[#D00808] hover:bg-[#D00808]/90 w-full transition-all duration-300">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CommentModal;
