import React from "react";

export function CountPills({ catCount, notCatCount }: { catCount: number; notCatCount: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-[#fff0e6] text-[#e8590c] px-[14px] py-[6px] rounded-full text-xs font-bold">
        Cat: {catCount}
      </span>
      <span className="bg-[#e6f6ea] text-[#2b8a3e] px-[14px] py-[6px] rounded-full text-xs font-bold">
        Not cat: {notCatCount}
      </span>
    </div>
  );
}