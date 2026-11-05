import React from "react";

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="border-2 border-[#dfe4ee] hover:bg-zinc-50 text-[#1d2433] font-bold px-[26px] py-[14px] rounded-[12px] text-[17px] transition cursor-pointer"
    >
      Back
    </button>
  );
}