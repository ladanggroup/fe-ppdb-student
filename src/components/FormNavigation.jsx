import React from "react";
import Button from "./ui/button";

const FormNavigation = ({
  currentStep,
  totalSteps,
  handlePrevStep,
  handleNextStep,
  isLoading,
  handleSubmit,
  subscriptions,
}) => {
  return (
    <div className="mt-6 flex items-center justify-end gap-x-6">
      {currentStep > 1 && (
        <Button
          type="button"
          onClick={handlePrevStep}
          className="rounded-md bg-gray-300 px-6 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-400"
          disabled={isLoading}
        >
          Sebelumnya
        </Button>
      )}

      {currentStep < totalSteps && (
        <Button
          type="button"
          onClick={handleNextStep}
          //   className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isLoading}
        >
          Selanjutnya
        </Button>
      )}

      {currentStep === totalSteps && subscriptions?.[0]?.status !== "menunggu_verifikasi" && (
        <Button
          type="submit"
          onClick={handleSubmit} // Call handleSubmit from parent
          //   className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Selesaikan Pendaftaran"}
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
