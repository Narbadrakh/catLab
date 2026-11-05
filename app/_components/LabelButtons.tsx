import React from "react";

export function LabelButtons({
  currentLabel,
  onSelect,
}: {
  currentLabel?: "Cat" | "Not cat";
  onSelect: (label: "Cat" | "Not cat") => void;
}) {
  return (
    <div className="grid grid-cols-2 w-full gap-1 bg-white border border-zinc-300 rounded-lg p-[4px]">
      <button
        onClick={() => onSelect("Cat")}
        className={`py-[4px] px-[10px] text-[15px] font-[700] rounded-md transition ${
          currentLabel === "Cat"
            ? "bg-[#fff0e6] text-[#e8590c] shadow-xs"
            : "text-zinc-700 hover:bg-zinc-100"
        }`}
      >
        Cat
      </button>
      <button
        onClick={() => onSelect("Not cat")}
        className={`py-[4px] px-[10px] text-[15px] font-[700] rounded-md transition ${
          currentLabel === "Not cat"
            ? "bg-[#e6f6ea] text-[#2b8a3e] shadow-xs"
            : "text-zinc-700 hover:bg-zinc-100"
        }`}
      >
        Not cat
      </button>
    </div>
  );
}