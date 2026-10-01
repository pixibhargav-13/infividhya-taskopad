import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const onAuthPage = ["/login", "/register"].includes(window.location.pathname);

    // Expired/invalid session: clear it and go to login (but don't reload the
    // login page itself, so a wrong-password 401 can show its error message)
    if (error.response?.status === 401 && !onAuthPage) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;