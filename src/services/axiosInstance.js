import axios from "axios";
import Cookies from "js-cookie";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_APP_BACKEND_URL || "https://api.chain4good.io.vn",
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

    // Helper function to extract error data
    const getErrorData = (error) => {
      const response = error?.response?.data;
      if (typeof response === "object") {
        return response;
      }
      return {
        message: typeof response === "string" ? response : "Có lỗi xảy ra",
        status: error?.response?.status,
        error: true,
      };
    };

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === "/auth/login") {
        return Promise.reject(getErrorData(error));
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => instance(originalRequest))
          .catch((err) => Promise.reject(getErrorData(err)));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await instance.post("/auth/refresh");
        processQueue(null);
        isRefreshing = false;
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        Cookies.remove("access_token");
        window.location.href = "/sign-in";
        return Promise.reject(getErrorData(refreshError));
      }
    }

    return Promise.reject(getErrorData(error));
  }
);

export default instance;
