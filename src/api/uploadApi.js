import api from "./axios";

export const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/admin/upload", formData);
};

export const uploadMultipleFiles = async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }
    return api.post("/admin/upload/batch", formData);
};
