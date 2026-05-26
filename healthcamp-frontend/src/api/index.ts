import axios from "axios";
import useAuthStore from "../providers/context/useAuthStore";

// This looks at your .env file. If .env is missing, it defaults to your local setup.
export const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
export const frontURL = window.location.origin;  

export default axios.create({
  baseURL: baseURL,
});

export const axiosPrivateInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPublicInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivateInstance.interceptors.request.use(
  (request) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosPrivateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        const refreshToken =
          localStorage.getItem("rToken") || sessionStorage.getItem("rToken");
        const response = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        // console.log('response of response api', response)
        const accessToken = response.data;
        const setAcessToken = useAuthStore.getState().setAccessToken;
        setAcessToken(accessToken);
        const setIsAuth = useAuthStore.getState().setIsAuth;
        setIsAuth(true);
        axiosPrivateInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return axiosPrivateInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("rToken");
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
