import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(
    (config) => {
        const raw = localStorage.getItem("currentUser");
        const user = raw ? JSON.parse(raw) : null;

        // Nếu có user và token, đính kèm vào Authorization header
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            // Token hết hạn hoặc không hợp lệ -> xóa phiên đăng nhập
            localStorage.removeItem("currentUser");
            const currentPath = window.location.pathname;
            // Chỉ chuyển hướng nếu đang ở route yêu cầu quyền đăng nhập
            if (currentPath.startsWith("/admin") || currentPath.startsWith("/profile")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
