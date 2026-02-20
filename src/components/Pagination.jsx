import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages } = pagination;
  if (!pages || pages <= 1) return null;

  const getPages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(pages, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 1) {
      rangeWithDots.push(1);
      if (range[0] > 2) rangeWithDots.push("...");
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < pages) {
      if (range[range.length - 1] < pages - 1) rangeWithDots.push("...");
      rangeWithDots.push(pages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Left */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm
          disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {getPages().map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(p)}
              className={`min-w-[36px] rounded-md px-3 py-1.5 text-sm
                ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-50"
                }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      {/* Right */}
      <button
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm
          disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
