// export default InventoryHolds;
import { useEffect, useState } from "react";
import CusTable from "../../../../components/CusTable";
import FilterBar from "../../../../components/FilterBar";
import Pagination from "../../../../components/Pagination";
import http from "@/api/http";
import { getInventoryHolds, releaseInventoryHold } from "../../heper";
import ConfirmModal from "../../../../components/modals/ConfirmModal";
import { useToast } from "../../../../components/toast/ToastProvider";

const StatusPill = ({ status }) => {
  const cls =
    status === "ACTIVE"
      ? "bg-orange-100 text-orange-700"
      : "bg-green-100 text-green-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
};

const InventoryHolds = () => {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    warehouse_id: "",
    client_id: "",
    location_id: "",
    status: "",
    search: "",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });

  const [warehouses, setWarehouses] = useState([]);
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);

  const [showRelease, setShowRelease] = useState(false);
  const [releaseRow, setReleaseRow] = useState(null);
  const [releaseLoading, setReleaseLoading] = useState(false);

  const fetchWarehouses = async () => {
    const res = await http.get("/warehouses");
    setWarehouses(res?.data?.data || []);
  };

  const fetchClients = async () => {
    const res = await http.get("/clients?page=1&limit=50");
    setClients(res?.data?.data?.clients || []);
  };

  const fetchLocations = async () => {
    const res = await http.get("/locations?page=1&limit=50");
    setLocations(res?.data?.data?.locations || []);
  };

  const fetchHolds = async () => {
    setLoading(true);
    try {
      const res = await getInventoryHolds(filters);

      setRows(res?.data?.data || []);
      setPagination(res?.data?.pagination || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
    fetchClients();
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchHolds();
  }, [filters]);

  const filterConfig = [
    {
      key: "warehouse_id",
      type: "select",
      label: "Warehouse",
      value: filters.warehouse_id,
      options: warehouses.map((w) => ({
        label: w.warehouse_name,
        value: w.id,
      })),
    },
    {
      key: "client_id",
      type: "select",
      label: "Client",
      value: filters.client_id,
      options: clients.map((c) => ({
        label: c.client_name,
        value: c.id,
      })),
    },
    {
      key: "location_id",
      type: "select",
      label: "Location",
      value: filters.location_id,
      options: locations.map((l) => ({
        label: l.location_code,
        value: l.id,
      })),
    },
    {
      key: "status",
      type: "select",
      label: "Status",
      value: filters.status,
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Released", value: "RELEASED" },
      ],
    },
  ];
  const handleReleaseHold = async () => {
    try {
      const res = await releaseInventoryHold(releaseRow.id, {
        release_notes: "",
      });
      if (res?.success) {
        toast.success(res?.message);
        setShowRelease(false);
      }
      fetchHolds();
    } catch (err) {
      console.log(err);
      toast.error("Failed to release hold");
    }
  };

  const tableData = rows.map((r) => ({
    id: r.id,
    holdId: r.hold_id,
    sku: r.inventory?.sku?.sku_code,
    skuSub: r.inventory?.sku?.sku_name,
    qty: r.qty,
    location: r.inventory?.location?.location_code,
    reason: r.hold_reason,
    createdBy: r.creator?.username,
    createdTime: new Date(r.created_at).toLocaleString(),
    status: r.status,
  }));

  const columns = [
    {
      key: "holdId",
      title: "Hold ID",
      render: (r) => (
        <span className="font-semibold text-blue-600">{r.holdId}</span>
      ),
    },
    {
      key: "sku",
      title: "SKU",
      render: (r) => (
        <div>
          <div className="font-semibold">{r.sku}</div>
          <div className="text-xs text-gray-500">{r.skuSub}</div>
        </div>
      ),
    },
    { key: "qty", title: "Qty" },
    { key: "location", title: "Location" },
    { key: "reason", title: "Reason" },
    { key: "createdBy", title: "Created By" },
    { key: "createdTime", title: "Created Time" },
    {
      key: "status",
      title: "Status",
      render: (r) => <StatusPill status={r.status} />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          {r.status === "ACTIVE" && (
            <button
              onClick={() => {
                setReleaseRow(r);
                setShowRelease(true);
              }}
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
            >
              Release
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filterConfig}
        onFilterChange={(k, v) => {
          console.log(k, v);
          setFilters((s) => ({ ...s, [k]: v, page: 1 }));
        }}
        onReset={() =>
          setFilters({
            warehouse_id: "",
            client_id: "",
            location_id: "",
            status: "",
            search: "",
            page: 1,
            limit: 10,
          })
        }
      />

      <CusTable columns={columns} data={tableData} loading={loading} />

      <Pagination
        pagination={pagination}
        onPageChange={(p) =>
          setFilters((s) => ({
            ...s,
            page: p,
          }))
        }
      />

      <ConfirmModal
        open={showRelease}
        title="Release Inventory Hold"
        message="Are you sure you want to release this inventory hold?"
        confirmText="Release"
        variant="primary"
        loading={releaseLoading}
        onClose={() => {
          setShowRelease(false);
          setReleaseRow(null);
        }}
        onConfirm={handleReleaseHold}
      />
    </div>
  );
};

export default InventoryHolds;
