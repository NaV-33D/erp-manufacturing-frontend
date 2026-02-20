import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import http from "@/api/http";
import PaginatedClientDropdown from "@/pages/components/paginations/PaginatedUserDropdown";
import PaginatedDropdown from "../PaginatedDropdown";
import { useToast } from "../../../components/toast/ToastProvider";
const defaultForm = {
  warehouse_id: "",
  client_id: "",
  sku_id: "",
  location_id: "",
  batch_no: "",
  serial_no: "",
  expiry_date: "",
  adjustment_type: "",
  qty: "",
  reason: "",
  notes: "",
};

const AdjustStockModal = ({ open, onClose, initialData, onSuccess }) => {
  const toast = useToast();
  const [warehouses, setWarehouses] = useState([]);

  const [form, setForm] = useState(defaultForm);

  const isEditMode = !!initialData;

  const resetandclose = () => {
    setForm(defaultForm);
    onClose();
  };

  useEffect(() => {
    if (!open || !initialData) return;
    console.log(initialData);
    setForm({
      warehouse_id: initialData.warehouse_id ?? "",
      client_id: initialData.client_id ?? "",
      sku_id: initialData.sku_id ?? "",
      location_id: initialData.location_id ?? "",
      batch_no: initialData.batch_no ?? "",
      serial_no: initialData.serial_no ?? "",
      expiry_date: initialData.expiry_date ?? "",
      qty: initialData.available_qty ?? "",
      reason: "",
      notes: "",
    });
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    http.get("/warehouses").then((res) => setWarehouses(res?.data?.data || []));
  }, [open]);

  const submit = async () => {
    if (!form.adjustment_type) {
      toast.error("Please select adjustment type");
      return;
    }
    if (!form.qty || Number(form.qty) <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (!form.sku_id) {
      toast.error("Please select SKU");
      return;
    }

    if (!form.location_id) {
      toast.error("Please select location");
      return;
    }
    try {
      const res = await http.post("/inventory/adjust", {
        ...form,
        qty: Number(form.qty),
      });
      toast.success(res?.data?.message);
      onSuccess?.();
      resetandclose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to move stock");
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Adjust Stock"
      footer={
        <>
          <button onClick={resetandclose} className="px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Save Adjustment
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Warehouse
          </label>
          <select
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={form.warehouse_id}
            onChange={(e) =>
              setForm({
                ...form,
                warehouse_id: e.target.value,
                location_id: "",
              })
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

        <div className="md:col-span-2">
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Client
          </label>
          <PaginatedClientDropdown
            value={form.client_id}
            selectedLabel={
              initialData?.client_name
                ? `${initialData.client_name} (${initialData.client_code})`
                : "Select client"
            }
            onChange={(id) => setForm({ ...form, client_id: id })}
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            SKU
          </label>
          <PaginatedDropdown
            endpoint="/skus"
            value={form.sku_id}
            disabled={isEditMode}
            selectedItem={initialData?.sku}
            onChange={(id) => setForm((p) => ({ ...p, sku_id: id }))}
            placeholder="Select SKU"
            renderItem={(sku) => ({
              title: `${sku.sku_name} (${sku.sku_code})`,
              subtitle: `Client: ${sku.client?.client_name}`,
            })}
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Location
          </label>
          <PaginatedDropdown
            endpoint="/locations"
            params={{ warehouse_id: form.warehouse_id }}
            value={form.location_id}
            disabled={!form.warehouse_id || isEditMode}
            selectedItem={initialData?.location}
            onChange={(id) => setForm((p) => ({ ...p, location_id: id }))}
            placeholder="Select Location"
            renderItem={(loc) => ({
              title: loc.location_code,
              subtitle: loc.location_type,
            })}
          />
        </div>

        {/* Adjustment Type */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Adjustment Type <span className="text-red-500">*</span>
          </label>

          <select
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={form.adjustment_type}
            onChange={(e) =>
              setForm((p) => ({ ...p, adjustment_type: e.target.value }))
            }
          >
            <option value="">Select adjustment type</option>
            <option value="ADD">ADD</option>
            <option value="SUBTRACT">SUBTRACT</option>
            <option value="SET">SET</option>
          </select>
        </div>

        {/* Qty */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="Quantity"
            className="rounded-md border px-3 py-2 text-sm"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Batch No
          </label>
          <input
            placeholder="Batch No"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={form.batch_no}
            onChange={(e) =>
              setForm((p) => ({ ...p, batch_no: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Serial No
          </label>
          <input
            placeholder="Serial No"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={form.serial_no}
            onChange={(e) =>
              setForm((p) => ({ ...p, serial_no: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Expiry Date
          </label>
          <input
            type="date"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={form.expiry_date || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, expiry_date: e.target.value }))
            }
          />
        </div>

        {/* Reason */}
        <input
          className="col-span-2 rounded-md border px-3 py-2 text-sm"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        {/* Notes */}
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

export default AdjustStockModal;
