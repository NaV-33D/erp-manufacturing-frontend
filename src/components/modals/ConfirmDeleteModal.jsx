import React from "react";

const ConfirmDeleteModal = ({
  open,
  title = "Delete",
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !loading && onClose?.()}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white border shadow-lg">
          <div className="p-5">
            <div className="text-lg font-semibold text-gray-900">{title}</div>
            <div className="mt-2 text-sm text-gray-600">{message}</div>
          </div>

          <div className="px-5 pb-5 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => onClose?.()}
              className="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 disabled:opacity-60"
            >
              {cancelText}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => onConfirm?.()}
              className="px-4 py-2 rounded-md bg-red-600 text-white text-sm disabled:opacity-60"
            >
              {loading ? "Deleting..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
