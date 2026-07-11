import api from "./axios";

export const getUsers = (keyword) =>
  api.get("/admin/users", { params: keyword ? { keyword } : {} });

export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, { role });
