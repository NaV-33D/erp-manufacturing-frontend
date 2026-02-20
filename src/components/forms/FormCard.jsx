import React from "react";

const FormCard = ({ title, right, children }) => {
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {right}
      </div>
      <div className="mt-4 border-t pt-4">{children}</div>
    </div>
  );
};

export default FormCard;
