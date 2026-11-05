import React from "react";
export function StepBar({ currentStep }: { currentStep: number }) {
  const steps = [1, 2, 3, 4];
  const labels = ["Upload", "Label", "Train", "Test"];

  return (
    <div className="flex justify-between items-center max-w-xl mx-auto px-4">
      {steps.map((step, idx) => {
        const isCurrent = step === currentStep;
        const isDone = step < currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-[15px] transition-all ${
                  isCurrent
                    ? "bg-[#3b5bdb] text-white shadow-md"
                    : isDone
                    ? "bg-[#e7ecfd] text-[#3b5bdb] border-2 border-[#3b5bdb]"
                    : "bg-white text-zinc-400 border-2 border-[#dfe4ee]"
                }`}
              >
                {step}
              </div>
              <span className="text-xs font-bold text-zinc-700">{labels[idx]}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-[#dfe4ee] mx-4 -mt-5"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}