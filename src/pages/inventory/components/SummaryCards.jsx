import React from "react";
import { toLocale } from "./inventoryFormatters";

const Card = ({ label, value, valueClass = "text-gray-900" }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <div className="text-xs text-gray-500">{label}</div>
    <div className={`mt-2 text-2xl font-semibold ${valueClass}`}>
      {typeof value === "number" ? toLocale(value) : value}
    </div>
  </div>
);

export default function SummaryCards({ cards = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {cards.map((c) => (
        <Card key={c.label} {...c} />
      ))}
    </div>
  );
}
