import React from "react";

const ConfirmModal = ({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  variant = "danger",
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  const confirmBtnClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !loading && onClose?.()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button
            disabled={loading}
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm text-gray-700 disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-sm text-white disabled:opacity-60 ${confirmBtnClass}`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
