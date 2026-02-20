import React, { useMemo, useState } from "react";
import { Field, Modal } from "./helper";
import FilterBar from "../../../components/FilterBar";
import CusTable from "../../../components/CusTable";
import ConfirmDeleteModal from "../../../components/modals/ConfirmDeleteModal";

const dummyModules = [
  {
    id: 1,
    slNo: 1,
    name: "Dashboard",
    code: "DASHBOARD",
    description: "Main dashboard and analytics",
    display_order: 1,
    icon: "dashboard",
    is_active: true,
  },
  {
    id: 2,
    slNo: 2,
    name: "User Management",
    code: "USER_MANAGEMENT",
    description: "Manage users, roles and permissions",
    display_order: 2,
    icon: "people",
    is_active: true,
  },
  {
    id: 3,
    slNo: 3,
    name: "Inventory",
    code: "INVENTORY",
    description: "Manage warehouse inventory",
    display_order: 3,
    icon: "inventory",
    is_active: true,
  },
  {
    id: 4,
    slNo: 4,
    name: "Shipping",
    code: "SHIPPING",
    description: "",
    display_order: 4,
    icon: "local_shipping",
    is_active: false,
  },
];

const emptyModule = {
  name: "",
  code: "",
  description: "",
  display_order: "",
  icon: "",
  is_active: true,
};

const ModulesTab = () => {
  const [filtersState, setFiltersState] = useState({
    search: "",
    status: "All",
  });

  const [modules, setModules] = useState(dummyModules);

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [activeModule, setActiveModule] = useState(null);
  const [form, setForm] = useState(emptyModule);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteObj, setDeleteObj] = useState(null);

  const filters = [
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search name / code / description...",
      value: filtersState.search,
      className: "w-[360px]",
    },
    {
      key: "status",
      label: "Status",
      value: filtersState.status,
      options: ["All", "Active", "Inactive"],
      className: "w-[200px]",
    },
  ];

  const onFilterChange = (key, val) =>
    setFiltersState((p) => ({ ...p, [key]: val }));

  const filteredModules = useMemo(() => {
    const q = filtersState.search.toLowerCase();
    return modules.filter((m) => {
      const matchesSearch =
        !q || `${m.name} ${m.code} ${m.description}`.toLowerCase().includes(q);

      const matchesStatus =
        filtersState.status === "All" ||
        (filtersState.status === "Active" && m.is_active) ||
        (filtersState.status === "Inactive" && !m.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [modules, filtersState]);

  const openCreate = () => {
    setMode("create");
    setActiveModule(null);
    setForm(emptyModule);
    setShowForm(true);
  };

  const openEdit = (m) => {
    setMode("edit");
    setActiveModule(m);
    setForm({
      ...m,
      display_order: String(m.display_order),
    });
    setShowForm(true);
  };

  const submitForm = () => {
    if (mode === "create") {
      const newModule = {
        ...form,
        id: Date.now(),
        slNo: modules.length + 1,
        display_order: Number(form.display_order),
      };
      setModules([...modules, newModule]);
    } else {
      setModules((prev) =>
        prev.map((m) =>
          m.id === activeModule.id
            ? {
                ...m,
                ...form,
                display_order: Number(form.display_order),
              }
            : m,
        ),
      );
    }

    setShowForm(false);
  };

  const confirmDelete = () => {
    setModules((prev) => prev.filter((m) => m.id !== deleteObj.id));
    setShowDelete(false);
    setDeleteObj(null);
  };

  const columns = [
    { key: "slNo", title: "Sl No." },
    { key: "name", title: "Name" },
    { key: "code", title: "Code" },
    {
      key: "description",
      title: "Description",
      render: (row) => row.description || "-",
    },
    { key: "display_order", title: "Order" },
    { key: "icon", title: "Icon" },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            row.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
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
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setDeleteObj(row);
              setShowDelete(true);
            }}
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <button
          onClick={openCreate}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
        >
          + Add Module
        </button>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onApply={() => {}}
        onReset={() => setFiltersState({ search: "", status: "All" })}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-2">
        <CusTable columns={columns} data={filteredModules} />
      </div>

      {showForm && (
        <Modal
          title={mode === "create" ? "Add Module" : "Edit Module"}
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={submitForm}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
              >
                {mode === "create" ? "Create" : "Update"}
              </button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field
              label="Name"
              value={form.name}
              onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            />
            <Field
              label="Code"
              value={form.code}
              onChange={(v) =>
                setForm((p) => ({ ...p, code: v.toUpperCase() }))
              }
            />
            <Field
              label="Display Order"
              value={form.display_order}
              onChange={(v) => setForm((p) => ({ ...p, display_order: v }))}
            />
            <Field
              label="Icon"
              value={form.icon}
              onChange={(v) => setForm((p) => ({ ...p, icon: v }))}
            />
            <div className="md:col-span-2">
              <Field
                label="Description"
                value={form.description}
                onChange={(v) => setForm((p) => ({ ...p, description: v }))}
              />
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDeleteModal
        open={showDelete}
        title="Delete Module"
        message={`Are you sure you want to delete "${deleteObj?.name}"?`}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ModulesTab;
