import React, { useEffect, useRef, useState } from "react";
import http from "../../../api/http";
import Pagination from "../Pagination";
import { createPortal } from "react-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const PaginatedClientDropdown = ({
  value,
  onChange,
  placeholder = "Select client",
  limit = 10,
  disabled = false,
  enableSearch = false,
  selectedLabel,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit,
  });

  const btnRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const calcPos = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      top: r.bottom + 8,
      left: r.left,
      width: r.width,
    });
  };

  useEffect(() => {
    if (!open) return;

    calcPos();
    window.addEventListener("scroll", calcPos, true);
    window.addEventListener("resize", calcPos);

    return () => {
      window.removeEventListener("scroll", calcPos, true);
      window.removeEventListener("resize", calcPos);
    };
  }, [open]);

  const loadPage = async (page = 1) => {
    try {
      setLoading(true);

      const res = await http.get(
        `/clients?page=${page}&limit=${limit}&search=${search}`,
      );

      setClients(res?.data?.data?.clients || []);
      setPagination(res?.data?.data?.pagination || {});
    } catch {
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadPage(1);
  }, [open, search]);

  useEffect(() => {
    if (value && !selectedClient) {
      setSelectedClient({
        id: value,
        client_name: placeholder,
        client_code: "",
      });
    }
  }, [value]);

  useEffect(() => {
    if (!value || selectedClient) return;

    const loadClientById = async () => {
      try {
        const res = await http.get(`/clients/${value}`);
        setSelectedClient(res?.data?.data);
      } catch (e) {
        console.error("Failed to load client by id");
      }
    };

    loadClientById();
  }, [value]);

  const selected =
    clients.find((c) => String(c.id) === String(value)) || selectedClient;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className="w-full rounded-md border px-3 py-2 text-left text-sm flex justify-between items-center"
      >
        <span>
          {selected
            ? `${selected.client_name} (${selected.client_code})`
            : placeholder}
        </span>
        <span className="ml-2 text-gray-400">
          {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </span>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[999999] rounded-md border bg-white shadow-xl"
            style={{ ...pos }}
          >
            {enableSearch && (
              <div className="p-2 border-b">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search client…"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
            )}

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-sm text-gray-500">Loading…</div>
              ) : clients.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  No records found
                </div>
              ) : (
                clients.map((c) => (
                  <button
                    key={c.id}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50"
                    onClick={() => {
                      onChange(c.id, c);
                      setSelectedClient(c);
                      setOpen(false);
                    }}
                  >
                    <div className="text-sm font-medium">{c.client_name}</div>
                    <div className="text-xs text-gray-500">{c.client_code}</div>
                  </button>
                ))
              )}
            </div>

            <Pagination
              pagination={pagination}
              onPageChange={(p) => loadPage(p)}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};

export default PaginatedClientDropdown;
