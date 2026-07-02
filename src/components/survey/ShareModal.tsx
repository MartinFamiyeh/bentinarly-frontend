import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useSurveysApi } from "../../services/apiClient";
import { useAuth } from "../../contexts/AuthContext";
import Close from "../../assets/icons/close.svg";
import Profile from "../../assets/icons/profile.svg";
import { ChevronDown, X } from "lucide-react";
import * as ApiTypes from "../../types/api";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  surveyOwnerId: string;
  surveyOwnerName: string;
  surveyStatus: ApiTypes.SurveyStatus;
  onSurveyStatusChange?: (status: ApiTypes.SurveyStatus) => void;
};

const ShareModal = ({
  isOpen,
  onClose,
  surveyId,
  surveyOwnerId,
  surveyOwnerName,
  surveyStatus,
  onSurveyStatusChange,
}: ShareModalProps) => {
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [selectedPermission, setSelectedPermission] = useState<ApiTypes.CollaboratorPermission>(1); // 1 = ViewOnly
  const [collaborators, setCollaborators] = useState<ApiTypes.SurveyCollaboratorDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isLoadingShareLink, setIsLoadingShareLink] = useState(false);
  const [isTogglingResponse, setIsTogglingResponse] = useState(false);
  const [isCopyingLink, setIsCopyingLink] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { user } = useAuth();
  const surveysApi = useSurveysApi();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if current user can manage collaborators (owner or CoOwner)
  const canManageCollaborators = user?.id === surveyOwnerId || 
    collaborators.some(c => c.userId === user?.id && c.permission === 3);

  const isCollectingResponses = surveyStatus === 2;
  const canToggleResponses = surveyStatus === 2 || surveyStatus === 5;
  const canCopyLink = surveyStatus !== 1;

  const loadShareLink = async () => {
    if (!canCopyLink) return;

    setIsLoadingShareLink(true);
    try {
      const linkData = await surveysApi.getShareableLink(surveyId);
      if (linkData.shareableLink) {
        setShareLink(linkData.shareableLink);
      } else {
        const regenerated = await surveysApi.regenerateShareableLink(surveyId);
        setShareLink(regenerated.shareableLink);
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      showSnackbar(errorMessage || "Failed to load shareable link.", "error");
    } finally {
      setIsLoadingShareLink(false);
    }
  };

  // Load collaborators and share link when modal opens
  useEffect(() => {
    if (isOpen && surveyId && surveyId !== "new") {
      loadCollaborators();
      if (canCopyLink) {
        loadShareLink();
      }
    }
  }, [isOpen, surveyId, surveyStatus]);

  const loadCollaborators = async () => {
    setIsLoading(true);
    try {
      const data = await surveysApi.getSurveyCollaborators(surveyId);
      setCollaborators(data);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      showSnackbar(errorMessage || "Failed to load collaborators.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCollaborator = async () => {
    if (!email.trim()) {
      showSnackbar("Please enter an email address.", "error");
      return;
    }

    if (!canManageCollaborators) {
      showSnackbar("You don't have permission to add collaborators.", "error");
      return;
    }

    setIsAddingCollaborator(true);
    try {
      const newCollaborator = await surveysApi.addSurveyCollaborator(surveyId, {
        email: email.trim(),
        permission: selectedPermission,
      });
      setCollaborators([...collaborators, newCollaborator]);
      setEmail("");
      setSelectedPermission(1); // Reset to ViewOnly
      showSnackbar("Collaborator added successfully.", "success");
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      showSnackbar(errorMessage || "Failed to add collaborator.", "error");
    } finally {
      setIsAddingCollaborator(false);
    }
  };

  const handleUpdatePermission = async (userId: string, newPermission: ApiTypes.CollaboratorPermission) => {
    if (!canManageCollaborators) {
      showSnackbar("You don't have permission to update collaborators.", "error");
      return;
    }

    try {
      const updated = await surveysApi.updateSurveyCollaborator(surveyId, userId, {
        permission: newPermission,
      });
      setCollaborators(collaborators.map(c => c.userId === userId ? updated : c));
      setIsPermissionDropdownOpen(null);
      showSnackbar("Permission updated successfully.", "success");
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      showSnackbar(errorMessage || "Failed to update permission.", "error");
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    if (!canManageCollaborators) {
      showSnackbar("You don't have permission to remove collaborators.", "error");
      return;
    }

    try {
      await surveysApi.removeSurveyCollaborator(surveyId, userId);
      setCollaborators(collaborators.filter(c => c.userId !== userId));
      showSnackbar("Collaborator removed successfully.", "success");
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      showSnackbar(errorMessage || "Failed to remove collaborator.", "error");
    }
  };

  const handleToggleResponses = async () => {
    if (!canToggleResponses || isTogglingResponse) return;

    setIsTogglingResponse(true);
    try {
      if (surveyStatus === 2) {
        const updated = await surveysApi.pauseSurvey(surveyId);
        onSurveyStatusChange?.(updated.status);
        showSnackbar("Response collection paused.", "success");
      } else if (surveyStatus === 5) {
        const updated = await surveysApi.resumeSurvey(surveyId);
        onSurveyStatusChange?.(updated.status);
        showSnackbar("Response collection resumed.", "success");
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      showSnackbar(errorMessage || "Failed to update response collection.", "error");
    } finally {
      setIsTogglingResponse(false);
    }
  };

  const handleCopyResponderLink = async () => {
    if (!canCopyLink || isCopyingLink) return;

    setIsCopyingLink(true);
    try {
      let link = shareLink;
      if (!link) {
        const linkData = await surveysApi.getShareableLink(surveyId);
        link = linkData.shareableLink;
        if (!link) {
          const regenerated = await surveysApi.regenerateShareableLink(surveyId);
          link = regenerated.shareableLink;
        }
        setShareLink(link);
      }

      await navigator.clipboard.writeText(link);
      showSnackbar("Responder link copied to clipboard.", "success");
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      showSnackbar(errorMessage || "Failed to copy responder link.", "error");
    } finally {
      setIsCopyingLink(false);
    }
  };

  const getPermissionLabel = (permission: ApiTypes.CollaboratorPermission): string => {
    switch (permission) {
      case 1: return "View Only";
      case 2: return "Edit Only";
      case 3: return "Co-owner";
      default: return "Unknown";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPermissionDropdownOpen(null);
      }
    };

    if (isPermissionDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPermissionDropdownOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100] m-0">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-[600px] space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-900">
          <p className="font-semibold text-sm leading-none tracking-normal">Share</p>
          <div onClick={onClose} className="cursor-pointer">
            <Close />
          </div>
        </div>

        {/* Add Collaborator Section */}
        {canManageCollaborators && (
          <div className="px-6 flex items-center gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isAddingCollaborator) {
                  handleAddCollaborator();
                }
              }}
              className="w-full px-3 py-2 bg-gray-100 rounded-md text-sm focus:ring-0 focus:outline-none disabled:opacity-50"
              placeholder="Enter email address to invite"
              disabled={isAddingCollaborator}
            />
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsPermissionDropdownOpen("new")}
                className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 flex items-center gap-1 min-w-[120px] justify-between"
                disabled={isAddingCollaborator}>
                <span>{getPermissionLabel(selectedPermission)}</span>
                <ChevronDown size={14} />
              </button>
              {isPermissionDropdownOpen === "new" && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setSelectedPermission(1);
                      setIsPermissionDropdownOpen(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    View Only
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPermission(2);
                      setIsPermissionDropdownOpen(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    Edit Only
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPermission(3);
                      setIsPermissionDropdownOpen(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    Co-owner
                  </button>
                </div>
              )}
            </div>
            <button
              className="px-3 py-1 bg-[#292929] text-white text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddCollaborator}
              disabled={!email.trim() || isAddingCollaborator}>
              {isAddingCollaborator ? "Adding..." : "Invite"}
            </button>
          </div>
        )}

        {/* Who Has Access Section */}
        <div className="px-6">
          <p className="text-sm mb-3 font-medium text-[#292929] dark:text-gray-200">Who has access to this survey</p>
          
          {/* Survey Owner */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Profile />
              <p className="font-semibold text-base">{surveyOwnerName}</p>
            </div>
            <p className="text-xs text-[#696969] dark:text-gray-400 font-medium">Owner</p>
          </div>

          {/* Collaborators */}
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading collaborators...</p>
          ) : collaborators.length === 0 ? (
            <p className="text-sm text-gray-500">No collaborators yet.</p>
          ) : (
            collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Profile />
                  <p className="font-medium text-base">
                    {collaborator.userName || collaborator.email || "Unknown User"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {canManageCollaborators ? (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsPermissionDropdownOpen(collaborator.userId)}
                        className="flex items-center gap-1 text-xs text-[#696969] dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200">
                        <span>{getPermissionLabel(collaborator.permission)}</span>
                        <ChevronDown size={12} />
                      </button>
                      {isPermissionDropdownOpen === collaborator.userId && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => handleUpdatePermission(collaborator.userId, 1)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              collaborator.permission === 1 ? "bg-orange-50 dark:bg-gray-800 text-[#FE5102]" : ""
                            }`}>
                            View Only
                          </button>
                          <button
                            onClick={() => handleUpdatePermission(collaborator.userId, 2)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              collaborator.permission === 2 ? "bg-orange-50 dark:bg-gray-800 text-[#FE5102]" : ""
                            }`}>
                            Edit Only
                          </button>
                          <button
                            onClick={() => handleUpdatePermission(collaborator.userId, 3)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              collaborator.permission === 3 ? "bg-orange-50 dark:bg-gray-800 text-[#FE5102]" : ""
                            }`}>
                            Co-owner
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-[#696969] dark:text-gray-400 font-medium">
                      {getPermissionLabel(collaborator.permission)}
                    </span>
                  )}
                  {canManageCollaborators && (
                    <button
                      onClick={() => handleRemoveCollaborator(collaborator.userId)}
                      className="ml-2 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Responders Section */}
        <div className="pb-2">
          <div className="flex items-center justify-between border-b px-6 py-2">
            <p className="font-semibold text-sm leading-none tracking-normal">Responders</p>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#292929] dark:text-gray-200">
                {surveyStatus === 1
                  ? "Publish the survey to start collecting responses"
                  : "Collecting response for this survey"}
              </p>
              <button
                onClick={handleToggleResponses}
                disabled={!canToggleResponses || isTogglingResponse}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCollectingResponses ? "bg-[#FE5102]" : "bg-gray-300"
                }`}>
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    isCollectingResponses ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {isLoadingShareLink && canCopyLink && (
              <p className="text-xs text-gray-500">Loading shareable link...</p>
            )}
            {shareLink && canCopyLink && (
              <p className="text-xs text-gray-500 break-all">{shareLink}</p>
            )}
            <button 
              onClick={handleCopyResponderLink}
              disabled={!canCopyLink || isCopyingLink}
              className="w-full bg-[#FE51020D] py-1 px-3 text-[#FE5102] text-sm font-medium rounded-md hover:bg-[#FE510220] disabled:opacity-50 disabled:cursor-not-allowed">
              {isCopyingLink ? "Copying..." : "Copy responder link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ShareModal;
