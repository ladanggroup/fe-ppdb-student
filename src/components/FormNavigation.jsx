import React from "react";
import { Button } from "./ui/button";

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
          disabled={isLoading}
        >
          Selanjutnya
        </Button>
      )}

      {currentStep === totalSteps && subscriptions?.[0]?.status !== "verify" && (
        <Button
          type="submit"
          onClick={handleSubmit} // Call handleSubmit from parent
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Selesaikan Pendaftaran"}
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
