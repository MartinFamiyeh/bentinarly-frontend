type ClearFormModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ClearFormModal = ({ isOpen, onCancel, onConfirm }: ClearFormModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-[#292929]">Clear Form?</h2>
        <p className="mt-3 text-sm text-[#696969]">
          Are you sure you want to clear the form? All your responses will be permanently removed
          and cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg bg-[#F3F4F6] px-4 py-2.5 text-sm font-semibold text-[#292929] hover:bg-[#E5E7EB]">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-[#FE5102] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e54902]">
            Clear Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearFormModal;
