export const getStatusBadgeColor = (status) => {
  const colorMap = {
    PENDING: "bg-gray-100 text-gray-800",
    ASSIGNED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    PUTAWAY: "bg-indigo-100 text-indigo-800",
    MOVE: "bg-purple-100 text-purple-800",
  };

  return colorMap[status] || "bg-gray-100 text-gray-800";
};

export const getTransactionTypeColor = (type) => {
  const colors = {
    IN: "bg-green-100 text-green-800",
    OUT: "bg-red-100 text-red-800",
    TRANSFER: "bg-blue-100 text-blue-800",
    ADJUSTMENT: "bg-yellow-100 text-yellow-800",
  };

  return colors[type] || "bg-gray-100 text-gray-800";
};
