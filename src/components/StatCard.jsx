import React from "react";

const StatCard = ({ title, value, accentColor }) => {
  return (
    <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
      {/* Accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: accentColor }}
      />

      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
