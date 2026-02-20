export const AUTH_ONLY = "AUTH_ONLY";

export const ROUTE_PERMS = {
  "/dashboard": { module: "DASHBOARD", perm: "READ" },
  "/inbound": { module: "INBOUND", perm: "READ" },
  "/putaway": { module: "PUTAWAY", perm: "READ" },
  "/inventory": { module: "INVENTORY", perm: "READ" },
  "/outbound": { module: "OUTBOUND", perm: "READ" },
  "/picking": { module: "PICKING", perm: "READ" },
  "/packing": { module: "PACKING", perm: "READ" },
  "/shipping": { module: "SHIPPING", perm: "READ" },
  "/billing": { module: "BILLING", perm: "READ" },
  "/masters": { module: AUTH_ONLY, perm: AUTH_ONLY },
  "/reports": { module: AUTH_ONLY, perm: AUTH_ONLY },
  "/setting": { module: "SETTINGS", perm: "READ" },
};

export const GROUP_PATHS = {
  "/masters": [
    "USER_MANAGEMENT",
    "WAREHOUSE",
    "SUPPLIERS",
    "DOCKS",
    "SLOTTINGRULES",
    "CLIENTS",
    "LOCATIONS",
    "SKUS",
    "MODULES",
    "PERMISSIONS",
    "ROLES",
  ],
  "/reports": [
    "REPORTS",
    "INBOUND",
    "PUTAWAY",
    "INVENTORY",
    "ORDERS",
    "BILLING",
  ],
};
