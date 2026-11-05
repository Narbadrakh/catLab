import React from "react";
import { X } from "lucide-react";

export function PhotoTile({
  src,
  label,
  onRemove,
}: {
  src: string;
  label?: "Cat" | "Not cat";
  onRemove?: () => void;
}) {
  let borderColor = "border-[#dfe4ee]";
  if (label === "Cat") borderColor = "border-[#e8590c]";
  if (label === "Not cat") borderColor = "border-[#2b8a3e]";

  return (
    <div className={`border-[2px] ${borderColor} rounded-[12px] p-3 flex flex-col items-center justify-between gap-3 bg-white shadow-xs transition relative min-w-[130px] aspect-square`}>
      <img src={src} alt="Photo" className="w-full h-full object-cover rounded-lg" />
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow hover:opacity-100 transition"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}