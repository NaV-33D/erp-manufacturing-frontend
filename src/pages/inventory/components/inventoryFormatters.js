export const toNum = (v) => Number(v || 0);

export const toLocale = (v) => toNum(v).toLocaleString();

export const worstStatus = (current, incoming) => {
  const priority = {
    DAMAGED: 5,
    OUT_OF_STOCK: 4,
    EXPIRY_RISK: 3,
    LOW_STOCK: 2,
    HOLD: 2,
    HEALTHY: 1,
  };
  const a = priority[current] || 0;
  const b = priority[incoming] || 0;
  return b > a ? incoming : current;
};
