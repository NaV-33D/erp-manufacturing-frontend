import React from "react";

const DateTimeField = ({ label, required, value, onChange, error, helper }) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-900">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>

      <input
        type="datetime-local"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={[
          "w-full rounded-md border px-3 py-2 text-sm bg-white",
          error
            ? "border-red-300 focus:ring-red-100"
            : "border-gray-200 focus:ring-blue-100",
          "focus:outline-none focus:ring-2",
        ].join(" ")}
      />

      {error ? (
        <div className="text-xs text-red-600">{error}</div>
      ) : helper ? (
        <div className="text-xs text-gray-500">{helper}</div>
      ) : null}
    </div>
  );
};

export default DateTimeField;
