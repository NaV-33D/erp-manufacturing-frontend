// inventory/modals/BaseModal.jsx
import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const BaseModal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 border-t px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default BaseModal;
