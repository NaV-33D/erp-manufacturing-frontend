// useStockByLocation.js
import { useEffect, useMemo, useState } from "react";
import http from "@/api/http";

export function useStockByLocation(toast) {
  const [loading, setLoading] = useState(true);
  const [zoneData, setZoneData] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 20,
  });

  const [f, setF] = useState({
    warehouse: "All", // Start empty, will be set after fetching
    zone: "All",
  });

  const [warehouses, setWarehouses] = useState([""]);
  const [zones, setZones] = useState(["All"]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    // Only fetch zone data if warehouse is selected
    if (f.warehouse) {
      fetchZoneData();
    }
  }, [f.warehouse, f.zone, page]);

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchWarehouses(), fetchAllZones()]);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await http.get("/warehouses");
      if (res.data?.success) {
        const list = res.data.data || [];
        const options = list.map((w) => ({
          value: String(w.id),
          label: `${w.warehouse_code} - ${w.warehouse_name}`,
        }));
        
        setWarehouses(options);
        
        // Auto-select the first warehouse if available
        if (options.length > 0) {
          setF(prev => ({
            ...prev,
            warehouse: options[0].value
          }));
        }
      }
    } catch (e) {
      console.error(e);
      toast?.error?.("Failed to load warehouses");
    }
  };

  const fetchAllZones = async () => {
    try {
      const res = await http.get("/locations");
      if (res.data?.success) {
        const locations = res.data.data?.locations || res.data.data || [];
        const uniqueZones = [
          "All",
          ...new Set(
            locations
              .map((l) => l.zone)
              .filter(Boolean)
              .sort(),
          ),
        ];
        setZones(uniqueZones);
      }
    } catch (e) {
      console.error(e);
      setZones(["All", "A", "B", "C", "D"]);
    }
  };

  const fetchZoneData = async () => {
    try {
      setLoading(true);
      
      // Validate warehouse_id
      if (!f.warehouse || f.warehouse === "undefined") {
        console.error("Invalid warehouse ID:", f.warehouse);
        setLoading(false);
        return;
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append("warehouse_id", f.warehouse);
      
      if (f.zone !== "All") {
        params.append("zone", f.zone);
      }
      
      // Use the group-by-zone API
      const url = `/inventory/group-by-zone?${params.toString()}`;
      console.log("Fetching zone data from:", url);
      
      const res = await http.get(url);
      
      if (res.data?.success) {
        const data = res.data.data || [];
        setZoneData(data);
        
        // Update pagination
        setPagination(prev => ({
          ...prev,
          page: page,
          total: data.length,
          pages: Math.ceil(data.length / prev.limit)
        }));
        
        // Update zones list from API response if needed
        if (data.length) {
          const zonesFromData = [
            "All",
            ...new Set(
              data.map((item) => item.zone).filter(Boolean).sort(),
            ),
          ];
          if (zonesFromData.length > 1) setZones(zonesFromData);
        }
      } else {
        setZoneData([]);
      }
    } catch (e) {
      console.error("Error fetching zone data:", e);
      console.error("Error response:", e.response?.data);
      
      // Only show toast if it's not the "undefined" error
      if (!e.response?.data?.message?.includes("undefined")) {
        toast?.error?.(
          e.response?.data?.message || "Failed to load zone data"
        );
      }
      setZoneData([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals for summary
  const totals = useMemo(() => {
    const t = {
      onHand: 0,
      available: 0,
      hold: 0,
      allocated: 0,
      damaged: 0,
      skuCount: 0,
      zoneCount: zoneData.length
    };
    
    zoneData.forEach((item) => {
      t.onHand += Number(item.total_on_hand || 0);
      t.available += Number(item.total_available || 0);
      t.hold += Number(item.total_hold || 0);
      t.allocated += Number(item.total_allocated || 0);
      t.damaged += Number(item.total_damaged || 0);
      t.skuCount += Number(item.sku_count || 0);
    });
    
    return t;
  }, [zoneData]);

  // Transform data for table
  const tableData = useMemo(() => {
    // Apply pagination
    const start = (page - 1) * pagination.limit;
    const end = start + pagination.limit;
    const paginatedData = zoneData.slice(start, end);
    
    return paginatedData.map((item) => ({
      id: item.zone,
      zone: item.zone,
      total_on_hand: Number(item.total_on_hand || 0).toLocaleString(),
      total_available: Number(item.total_available || 0).toLocaleString(),
      total_hold: Number(item.total_hold || 0).toLocaleString(),
      total_allocated: Number(item.total_allocated || 0).toLocaleString(),
      total_damaged: Number(item.total_damaged || 0).toLocaleString(),
      sku_count: Number(item.sku_count || 0).toLocaleString(),
    }));
  }, [zoneData, page, pagination.limit]);

  const filters = useMemo(
    () => [
      {
        key: "warehouse",
        type: "select",
        label: "Warehouse",
        value: f.warehouse,
        options: warehouses,
        className: "w-[240px]",
      },
      {
        key: "zone",
        type: "select",
        label: "Zone",
        value: f.zone,
        options: zones.map(zone => ({
          value: zone,
          label: zone === "All" ? "All Zones" : `Zone ${zone}`
        })),
        className: "w-[180px]",
      },
    ],
    [f, warehouses, zones],
  );

  const resetFilters = () => {
    if (warehouses.length > 0) {
      setF({
        warehouse: warehouses[0].value,
        zone: "All",
      });
    }
  };

  return {
    loading,
    f,
    setF,
    filters,
    resetFilters,
    warehouses,
    zones,
    zoneData,
    totals,
    tableData,
    refresh: fetchZoneData,
    pagination: {
      ...pagination,
      total: zoneData.length,
      pages: Math.ceil(zoneData.length / pagination.limit)
    },
    page,
    setPage,
  };
}