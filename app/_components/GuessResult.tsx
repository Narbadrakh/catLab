import React from "react";

type Props = {
  src?: string;
  answer: "Cat" | "Not cat";
  /** 0-100 */
  confidence: number;
};

export function GuessResult({ src, answer, confidence }: Props) {
  const isCat = answer === "Cat";
  const color = isCat ? "#e8590c" : "#2b8a3e";
  const percent = Math.min(100, Math.max(0, Math.round(confidence)));

  return (
    <div className="flex items-center gap-5 bg-[#f4f6fb] rounded-[12px] p-5">
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={150}
          height={150}
          className="object-cover shrink-0"
          style={{ width: 150, height: 150, borderRadius: 12 }}
        />
      )}
      <div className="flex-1 min-w-0">
        <p
          className="text-[26px] leading-tight"
          style={{ color, fontFamily: "Fredoka, system-ui, sans-serif", fontWeight: 600 }}
        >
          {isCat ? "A cat" : "Not a cat"}
        </p>
        <div className="mt-2 h-[14px] w-full rounded-full bg-white border border-[#dfe4ee] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%`, background: color }}
          />
        </div>
        <p
          className="mt-2 text-[15px] text-[#5d6779]"
          style={{ fontFamily: "Nunito, system-ui, sans-serif" }}
        >
          {percent}% sure
        </p>
      </div>
    </div>
  );
}