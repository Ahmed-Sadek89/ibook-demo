import { useState } from "react";

export function useMultiStep(steps) {
  const [currentStep, setCurrentStep] = useState(0);

  return {
    currentStep,
    setCurrentStep,
    step: steps[currentStep],
  };
}
