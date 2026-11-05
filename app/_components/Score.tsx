import React from "react";

type Props = { correct: number; total: number };

export function Score({ correct, total }: Props) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#f4f6fb] rounded-[12px] px-6 py-5">
      <span
        className="text-[48px] leading-none text-zinc-900"
        style={{ fontFamily: "Fredoka, system-ui, sans-serif", fontWeight: 600 }}
      >
        {correct} / {total}
      </span>
      <span
        className="mt-2 text-[17px] text-[#5d6779]"
        style={{ fontFamily: "Nunito, system-ui, sans-serif" }}
      >
        test photos right
      </span>
    </div>
  );
}