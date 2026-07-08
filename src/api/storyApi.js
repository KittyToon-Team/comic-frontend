import api from "./axios";

export const getStories = (keyword) =>
  api.get("/admin/stories", { params: keyword ? { keyword } : {} });
export const getStory = (id) => api.get(`/admin/stories/${id}`);
export const createStory = (data) => api.post("/admin/stories", data);
export const updateStory = (id, data) => api.put(`/admin/stories/${id}`, data);
export const deleteStory = (id) => api.delete(`/admin/stories/${id}`);
export const getCategories = () => api.get("/categories");
