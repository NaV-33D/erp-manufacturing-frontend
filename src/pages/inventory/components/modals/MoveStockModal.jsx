// inventory/modals/MoveStockModal.jsx
import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import http from "@/api/http";
import PaginatedDropdown from "../PaginatedDropdown";
import { useToast } from "../../../components/toast/ToastProvider";

const defaultForm = {
  warehouse_id: "",
  sku_id: "",
  from_location_id: "",
  to_location_id: "",
  batch_no: "",
  serial_no: "",
  expiry_date: "",
  qty: "",
  reason: "",
  notes: "",
};

const MoveStockModal = ({ open, onClose, initialData, onSuccess }) => {
  const toast = useToast();
  const [form, setForm] = useState(defaultForm);
  const [warehouses, setWarehouses] = useState([]);

  const resetAndClose = () => {
    setForm(defaultForm);
    onClose();
  };

  const submit = async () => {
    if (!form.qty) {
      toast.error("Quantity missing");
      return;
    }
    if (!form.to_location_id) {
      toast.error("To Location missing");
      return;
    }
    if (!form.sku_id) {
      toast.error("SKU missing");
      return;
    }
    if (!form.from_location_id) {
      toast.error("From Location missing");
      return;
    }
    if (form.from_location_id === form.to_location_id) {
      toast.error("From & To locations cannot be same");
      return;
    }
    try {
      const res = await http.post("/inventory/transfer", {
        ...form,
        qty: Number(form.qty),
      });

      toast.success(res?.data?.message);
      onSuccess?.();
      resetAndClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to move stock");
    }
  };

  useEffect(() => {
    if (!open) return;

    http.get("/warehouses").then((res) => {
      setWarehouses(res?.data?.data || []);
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        warehouse_id: initialData.warehouse_id ?? "",
        sku_id: initialData.sku_id ?? "",
        from_location_id: initialData.location_id ?? "",
        to_location_id: "",
        batch_no: initialData.batch_no ?? "",
        serial_no: initialData.serial_no ?? "",
        expiry_date: initialData.expiry_date ?? "",
        qty: initialData.available_qty ?? "",
        reason: "",
        notes: "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [open, initialData]);

  const isFromLocationLocked = !!initialData?.location_id;
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Move Stock"
      footer={
        <>
          <button onClick={resetAndClose} className="px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Transfer
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-600">SKU</label>
          <select
            className="col-span-2 rounded-md border px-3 py-2 text-sm"
            value={form.warehouse_id}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                warehouse_id: e.target.value,
                from_location_id: "",
                to_location_id: "",
              }))
            }
          >
            <option value="">Select Warehouse</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.warehouse_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            SKU
          </label>
          <PaginatedDropdown
            disabled={!!initialData?.sku_id}
            endpoint="/skus"
            value={form.sku_id}
            onChange={(skuId) =>
              setForm((prev) => ({
                ...prev,
                sku_id: skuId,
              }))
            }
            placeholder="Select SKU"
            renderItem={(sku) => ({
              title: `${sku.sku_name} (${sku.sku_code})`,
              subtitle: `Client: ${sku.client?.client_name}`,
            })}
          />
        </div>
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Quantity
          </label>
          <input
            placeholder="Quantity"
            type="number"
            className="rounded-md border px-3 py-2 text-sm"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            From Location
          </label>
          <PaginatedDropdown
            endpoint="/locations"
            params={{ warehouse_id: form.warehouse_id }}
            value={form.from_location_id}
            disabled={isFromLocationLocked || !form.warehouse_id}
            onChange={(loc) => {
              setForm((prev) => ({
                ...prev,
                from_location_id: loc,
              }));
            }}
            placeholder="From Location"
            renderItem={(loc) => ({
              title: loc.location_code,
              subtitle: loc.location_type,
            })}
          />
        </div>
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            To Location
          </label>
          <PaginatedDropdown
            endpoint="/locations"
            params={{ warehouse_id: form.warehouse_id }}
            value={form.to_location_id}
            disabled={!form.warehouse_id}
            onChange={(loc) =>
              setForm((prev) => ({
                ...prev,
                to_location_id: loc,
              }))
            }
            placeholder="To Location"
            renderItem={(loc) => ({
              title: loc.location_code,
              subtitle: loc.location_type,
            })}
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Batch No
          </label>
          <input
            placeholder="Batch No"
            className="rounded-md border px-3 py-2 text-sm"
            value={form.batch_no}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, batch_no: e.target.value }))
            }
          />
        </div>

        {form.serial_no !== "" && (
          <input
            placeholder="Serial No"
            className="rounded-md border px-3 py-2 text-sm"
            value={form.serial_no}
            onChange={(e) =>
              setForm((p) => ({ ...p, serial_no: e.target.value }))
            }
          />
        )}

        {form.expiry_date !== "" && (
          <input
            type="date"
            className="rounded-md border px-3 py-2 text-sm"
            value={form.expiry_date}
            onChange={(e) =>
              setForm((p) => ({ ...p, expiry_date: e.target.value }))
            }
          />
        )}

        <input
          className="col-span-2 rounded-md border px-3 py-2 text-sm"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <textarea
          className="col-span-2 rounded-md border px-3 py-2 text-sm"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>
    </BaseModal>
  );
};

export default MoveStockModal;
