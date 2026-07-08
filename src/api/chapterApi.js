import api from "./axios";

export const getChaptersByStory = (storyId) =>
  api.get(`/admin/chapters/story/${storyId}`);
export const getChapter = (id) => api.get(`/admin/chapters/${id}`);
export const createChapter = (data) => api.post("/admin/chapters", data);
export const updateChapter = (id, data) =>
  api.put(`/admin/chapters/${id}`, data);
export const deleteChapter = (id) => api.delete(`/admin/chapters/${id}`);
