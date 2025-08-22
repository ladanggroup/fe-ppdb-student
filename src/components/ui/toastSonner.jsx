import { Toaster, toast } from "sonner";

export const toastSonner = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: "12px",
          background: "#fff",
          color: "#333",
        },
      }}
    />
  );
};

// Helper supaya bisa dipakai di komponen lain
export const showSuccess = (message) => toast.success(message);
export const showError = (message) => toast.error(message);
export const showInfo = (message) => toast.info(message);
export const showWarning = (message) => toast.warning(message);
