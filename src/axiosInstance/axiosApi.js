import axios from "axios";
import { showErrorToast } from "../utils/toastConfig";
import { BASE_URL } from "../constants";

const handleError = (error) => {
  if (error.response) {
    const errorMessage =
      error.response.data?.msg ||
      error.response.data?.error?.message ||
      error.response.data?.message ||
      "An unexpected error occurred";

    showErrorToast(`Error: ${errorMessage}`);

    switch (error.status) {
      case 400:
        console.error("Bad Request:", errorMessage);
        break;
      case 404:
        console.error("Not Found:", errorMessage);
        break;
      case 409:
        console.error("Conflict:", errorMessage);
        break;
      case 500:
        console.error("Server Error:", errorMessage);
        break;
      default:
        console.error(`Error ${error.response.status}:`, errorMessage);
    }
  } else if (error.request) {
    showErrorToast("No response received from the server. Please try again.");
    console.error("No response received:", error.request);
  } else {
    showErrorToast("Error setting up the request: " + error.message);
    console.error("Request setup error:", error.message);
  }
};

const setupAxiosInterceptors = () => {
  axios.defaults.baseURL = `${BASE_URL}`;
  axios.defaults.timeout = 10000;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.status);
      handleError(error);
      if (
        error.response &&
        error.response.status === 401 &&
        window.location.pathname != "/"
      ) {
        console.log(window.location.pathname);
        showErrorToast("Session Expired, Please login again");
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.replace("/");
        }, 100);
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
