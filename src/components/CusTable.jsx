import React from "react";

const CusTable = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {(data || []).map((row, idx) => (
            <tr key={row?.id ?? idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 align-middle text-sm text-gray-700"
                >
                  {typeof col.render === "function"
                    ? col.render(row, idx) // ✅ now supports index
                    : row?.[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CusTable;
