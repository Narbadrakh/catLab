import React from "react";

export function HelpBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-[#e7ecfd] rounded-[12px] p-[14px_16px] flex flex-col gap-1">
      <span className="text-[15px] font-bold text-zinc-900">{title}</span>
      <span className="text-[15px] text-zinc-700">{text}</span>
    </div>
  );
}