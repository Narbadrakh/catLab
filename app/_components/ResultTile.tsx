import React from "react";

type Props = {
  src: string;
  correct: boolean;
  guess: "Cat" | "Not cat";
};

export function ResultTile({ src, correct, guess }: Props) {
  const color = correct ? "#2b8a3e" : "#c92a2a";

  return (
    <div
      className="w-full overflow-hidden rounded-[12px] border-2 bg-white"
      style={{ borderColor: color }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="w-full h-28 object-cover bg-[#efe3f3]" />
      <div className="px-3 py-2 text-[14px]">
        <p className="font-bold" style={{ color }}>
          {correct ? "Right" : "Wrong"}
        </p>
        {!correct && <p className="text-zinc-700">Guessed: {guess}</p>}
      </div>
    </div>
  );
}