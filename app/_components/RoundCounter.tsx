import React from "react";

export function RoundCounter({ currentRound, totalRounds }: { currentRound: number; totalRounds: number }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white border border-[#dfe4ee] rounded-[16px] p-6 shadow-xs">
      <span className="text-[15px] font-medium text-[#5d6779] mb-1">Round</span>
      <div className="text-[44px] font-bold text-zinc-900 tracking-tight">
        {currentRound} <span className="text-zinc-300">/</span> {totalRounds}
      </div>
    </div>
  );
}