import React from "react";

const SectionHeader = ({ title, icon }) => {
  return (
    <div className="flex items-center gap-2 mb-4 mt-8">
      {icon}
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
    </div>
  );
};

export default SectionHeader;
