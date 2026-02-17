import { toast } from "react-toastify";

export const toastSettings = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showErrorToast = (message) => {
  toast.error(message, toastSettings);
};

export const showSuccessToast = (message) => {
  toast.success(message, toastSettings);
};

export const showInfoToast = (message) => {
  toast.info(message, toastSettings);
};
