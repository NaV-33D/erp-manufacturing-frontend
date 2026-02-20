import React, { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Field, Modal } from "./helper";
import FilterBar from "../../../components/FilterBar";
import CusTable from "../../../components/CusTable";
import ConfirmDeleteModal from "../../../components/modals/ConfirmDeleteModal";
import Pagination from "../../../components/Pagination";

const dummyUsers = [
  {
    id: 1,
    username: "moinchandshah",
    email: "moin@example.com",
    first_name: "Moin",
    last_name: "Chandshah",
    phone: "9018515050",
    is_active: true,
  },
  {
    id: 2,
    username: "sami.badami",
    email: "sami@example.com",
    first_name: "Sami",
    last_name: "Badami",
    phone: "9901099091",
    is_active: true,
  },
  {
    id: 3,
    username: "krishnan.iyer",
    email: "krishnan@example.com",
    first_name: "Krishnan",
    last_name: "Iyer",
    phone: "9789106016",
    is_active: false,
  },
];

const emptyUser = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
};

const UsersTab = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [filtersState, setFiltersState] = useState({
    search: "",
    status: "All",
  });

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [activeUser, setActiveUser] = useState(null);
  const [form, setForm] = useState(emptyUser);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteUserObj, setDeleteUserObj] = useState(null);

  const [activePage, setActivePage] = useState(1);

  const filters = [
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search username / email / phone...",
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

  const filteredUsers = useMemo(() => {
    const q = filtersState.search.toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q || `${u.username} ${u.email} ${u.phone}`.toLowerCase().includes(q);

      const matchesStatus =
        filtersState.status === "All" ||
        (filtersState.status === "Active" && u.is_active) ||
        (filtersState.status === "Inactive" && !u.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [users, filtersState]);

  const openCreate = () => {
    setMode("create");
    setActiveUser(null);
    setForm(emptyUser);
    setShowForm(true);
  };

  const openEdit = (u) => {
    setMode("edit");
    setActiveUser(u);
    setForm({ ...u, password: "" });
    setShowForm(true);
  };

  const submitForm = () => {
    if (mode === "create") {
      const newUser = {
        ...form,
        id: Date.now(),
        is_active: true,
      };
      setUsers([...users, newUser]);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === activeUser.id ? { ...u, ...form } : u)),
      );
    }
    setShowForm(false);
  };

  const confirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteUserObj.id));
    setShowDelete(false);
    setDeleteUserObj(null);
  };

  const columns = [
    { key: "username", title: "Username" },
    { key: "email", title: "Email" },
    {
      key: "name",
      title: "Name",
      render: (row) =>
        `${row.first_name || ""} ${row.last_name || ""}`.trim() || "-",
    },
    { key: "phone", title: "Phone" },
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
              setDeleteUserObj(row);
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
          + Add User
        </button>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onApply={() => {}}
        onReset={() => setFiltersState({ search: "", status: "All" })}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-2">
        <CusTable columns={columns} data={filteredUsers} />

        <Pagination
          pagination={{
            page: activePage,
            pages: 2,
            total: filteredUsers.length,
            limit: 5,
          }}
          onPageChange={(p) => setActivePage(p)}
        />
      </div>

      {showForm && (
        <Modal
          title={mode === "create" ? "Add User" : "Edit User"}
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
              label="Username"
              value={form.username}
              onChange={(v) => setForm((p) => ({ ...p, username: v }))}
            />
            <Field
              label="Email"
              value={form.email}
              onChange={(v) => setForm((p) => ({ ...p, email: v }))}
            />
            <Field
              label="First Name"
              value={form.first_name}
              onChange={(v) => setForm((p) => ({ ...p, first_name: v }))}
            />
            <Field
              label="Last Name"
              value={form.last_name}
              onChange={(v) => setForm((p) => ({ ...p, last_name: v }))}
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
            />
            {mode === "create" && (
              <Field
                label="Password"
                type="password"
                value={form.password}
                onChange={(v) => setForm((p) => ({ ...p, password: v }))}
              />
            )}
          </div>
        </Modal>
      )}

      <ConfirmDeleteModal
        open={showDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteUserObj?.username}"?`}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UsersTab;
