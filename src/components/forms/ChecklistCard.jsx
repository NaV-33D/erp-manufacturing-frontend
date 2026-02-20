import React from "react";
import FormCard from "./FormCard";
import { CheckCircle2, Circle } from "lucide-react";

const Item = ({ label, done }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-b-0">
    <div className="text-sm text-gray-600">{label}</div>
    {done ? (
      <CheckCircle2 size={16} className="text-green-600" />
    ) : (
      <Circle size={16} className="text-gray-300" />
    )}
  </div>
);

const ChecklistCard = ({ items = [] }) => {
  return (
    <FormCard title="Readiness Checklist">
      <div className="space-y-0">
        {items.map((it) => (
          <Item key={it.label} label={it.label} done={it.done} />
        ))}
      </div>
    </FormCard>
  );
};

export default ChecklistCard;
