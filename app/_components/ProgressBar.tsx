import React from "react";

export function ProgressBar({ progress }: { progress: number }) {
  // progress нь 0-ээс 100 хооронд хувь байна
  return (
    <div className="w-full bg-[#f4f6fb] border border-[#dfe4ee] rounded-[7px] h-[14px] overflow-hidden p-[1px]">
      <div
        className="bg-[#3b5bdb] h-full rounded-[6px] transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}