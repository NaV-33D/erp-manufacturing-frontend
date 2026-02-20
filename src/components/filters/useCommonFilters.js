import { useState } from "react";

export const DEFAULT_FILTERS = {
  dateRange: "Today",
  warehouse: "All",
  client: "All",
  status: "All",
  source: "All",
  zone: "All",
  search: "",
};

export const useCommonFilters = (initial = {}) => {
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    ...initial,
  });

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, ...initial });
  };

  return {
    filters,
    setFilter,
    resetFilters,
  };
};
