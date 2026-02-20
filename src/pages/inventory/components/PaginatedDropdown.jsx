import React, { useEffect, useRef, useState } from "react";
import http from "../../../api/http";
import { createPortal } from "react-dom";
import Pagination from "../../components/Pagination";

const PaginatedDropdown = ({
  value,
  selectedItem,
  onChange,
  placeholder = "Select",
  endpoint, // "/clients" | "/skus" | "/locations"
  renderItem, // how to show item
  limit = 10,
  disabled = false,
  enableSearch = true,
  islabel,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});

  const btnRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const calcPos = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ top: r.bottom + 6, left: r.left, width: r.width });
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
        `${endpoint}?page=${page}&limit=${limit}&search=${search}`,
      );

      const data = res?.data?.data;
      setItems(data?.clients || data?.skus || data?.locations || []);
      setPagination(data?.pagination || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadPage(1);
  }, [open, search]);
  useEffect(() => {
    if (value && items.length === 0) {
      loadPage(1);
    }
  }, [value]);

  const selected =
    items.find((it) => String(it.id) === String(value)) || selectedItem || null;
  return (
    <div className="relative">
      {islabel && (
        <label className="block mb-1 text-xs font-medium text-gray-600">
          {islabel}
        </label>
      )}
      <button
        ref={btnRef}
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className="w-full rounded-md border px-3 py-2 text-left text-sm bg-white"
      >
        {selected ? renderItem(selected).title : placeholder}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[999999] rounded-md border bg-white shadow-xl"
            style={pos}
          >
            {enableSearch && (
              <div className="p-2 border-b">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
            )}

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-sm text-gray-500">Loading…</div>
              ) : items.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  No records found
                </div>
              ) : (
                items.map((it) => {
                  const view = renderItem(it);
                  return (
                    <button
                      key={it.id}
                      onClick={() => {
                        onChange(it.id, it);
                        setOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <div className="text-sm font-medium">{view.title}</div>
                      {view.subtitle && (
                        <div className="text-xs text-gray-500">
                          {view.subtitle}
                        </div>
                      )}
                    </button>
                  );
                })
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

export default PaginatedDropdown;
