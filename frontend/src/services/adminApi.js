import axios from "axios";
const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            !error.config?.url?.includes("/auth/admin/login")
        ) {
            if (window.location.pathname.startsWith("/admin")) {
                window.location.href = "/admin/login";
            }
        }

        return Promise.reject(error);
    }
);

export default adminApi;