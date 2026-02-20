import React, { useMemo } from "react";
import FilterBar from "@/pages/components/FilterBar";
import CusTable from "@/pages/components/CusTable";
import { useToast } from "@/pages/components/toast/ToastProvider";
import { useTransactions } from "./useTransactions";
import Pagination from "../../../../components/Pagination";
import {
  getStatusBadgeColor,
  getTransactionTypeColor,
} from "../../../../components/helper";

export default function TransactionsTab() {
  const toast = useToast();
  const { 
    loading, 
    f, 
    setF, 
    filters, 
    data, 
    pagination, 
    refresh,
    handlePageChange 
  } = useTransactions(toast);

  const columns = useMemo(
    () => [
      {
        key: "transaction_id",
        title: "Transaction ID",
        render: (r) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              #{r.transaction_id}
            </span>
            <span className="text-xs text-gray-500 mt-0.5">
              {new Date(r.created_at).toLocaleDateString()}
            </span>
          </div>
        ),
      },
      {
        key: "transaction_type",
        title: "Type",
        render: (r) => (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
              r.transaction_type,
            )}`}
          >
            {r.transaction_type}
          </span>
        ),
      },
      {
        key: "sku",
        title: "Product",
        render: (r) => (
          <div className="flex flex-col max-w-xs">
            <span className="text-sm font-medium text-gray-900">
              {r.sku?.sku_code}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {r.sku?.sku_name}
            </span>
          </div>
        ),
      },
      {
        key: "qty",
        title: "Quantity",
        render: (r) => {
          const isPositive = Number(r.qty) >= 0;
          return (
            <div className="flex items-center">
              <span className={`inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded-md text-sm font-semibold border ${
                isPositive 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {isPositive ? `+${r.qty}` : r.qty}
              </span>
            </div>
          );
        },
      },
      {
        key: "locations",
        title: "Movement",
        render: (r) => (
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">From</span>
              <span className="text-sm font-medium text-gray-900">
                {r.from_location?.location_code || (
                  <span className="text-gray-400">—</span>
                )}
              </span>
              {r.from_location?.zone && (
                <span className="text-xs text-gray-500">Zone {r.from_location.zone}</span>
              )}
            </div>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-500">To</span>
              <span className="text-sm font-medium text-gray-900">
                {r.to_location?.location_code || (
                  <span className="text-gray-400">—</span>
                )}
              </span>
              {r.to_location?.zone && (
                <span className="text-xs text-gray-500">Zone {r.to_location.zone}</span>
              )}
            </div>
          </div>
        ),
      },
      {
        key: "batch_no",
        title: "Batch",
        render: (r) => (
          <div className="text-sm text-gray-900">
            {r.batch_no ? (
              <span className="inline-flex items-center px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 font-mono text-xs">
                {r.batch_no}
              </span>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>
        ),
      },
      {
        key: "reference",
        title: "Reference",
        render: (r) => (
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-700">
              {r.reference_type}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {r.reference_id}
            </span>
            {r.notes && (
              <div className="text-xs text-gray-500 truncate mt-1" title={r.notes}>
                {r.notes}
              </div>
            )}
          </div>
        ),
      },
      {
        key: "timestamp",
        title: "Time",
        render: (r) => (
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-900">
              {new Date(r.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(r.created_at).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filters}
        showActions
        onFilterChange={(k, v) => setF((s) => ({ ...s, [k]: v }))}
        onApply={refresh}
        onReset={() =>
          setF({
            warehouse_id: "All",
            sku_id: "All",
            location_id: "All",
            transaction_type: "All",
            page: 1,
            limit: 10,
          })
        }
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <div className="text-gray-500">Loading transactions...</div>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex justify-center items-center h-64 flex-col">
          <div className="text-gray-500 mb-2 text-lg">
            No transactions found
          </div>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Refresh
          </button>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500">
            Showing {data.length} of {pagination.total} transactions • Page {pagination.page} of {pagination.pages}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <CusTable columns={columns} data={data} />
          </div>

          {pagination.pages > 1 && (
            <div className="rounded-b-lg border border-t-0 border-gray-200 bg-white">
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}