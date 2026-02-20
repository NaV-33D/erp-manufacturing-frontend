import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "../../../../../components/FilterBar";
import { useToast } from "../../../../../components/toast/ToastProvider";
import SummaryCards from "../../SummaryCards";
import StatusPill from "../../StatusPill";
import { useStockBySku } from "./useStockBySku";
import Pagination from "../../../../../components/Pagination";
import CusTable from "../../../../../components/CusTable";

export default function StockBySkuTab() {
  const toast = useToast();
  const navigate = useNavigate();

  const {
    loading,
    f,
    setF,
    filters,
    resetFilters,
    warehouses,
    summary,
    tableData,
    refresh,
    pagination,
    page,
    setPage,
  } = useStockBySku(toast);

  /* -------------------- Table Columns -------------------- */

  const columns = useMemo(
    () => [
      {
        key: "skuDetails",
        title: "SKU Details",
        render: (r) => (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-md border bg-white flex items-center justify-center">
              <img
                src={r.img}
                alt={r.sku}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    r.sku,
                  )}&background=random&color=fff`;
                }}
              />
            </div>

            <div className="leading-tight">
              <div
                onClick={() => navigate(`/inventory/sku/${r.id}`)}
                className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                {r.sku}
              </div>

              <div className="text-xs text-gray-500">{r.name}</div>

              <div className="text-xs text-gray-400">
                {r.category} • {r.uom}
              </div>
            </div>
          </div>
        ),
      },
      { key: "onHand", title: "On-hand", render: (r) => <Qty v={r.onHand} /> },
      {
        key: "available",
        title: "Available",
        render: (r) => <Qty v={r.available} className="text-green-600" />,
      },
      {
        key: "hold",
        title: "Hold",
        render: (r) => <Qty v={r.hold} className="text-orange-600" />,
      },
      {
        key: "allocated",
        title: "Allocated",
        render: (r) => <Qty v={r.allocated} className="text-blue-600" />,
      },
      {
        key: "damaged",
        title: "Damaged",
        render: (r) => <Qty v={r.damaged} className="text-red-600" />,
      },
      {
        key: "risk",
        title: "Status",
        render: (r) => <StatusPill text={r.risk} />,
      },
      {
        key: "actions",
        title: "Actions",
        render: (r) => (
          <button
            onClick={() => {
              toast.dismiss();
              toast.info("View details coming soon!");
            }}
            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            View Details
          </button>
        ),
      },
    ],
    [navigate],
  );

  /* -------------------- UI States -------------------- */

  if (loading) {
    return <LoadingState />;
  }

  if (!loading && tableData.length === 0) {
    return <EmptyState onRefresh={refresh} />;
  }

  /* -------------------- Render -------------------- */

  return (
    <div className="space-y-4">
      <SummaryCards
        cards={[
          {
            label: "Total SKUs",
            value: summary.total_skus || tableData.length,
          },
          { label: "On Hand", value: summary.total_on_hand },
          {
            label: "Available",
            value: summary.total_available,
            valueClass: "text-green-600",
          },
          {
            label: "Hold",
            value: summary.total_hold,
            valueClass: "text-orange-600",
          },
          {
            label: "Allocated",
            value: summary.total_allocated,
            valueClass: "text-blue-600",
          },
          {
            label: "Damaged",
            value: summary.total_damaged,
            valueClass: "text-red-600",
          },
        ]}
      />

      <FilterBar
        filters={filters}
        showActions
        onFilterChange={(k, v) => setF((s) => ({ ...s, [k]: v }))}
        onApply={refresh}
        onReset={resetFilters}
      />

      <ResultMeta f={f} warehouses={warehouses} count={tableData.length} />

      <div className="rounded-lg border bg-white overflow-hidden">
        <CusTable columns={columns} data={tableData} />

        <Pagination
          pagination={{
            ...(pagination || {}),
            page: page || pagination?.page || 1,
          }}
          onPageChange={(p) => {
            if (p < 1 || p > (pagination?.pages || 1)) return;
            setPage(p);
          }}
        />
      </div>

      <div className="text-xs text-gray-400 text-center">
        Click SKU Code or "View Details" for full breakdown.
      </div>
    </div>
  );
}

/* -------------------- Small Helper Components -------------------- */

const Qty = ({ v, className = "" }) => (
  <span className={`font-medium ${className}`}>{v}</span>
);

const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
      <div className="text-gray-500">Loading inventory data...</div>
    </div>
  </div>
);

const EmptyState = ({ onRefresh }) => (
  <div className="flex justify-center items-center h-64 flex-col">
    <div className="text-gray-500 mb-2 text-lg">No inventory data found</div>
    <button
      onClick={onRefresh}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
    >
      Refresh
    </button>
  </div>
);

const ResultMeta = ({ f, warehouses, count }) => {
  const warehouseLabel =
    warehouses?.find((w) => w.value === f.warehouse)?.label || f.warehouse;

  return (
    <div className="text-sm text-gray-500">
      Showing {count} SKU{count !== 1 ? "s" : ""}
      {f.warehouse !== "All" && ` in ${warehouseLabel}`}
      {f.client !== "All" && ` for ${f.client}`}
      {f.stockStatus !== "All" && ` with status "${f.stockStatus}"`}
      {f.skuSearch && ` matching "${f.skuSearch}"`}
    </div>
  );
};
