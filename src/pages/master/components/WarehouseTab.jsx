import React, { useState, useMemo } from "react";
import FilterBar from "../../../components/FilterBar";
import CusTable from "../../../components/CusTable";
import { Plus, Edit2, Trash2, Building, MapPin, Search } from "lucide-react";

const initialData = [
  {
    id: 1,
    warehouse_code: "WH001",
    warehouse_name: "Mumbai Central",
    city: "Mumbai",
    state: "Maharashtra",
    warehouse_type: "GENERAL",
    capacity_sqft: 50000,
    is_active: true,
  },
  {
    id: 2,
    warehouse_code: "WH002",
    warehouse_name: "Bangalore Hub",
    city: "Bangalore",
    state: "Karnataka",
    warehouse_type: "COLD_STORAGE",
    capacity_sqft: 30000,
    is_active: false,
  },
];

const WarehouseTab = () => {
  const [warehouses, setWarehouses] = useState(initialData);

  const [filters, setFilters] = useState({
    search: "",
    status: "All Statuses",
    city: "All Cities",
  });

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [activeWarehouse, setActiveWarehouse] = useState(null);

  const [form, setForm] = useState({
    warehouse_code: "",
    warehouse_name: "",
    city: "",
    state: "",
    warehouse_type: "GENERAL",
    capacity_sqft: "",
    is_active: true,
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "All Statuses",
      city: "All Cities",
    });
  };

  const statusOptions = ["All Statuses", "Active", "Inactive"];
  const cityOptions = ["All Cities", ...new Set(warehouses.map((w) => w.city))];

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((w) => {
      const matchesSearch =
        !filters.search ||
        `${w.warehouse_name} ${w.warehouse_code} ${w.city} ${w.state}`
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === "All Statuses" ||
        (filters.status === "Active" && w.is_active) ||
        (filters.status === "Inactive" && !w.is_active);

      const matchesCity =
        filters.city === "All Cities" || w.city === filters.city;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [warehouses, filters]);

  const openCreate = () => {
    setMode("create");
    setForm({
      warehouse_code: "",
      warehouse_name: "",
      city: "",
      state: "",
      warehouse_type: "GENERAL",
      capacity_sqft: "",
      is_active: true,
    });
    setShowForm(true);
  };

  const openEdit = (warehouse) => {
    setMode("edit");
    setActiveWarehouse(warehouse);
    setForm({ ...warehouse });
    setShowForm(true);
  };

  const submitForm = () => {
    if (mode === "create") {
      const newWarehouse = {
        ...form,
        id: Date.now(),
        capacity_sqft: Number(form.capacity_sqft),
      };
      setWarehouses([...warehouses, newWarehouse]);
    } else {
      setWarehouses((prev) =>
        prev.map((w) =>
          w.id === activeWarehouse.id
            ? { ...w, ...form, capacity_sqft: Number(form.capacity_sqft) }
            : w,
        ),
      );
    }

    setShowForm(false);
  };

  const handleDelete = (warehouse) => {
    if (!window.confirm(`Delete ${warehouse.warehouse_name}?`)) return;
    setWarehouses((prev) => prev.filter((w) => w.id !== warehouse.id));
  };

  const columns = [
    {
      key: "warehouse_code",
      title: "Code",
    },
    {
      key: "warehouse_name",
      title: "Warehouse",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-400" />
          {row.warehouse_name}
        </div>
      ),
    },
    {
      key: "location",
      title: "Location",
      render: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          {row.city}, {row.state}
        </div>
      ),
    },
    {
      key: "capacity_sqft",
      title: "Capacity",
      render: (row) => `${row.capacity_sqft.toLocaleString()} sq. ft.`,
    },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            row.is_active
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="rounded-md p-1.5 hover:bg-gray-100"
          >
            <Edit2 className="h-4 w-4 text-blue-500" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="rounded-md p-1.5 hover:bg-gray-100"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Warehouses</h1>
          <p className="text-sm text-gray-600">Manage warehouse locations</p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
        >
          <Plus className="h-4 w-4" />
          Add Warehouse
        </button>
      </div>

      <FilterBar
        filters={[
          {
            type: "search",
            key: "search",
            label: "Search",
            placeholder: "Search warehouses...",
            value: filters.search,
            icon: <Search className="h-4 w-4" />,
          },
          {
            type: "select",
            key: "status",
            label: "Status",
            value: filters.status,
            options: ["All Statuses", "Active", "Inactive"],
          },
          {
            type: "select",
            key: "city",
            label: "City",
            value: filters.city,
            options: cityOptions,
          },
        ]}
        showActions
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onApply={() => {}}
      />

      <div className="mt-6 rounded-lg border border-gray-200 bg-white">
        <CusTable columns={columns} data={filteredWarehouses} />
      </div>

      {/* Simple Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              {mode === "create" ? "Add Warehouse" : "Edit Warehouse"}
            </h2>

            <div className="space-y-3">
              <input
                placeholder="Code"
                className="w-full border px-3 py-2 rounded"
                value={form.warehouse_code}
                onChange={(e) =>
                  setForm({ ...form, warehouse_code: e.target.value })
                }
              />
              <input
                placeholder="Name"
                className="w-full border px-3 py-2 rounded"
                value={form.warehouse_name}
                onChange={(e) =>
                  setForm({ ...form, warehouse_name: e.target.value })
                }
              />
              <input
                placeholder="City"
                className="w-full border px-3 py-2 rounded"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                placeholder="State"
                className="w-full border px-3 py-2 rounded"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
              <input
                type="number"
                placeholder="Capacity (sqft)"
                className="w-full border px-3 py-2 rounded"
                value={form.capacity_sqft}
                onChange={(e) =>
                  setForm({ ...form, capacity_sqft: e.target.value })
                }
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitForm}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {mode === "create" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseTab;
