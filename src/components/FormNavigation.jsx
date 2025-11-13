import React from "react";
import { Button } from "./ui/button";

const FormNavigation = ({
  currentStep,
  totalSteps,
  handlePrevStep,
  handleNextStep,
  handleSubmit,
  isLoading,
  disabled,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 border border-gray-600 px-4 py-3 dark:border-gray-500 rounded-md mt-4">
      <Button
        type="button"
        onClick={handlePrevStep}
        className="flex items-center justify-start px-3 py-1 text-sm font-semibold"
        variant="secondary"
        disabled={isLoading || currentStep === 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="ml-1">Sebelumnya</span>
      </Button>

      {currentStep < totalSteps && (
        <Button
          type="button"
          onClick={handleNextStep}
          className="flex items-center justify-end px-3 py-1 text-sm font-semibold"
          variant="secondary"
          disabled={isLoading || disabled}
        >
          <span className="mr-1">Selanjutnya</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      )}

      {currentStep === totalSteps && (
        <Button
          onClick={handleSubmit}
          className="flex items-center justify-end px-3 py-1 text-sm font-semibold"
          variant="secondary"
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Selesaikan Pendaftaran"}
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
