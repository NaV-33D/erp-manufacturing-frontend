import React from "react";

const PillGroup = ({ label, options = [], value = [], onChange }) => {
  const toggle = (v) => {
    const exists = value.includes(v);
    const next = exists ? value.filter((x) => x !== v) : [...value, v];
    onChange?.(next);
  };

  return (
    <div className="md:col-span-2">
      <div className="text-xs font-medium text-gray-700 mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs border ${
                active
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-white border-gray-200 text-gray-600"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PillGroup;
