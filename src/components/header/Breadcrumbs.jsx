import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <div key={`${item.label}-${idx}`} className="flex items-center gap-1">
            {idx !== 0 && <ChevronRight size={14} className="text-gray-400" />}

            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:text-gray-700 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-gray-900 font-medium" : ""}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
