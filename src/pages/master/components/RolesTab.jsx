import React, { useMemo, useState } from "react";
import FilterBar from "../../../components/FilterBar";
import CusTable from "../../../components/CusTable";
import ConfirmDeleteModal from "../../../components/modals/ConfirmDeleteModal";
import { Field, Modal } from "./helper";

const dummyModules = [
  { id: 1, name: "Dashboard", code: "DASHBOARD" },
  { id: 2, name: "Users", code: "USER_MANAGEMENT" },
  { id: 3, name: "Inventory", code: "INVENTORY" },
];

const dummyPermissions = [
  { id: 1, code: "READ" },
  { id: 2, code: "CREATE" },
  { id: 3, code: "UPDATE" },
  { id: 4, code: "DELETE" },
];

const dummyRoles = [
  {
    id: 1,
    role_name: "Admin",
    role_code: "ADMIN",
    description: "Full access",
    is_active: true,
  },
  {
    id: 2,
    role_name: "Manager",
    role_code: "MANAGER",
    description: "Limited access",
    is_active: true,
  },
];

const emptyRole = {
  role_name: "",
  role_code: "",
  description: "",
  is_active: true,
};

const RolesTab = () => {
  const [roles, setRoles] = useState(dummyRoles);
  const [modules] = useState(dummyModules);
  const [permissions] = useState(dummyPermissions);

  const [filtersState, setFiltersState] = useState({
    search: "",
    status: "All",
  });

  const [selectedRole, setSelectedRole] = useState(null);
  const [grantedMap, setGrantedMap] = useState({});

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [activeRole, setActiveRole] = useState(null);
  const [form, setForm] = useState(emptyRole);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteObj, setDeleteObj] = useState(null);

  const filters = [
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search role name / code / description...",
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

  const filteredRoles = useMemo(() => {
    const q = filtersState.search.toLowerCase();
    return roles.filter((r) => {
      const matchesSearch =
        !q ||
        `${r.role_name} ${r.role_code} ${r.description}`
          .toLowerCase()
          .includes(q);

      const matchesStatus =
        filtersState.status === "All" ||
        (filtersState.status === "Active" && r.is_active) ||
        (filtersState.status === "Inactive" && !r.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [roles, filtersState]);

  const openCreate = () => {
    setMode("create");
    setForm(emptyRole);
    setShowForm(true);
  };

  const openEdit = (r) => {
    setMode("edit");
    setActiveRole(r);
    setForm({ ...r });
    setShowForm(true);
  };

  const submitForm = () => {
    if (mode === "create") {
      const newRole = {
        ...form,
        id: Date.now(),
      };
      setRoles([...roles, newRole]);
    } else {
      setRoles((prev) =>
        prev.map((r) => (r.id === activeRole.id ? { ...r, ...form } : r)),
      );
    }
    setShowForm(false);
  };

  const confirmDelete = () => {
    setRoles((prev) => prev.filter((r) => r.id !== deleteObj.id));

    if (selectedRole?.id === deleteObj.id) {
      setSelectedRole(null);
      setGrantedMap({});
    }

    setShowDelete(false);
  };

  const roleColumns = [
    { key: "role_name", title: "Role Name" },
    { key: "role_code", title: "Role Code" },
    {
      key: "description",
      title: "Description",
      render: (row) => row.description || "-",
    },
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
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700"
            onClick={() => openEdit(row)}
          >
            Edit
          </button>
          <button
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700"
            onClick={() => setSelectedRole(row)}
          >
            Manage Access
          </button>
          <button
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white"
            onClick={() => {
              setDeleteObj(row);
              setShowDelete(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const toggleGrant = (moduleId, permissionId) => {
    setGrantedMap((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || {}),
        [permissionId]: !prev?.[moduleId]?.[permissionId],
      },
    }));
  };

  const isGranted = (moduleId, permissionId) =>
    !!grantedMap?.[moduleId]?.[permissionId];

  return (
    <div
      className={`grid grid-cols-1 gap-6 ${
        selectedRole ? "lg:grid-cols-2" : "lg:grid-cols-1"
      }`}
    >
      {/* LEFT */}
      <div>
        <div className="mb-4 flex justify-end">
          <button
            onClick={openCreate}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            + Add Role
          </button>
        </div>

        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onApply={() => {}}
          onReset={() => setFiltersState({ search: "", status: "All" })}
        />

        <div className="rounded-lg border border-gray-200 bg-white p-2">
          <CusTable columns={roleColumns} data={filteredRoles} />
        </div>
      </div>

      {/* RIGHT ACCESS MATRIX */}
      {selectedRole && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b px-5 py-4 flex justify-between">
            <div>
              <div className="text-sm font-semibold">Role Access Control</div>
              <div className="text-xs text-gray-600">
                Editing: {selectedRole.role_name}
              </div>
            </div>
            <button
              onClick={() => setSelectedRole(null)}
              className="text-xs text-red-500"
            >
              Close
            </button>
          </div>

          <div className="p-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs text-gray-500">Module</th>
                  {permissions.map((p) => (
                    <th key={p.id} className="px-4 py-3 text-xs text-gray-500">
                      {p.code}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {modules.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.code}</div>
                    </td>
                    {permissions.map((p) => (
                      <td key={p.id} className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isGranted(m.id, p.id)}
                          onChange={() => toggleGrant(m.id, p.id)}
                          className="h-4 w-4"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <Modal
          title={mode === "create" ? "Add Role" : "Edit Role"}
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-md border px-4 py-2 text-sm"
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
          <div className="grid gap-3">
            <Field
              label="Role Name"
              value={form.role_name}
              onChange={(v) => setForm((p) => ({ ...p, role_name: v }))}
            />
            <Field
              label="Role Code"
              value={form.role_code}
              onChange={(v) =>
                setForm((p) => ({
                  ...p,
                  role_code: v.toUpperCase(),
                }))
              }
            />
            <Field
              label="Description"
              value={form.description}
              onChange={(v) => setForm((p) => ({ ...p, description: v }))}
            />
          </div>
        </Modal>
      )}

      <ConfirmDeleteModal
        open={showDelete}
        title="Delete Role"
        message={`Are you sure you want to delete "${deleteObj?.role_name}"?`}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default RolesTab;
