import React from "react";
import FormCard from "./FormCard";

const SummaryRow = ({ label, value, strong }) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <div className="text-xs text-gray-500">{label}</div>
    <div className={`text-sm ${strong ? "font-semibold" : "text-gray-900"}`}>
      {value}
    </div>
  </div>
);

const SummaryCard = ({ data }) => {
  return (
    <FormCard title="Summary">
      <div className="space-y-1">
        <div className="text-xs text-gray-500">ASN Number</div>
        <div className="bg-blue-50 text-blue-700 text-xs font-semibold inline-block px-2 py-1 rounded">
          {data.asnNumber || "GENERATED-ON-SAVE"}
        </div>

        <div className="mt-4 space-y-1">
          <div className="text-xs text-gray-500">Supplier</div>
          <div className="text-sm font-semibold text-gray-900">
            {data.supplier || "-"}
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <div className="text-xs text-gray-500">Expected Arrival</div>
          <div className="text-sm font-semibold text-gray-900">
            {data.expectedArrival || "-"}
          </div>
        </div>

        <div className="mt-4 border-t pt-3">
          <SummaryRow label="Lines" value={data.lines ?? 0} />
          <SummaryRow label="Units" value={data.units ?? 0} strong />
        </div>
      </div>
    </FormCard>
  );
};

export default SummaryCard;
