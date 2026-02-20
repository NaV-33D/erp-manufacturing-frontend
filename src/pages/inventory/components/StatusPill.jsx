import React from "react";

const MAP = {
  Healthy: "bg-green-100 text-green-700",
  "Low Stock": "bg-orange-100 text-orange-700",
  "Expiry Risk": "bg-red-100 text-red-700",
  "QC Hold": "bg-orange-100 text-orange-700",
  "Out of Stock": "bg-gray-100 text-gray-600",
  HEALTHY: "bg-green-100 text-green-700",
  LOW_STOCK: "bg-orange-100 text-orange-700",
  EXPIRY_RISK: "bg-red-100 text-red-700",
  HOLD: "bg-orange-100 text-orange-700",
  DAMAGED: "bg-red-100 text-red-700",
  OUT_OF_STOCK: "bg-gray-100 text-gray-600",
};

const STATUS_TEXT = {
  HEALTHY: "Healthy",
  LOW_STOCK: "Low Stock",
  EXPIRY_RISK: "Expiry Risk",
  HOLD: "QC Hold",
  DAMAGED: "Damaged",
  OUT_OF_STOCK: "Out of Stock",
};

export default function StatusPill({ text }) {
  const displayText = STATUS_TEXT[text] || text;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        MAP[text] || MAP[displayText] || "bg-gray-100 text-gray-700"
      }`}
    >
      {displayText}
    </span>
  );
}
