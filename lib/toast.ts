import { toast } from "react-toastify";

const showToast = (message: String, type: String) => {
  if (type == "success") {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      style: { background: "#50b50d" },
      progress: undefined,
      theme: "colored",
    });
  } else if (type === "error") {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      style: { background: "#de0d0d" },
      progress: undefined,
      theme: "colored",
    });
  } else if (type === "warn") {
    toast.warn(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      style: { background: "#ed7718" },
      progress: undefined,
      theme: "colored",
    });
  } else if (type === "warn-left") {
    toast.warn(message, {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      style: { background: "#ed7718" },
      progress: undefined,
      theme: "colored",
    });
  } else if (type === "error-left") {
    toast.error(message, {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      style: { background: "#de0d0d" },
      progress: undefined,
      theme: "colored",
    });
  } else if (type == "success-left") {
    toast.success(message, {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      style: { background: "#50b50d" },
      progress: undefined,
      theme: "colored",
    });
  }
};

export default showToast;
