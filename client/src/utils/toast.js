import toast from "react-hot-toast";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

const showToast = (message, type = "success", duration = 4000) => {
  const options = {
    duration,
    style: {
      backgroundColor: "#fff",
      color: "#000",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      padding: "16px 20px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
  };

  const getIcon = (type) => {
    const iconProps = { size: 20, style: { marginRight: "8px" } };
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "info":
        return "ℹ";
      case "warning":
        return "⚠";
      default:
        return "•";
    }
  };

  const formattedMessage = `${getIcon(type)} ${message}`;
  toast.custom(formattedMessage, options);
};

export const showSuccess = (message, duration = 4000) => showToast(message, "success", duration);
export const showError = (message, duration = 4000) => showToast(message, "error", duration);
export const showInfo = (message, duration = 4000) => showToast(message, "info", duration);
export const showWarning = (message, duration = 4000) => showToast(message, "warning", duration);

export default showToast;
