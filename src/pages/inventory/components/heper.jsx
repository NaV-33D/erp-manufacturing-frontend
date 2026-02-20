import http from "@/api/http";

// CREATE HOLD
export const createInventoryHold = (payload) =>
  http.post("/inventory-holds", payload);

// RELEASE HOLD
export const releaseInventoryHold = async (id, notes) => {
  try {
    const res = await http.post(`/inventory-holds/${id}/release`, {
      release_notes: notes,
    });

    return res.data;
  } catch (e) {
    console.log(e);
  }
};

// DELETE HOLD
export const deleteInventoryHold = (id) =>
  http.delete(`/inventory-holds/${id}`);

// GET HOLDS (list)
export const getInventoryHolds = (params = {}) =>
  http.get("/inventory-holds", { params });
