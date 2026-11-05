import React from "react";

export function LockedButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      disabled
      className="bg-[#dfe4ee] text-[#5d6779] cursor-not-allowed font-bold px-[26px] py-[14px] rounded-[12px] text-[17px] transition flex items-center justify-center gap-2 w-full"
    >
      {children}
    </button>
  );
}