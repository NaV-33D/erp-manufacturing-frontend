import React, { useMemo, useState } from "react";
import FilterBar from "../../../components/FilterBar";
import CusTable from "../../../components/CusTable";
import { Field, Modal } from "./helper";
import ConfirmDeleteModal from "../../../components/modals/ConfirmDeleteModal";

const dummyPermissions = [
  {
    id: 1,
    name: "Read",
    code: "READ",
    description: "View records",
  },
  {
    id: 2,
    name: "Create",
    code: "CREATE",
    description: "Create new records",
  },
  {
    id: 3,
    name: "Update",
    code: "UPDATE",
    description: "Modify existing records",
  },
  {
    id: 4,
    name: "Delete",
    code: "DELETE",
    description: "Remove records",
  },
];

const emptyPermission = {
  name: "",
  code: "",
  description: "",
};

const PermissionsTab = () => {
  const [permissions, setPermissions] = useState(dummyPermissions);
  const [filtersState, setFiltersState] = useState({ search: "" });

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [activePermission, setActivePermission] = useState(null);
  const [form, setForm] = useState(emptyPermission);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteObj, setDeleteObj] = useState(null);

  const filters = [
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search name / code / description...",
      value: filtersState.search,
      className: "w-[420px]",
    },
  ];

  const onFilterChange = (key, val) =>
    setFiltersState((p) => ({ ...p, [key]: val }));

  const filtered = useMemo(() => {
    const q = filtersState.search.toLowerCase();
    if (!q) return permissions;

    return permissions.filter((p) =>
      `${p.name} ${p.code} ${p.description}`.toLowerCase().includes(q),
    );
  }, [permissions, filtersState]);

  const openCreate = () => {
    setMode("create");
    setActivePermission(null);
    setForm(emptyPermission);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setMode("edit");
    setActivePermission(p);
    setForm({ ...p });
    setShowForm(true);
  };

  const submitForm = () => {
    if (mode === "create") {
      const newPermission = {
        ...form,
        id: Date.now(),
      };
      setPermissions([...permissions, newPermission]);
    } else {
      setPermissions((prev) =>
        prev.map((p) => (p.id === activePermission.id ? { ...p, ...form } : p)),
      );
    }

    setShowForm(false);
  };

  const confirmDelete = () => {
    setPermissions((prev) => prev.filter((p) => p.id !== deleteObj.id));
    setShowDelete(false);
    setDeleteObj(null);
  };

  const columns = [
    { key: "name", title: "Name" },
    { key: "code", title: "Code" },
    {
      key: "description",
      title: "Description",
      render: (row) => row.description || "-",
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
          + Add Permission
        </button>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onApply={() => {}}
        onReset={() => setFiltersState({ search: "" })}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-2">
        <CusTable columns={columns} data={filtered} />
      </div>

      {showForm && (
        <Modal
          title={mode === "create" ? "Add Permission" : "Edit Permission"}
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
                setForm((p) => ({
                  ...p,
                  code: v.toUpperCase().replace(/\s+/g, "_"),
                }))
              }
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
        title="Delete Permission"
        message={`Are you sure you want to delete "${deleteObj?.name}"?`}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default PermissionsTab;
