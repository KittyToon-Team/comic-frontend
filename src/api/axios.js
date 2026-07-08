import axios from "axios";

const api = axios.create({
    baseURL: "/api", // Đã chuẩn hóa theo Vite Proxy ở bước trước
});

// 🌟 THÊM ĐOẠN NÀY: Chiều gửi đi (Request) - Tự động đính kèm Token
api.interceptors.request.use(
    (config) => {
        const raw = localStorage.getItem("currentUser");
        const user = raw ? JSON.parse(raw) : null;

        // Nếu có user và user có chứa token (JWT), đính nó vào Header
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Chiều nhận về (Response) - Giữ nguyên logic cũ của bạn
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem("currentUser");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;