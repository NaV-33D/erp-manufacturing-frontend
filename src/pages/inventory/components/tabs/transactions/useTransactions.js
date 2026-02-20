import { useEffect, useMemo, useState } from "react";
import http from "@/api/http";

export function useTransactions(toast) {
  const [loading, setLoading] = useState(true);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true); 
  const [data, setData] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    warehouses: [],
    skus: [],
    locations: [],
  });

  const [f, setF] = useState({
    warehouse_id: "All",
    sku_id: "All",
    location_id: "All",
    transaction_type: "All",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  // Fetch dropdown data on mount
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Fetch transactions when filters change
  useEffect(() => {
    // Only fetch transactions if dropdowns have loaded
    if (!loadingDropdowns) {
      fetchTransactions();
    }
  }, [
    f.warehouse_id,
    f.sku_id,
    f.location_id,
    f.transaction_type,
    f.page,
    loadingDropdowns, // Add this to dependency
  ]);

 const fetchDropdownData = async () => {
  try {
    setLoadingDropdowns(true);
    
    // Fetch warehouses
    const warehousesRes = await http.get("/warehouses");
    const warehouses = warehousesRes.data?.success ? warehousesRes.data.data || [] : [];
    
    // Fetch SKUs - FIXED: Access nested skus array
    const skusRes = await http.get("/skus");
    const skus = skusRes.data?.success ? 
      (skusRes.data.data?.skus || skusRes.data.data || []) : []; // Fixed this line
    
    // Fetch locations - Also FIXED: Access nested locations array
    const locationsRes = await http.get("/locations");
    const locations = locationsRes.data?.success ? 
      (locationsRes.data.data?.locations || locationsRes.data.data || []) : [];
    
    // Transform data for dropdowns
    const warehousesOptions = [
      { value: "All", label: "All Warehouses" },
      ...warehouses.map(w => ({
        value: String(w.id),
        label: `${w.warehouse_code} - ${w.warehouse_name}`,
      })),
    ];
    
    const skusOptions = [
      { value: "All", label: "All SKUs" },
      ...skus.map(s => ({
        value: String(s.id),
        label: `${s.sku_code} - ${s.sku_name}`,
      })),
    ];
    
    const locationsOptions = [
      { value: "All", label: "All Locations" },
      ...locations.map(l => ({
        value: String(l.id),
        label: `${l.location_code} (Zone ${l.zone || 'N/A'})`,
      })),
    ];
    
    setDropdownData({
      warehouses: warehousesOptions,
      skus: skusOptions,
      locations: locationsOptions,
    });
    
    // Auto-select first warehouse if there are options
    if (warehousesOptions.length > 1) { // More than just "All"
      setF(prev => ({
        ...prev,
        // warehouse_id: warehousesOptions[1].value // Skip "All", select first real warehouse
      }));
    }
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    
    // Set empty options with "All" as default
    setDropdownData({
      warehouses: [{ value: "All", label: "All Warehouses" }],
      skus: [{ value: "All", label: "All SKUs" }],
      locations: [{ value: "All", label: "All Locations" }],
    });
  } finally {
    setLoadingDropdowns(false);
  }
};

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      // Only append if not "All"
      if (f.warehouse_id !== "All") {
        params.append("warehouse_id", String(f.warehouse_id));
      }
      
      if (f.sku_id !== "All") {
        params.append("sku_id", String(f.sku_id));
      }
      
      if (f.location_id !== "All") {
        params.append("location_id", String(f.location_id));
      }

      if (f.transaction_type && f.transaction_type !== "All") {
        params.append("transaction_type", f.transaction_type);
      }

      params.append("page", String(f.page || 1));
      params.append("limit", String(f.limit || 10));

      const url = `/inventory/transactions?${params.toString()}`;
      console.log("Fetching transactions from:", url);

      const res = await http.get(url);

      if (!res.data?.success) {
        setData([]);
        setPagination({ total: 0, page: 1, limit: 10, pages: 1 });
        return;
      }

      const d = res.data.data;
      const list = Array.isArray(d) ? d : d?.transactions || [];
      
      const apiPagination = res.data.pagination || d?.pagination;
      
      if (apiPagination) {
        setPagination({
          total: apiPagination.total || list.length,
          page: apiPagination.page || f.page,
          limit: apiPagination.limit || f.limit,
          pages: apiPagination.pages || Math.ceil((apiPagination.total || list.length) / (apiPagination.limit || f.limit)),
        });
      } else {
        setPagination({
          total: list.length,
          page: f.page,
          limit: f.limit,
          pages: Math.ceil(list.length / f.limit),
        });
      }

      setData(list);
    } catch (e) {
      console.error("Transactions error:", e);
      setData([]);
      toast?.error?.(e.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setF(prev => ({ ...prev, page: newPage }));
  };

  const filters = useMemo(
    () => [
      {
        key: "warehouse_id",
        type: "select",
        label: "Warehouse",
        value: f.warehouse_id,
        options: dropdownData.warehouses,
        className: "w-[240px]",
      },
      {
        key: "sku_id",
        type: "select",
        label: "SKU",
        value: f.sku_id,
        options: dropdownData.skus,
        className: "w-[240px]",
      },
      {
        key: "location_id",
        type: "select",
        label: "Location",
        value: f.location_id,
        options: dropdownData.locations,
        className: "w-[240px]",
      },
      {
        key: "transaction_type",
        type: "select",
        label: "Transaction Type",
        value: f.transaction_type,
        options: [
          { value: "All", label: "All Types" },
          { value: "PUTAWAY", label: "Putaway" },
          { value: "ADJUSTMENT", label: "Adjustment" },
          { value: "PICK", label: "Pick" },
          { value: "MOVE", label: "Move" },
          { value: "RECEIPT", label: "Receipt" },
          { value: "DISPATCH", label: "Dispatch" },
        ],
        className: "w-[200px]",
      },
    ],
    [f, dropdownData],
  );

  return {
    loading: loading || loadingDropdowns, // Combine both loading states
    f,
    setF,
    filters,
    data,
    pagination,
    refresh: fetchTransactions,
    handlePageChange,
  };
}