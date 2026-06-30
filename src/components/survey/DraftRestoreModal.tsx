interface DraftRestoreModalProps {
  savedAt: number;
  onRestore: () => void;
  onDiscard: () => void;
}

const DraftRestoreModal = ({ savedAt, onRestore, onDiscard }: DraftRestoreModalProps) => {
  const formattedTime = new Date(savedAt).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-6 py-6 space-y-4">
        <p className="font-bold text-xl text-gray-900">Restore unsaved draft?</p>
        <p className="text-sm text-gray-600">
          A local draft from {formattedTime} differs from the last saved version. Would you like
          to restore your unsaved changes?
        </p>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onDiscard}
            className="flex-1 px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors">
            Use saved version
          </button>
          <button
            type="button"
            onClick={onRestore}
            className="flex-1 px-4 py-2 rounded-lg text-white bg-[#FE5102] hover:bg-orange-600 font-medium transition-colors">
            Restore draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftRestoreModal;
