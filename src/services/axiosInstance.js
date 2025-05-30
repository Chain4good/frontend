import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL || "http://185.200.65.252:3000",
  timeout: 120000,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        await instance.post("/auth/refresh");

        // Thử lại request ban đầu
        return instance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, chuyển về trang login
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
