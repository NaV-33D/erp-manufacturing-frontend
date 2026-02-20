import { useEffect, useMemo, useState } from "react";

/* ---------------- Dummy Raw Data ---------------- */

const DUMMY_SKU_DATA = [
  {
    sku_id: 1,
    sku: { sku_code: "SKU002", sku_name: "Dell Inspiron 15 Model Z", category: "Electronics", uom: "EACH" },
    total_on_hand: 383,
    total_available: 388,
    total_hold: 1,
    total_allocated: 1,
    total_damaged: 0,
    status: "HOLD",
  },
  {
    sku_id: 2,
    sku: { sku_code: "SKU003", sku_name: "Lenovo Inspiron 15 Model Z", category: "Electronics", uom: "EACH" },
    total_on_hand: 506,
    total_available: 515,
    total_hold: 0,
    total_allocated: 4,
    total_damaged: 0,
    status: "HEALTHY",
  },
  {
    sku_id: 3,
    sku: { sku_code: "SKU004", sku_name: "Realme NARZO 90 5G", category: "Smartphones", uom: "EACH" },
    total_on_hand: 72,
    total_available: 81,
    total_hold: 0,
    total_allocated: 4,
    total_damaged: 0,
    status: "HEALTHY",
  },
  {
    sku_id: 4,
    sku: { sku_code: "SKU005", sku_name: "Realme GT 8 Pro", category: "Smartphones", uom: "EACH" },
    total_on_hand: 71,
    total_available: 71,
    total_hold: 0,
    total_allocated: 0,
    total_damaged: 0,
    status: "HEALTHY",
  },
];

/* ---------------- Status Map ---------------- */

const STATUS_LABELS = {
  HEALTHY: "Healthy",
  HOLD: "QC Hold",
  LOW_STOCK: "Low Stock",
  DAMAGED: "Damaged",
};

/* ---------------- Hook ---------------- */

export function useStockBySku() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [f, setF] = useState({
    warehouse: "All",
    client: "All",
    skuSearch: "",
    stockStatus: "All",
  });

  const limit = 10;

  /* Simulate API delay */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- Filtering ---------------- */

  const filteredData = useMemo(() => {
    let data = [...DUMMY_SKU_DATA];

    if (f.skuSearch) {
      const q = f.skuSearch.toLowerCase();
      data = data.filter(
        (i) =>
          i.sku.sku_code.toLowerCase().includes(q) ||
          i.sku.sku_name.toLowerCase().includes(q)
      );
    }

    if (f.stockStatus !== "All") {
      data = data.filter(
        (i) => STATUS_LABELS[i.status] === f.stockStatus
      );
    }

    return data;
  }, [f]);

  /* ---------------- Summary ---------------- */

  const summary = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.total_on_hand += item.total_on_hand;
        acc.total_available += item.total_available;
        acc.total_hold += item.total_hold;
        acc.total_allocated += item.total_allocated;
        acc.total_damaged += item.total_damaged;
        acc.total_skus += 1;
        return acc;
      },
      {
        total_on_hand: 0,
        total_available: 0,
        total_hold: 0,
        total_allocated: 0,
        total_damaged: 0,
        total_skus: 0,
      }
    );
  }, [filteredData]);

  /* ---------------- Pagination ---------------- */

  const pagination = {
    total: filteredData.length,
    page,
    pages: Math.ceil(filteredData.length / limit),
    limit,
  };

  const paginated = filteredData.slice(
    (page - 1) * limit,
    page * limit
  );

  /* ---------------- Table Format ---------------- */

  const tableData = paginated.map((item) => ({
    id: item.sku_id,
    sku: item.sku.sku_code,
    name: item.sku.sku_name,
    category: item.sku.category,
    uom: item.sku.uom,
    onHand: item.total_on_hand.toLocaleString(),
    available: item.total_available.toLocaleString(),
    hold: item.total_hold.toLocaleString(),
    allocated: item.total_allocated.toLocaleString(),
    damaged: item.total_damaged.toLocaleString(),
    risk: STATUS_LABELS[item.status] || item.status,
    img: `https://ui-avatars.com/api/?name=${item.sku.sku_code}&background=random&color=fff`,
  }));

  /* ---------------- Filters Config ---------------- */

  const filters = [
    {
      key: "stockStatus",
      type: "select",
      label: "Stock Status",
      value: f.stockStatus,
      options: [
        { value: "All", label: "All Statuses" },
        { value: "Healthy", label: "Healthy" },
        { value: "QC Hold", label: "QC Hold" },
      ],
    },
    {
      key: "skuSearch",
      type: "search",
      label: "SKU Search",
      value: f.skuSearch,
      placeholder: "Search SKU Code or Name...",
    },
  ];

  const resetFilters = () =>
    setF({
      warehouse: "All",
      client: "All",
      skuSearch: "",
      stockStatus: "All",
    });

  return {
    loading,
    f,
    setF,
    filters,
    resetFilters,
    summary,
    tableData,
    refresh: () => {},
    pagination,
    page,
    setPage,
  };
}