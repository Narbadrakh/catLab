import React from "react";

export function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-4xl bg-white border border-[#dfe4ee] rounded-[16px] p-5 sm:p-[28px] flex flex-col gap-[20px] shadow-sm">
      {children}
    </div>
  );
}