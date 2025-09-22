import { toast } from "sonner";
import { Check, X } from "lucide-react";

export const confirmToast = ({ 
  message = "Apakah Anda yakin?", 
  description = "", 
  onConfirm, 
  onCancel 
}) => {
  toast.custom(
    (t) => (
      <div className="w-[400px] max-w-full bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-xl p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">{message}</h2>
        {description && (
          <p className="text-gray-500 dark:text-gray-300 mb-4">{description}</p>
        )}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              onConfirm?.();
              toast.dismiss(t);
            }}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Setuju
          </button>
          <button
            onClick={() => {
              onCancel?.();
              toast.dismiss(t);
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Batal
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center", // munculkan di tengah atas
      duration: Infinity,     // jangan hilang otomatis
    }
  );
};
