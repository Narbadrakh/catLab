import React from "react";

import { PhotoTile } from "@/app/_components/PhotoTile";
import { LabelButtons } from "@/app/_components/LabelButtons";
import { CountPills } from "@/app/_components/CountPills";
import { HelpBox } from "@/app/_components/HelpBox";
import { MainButton } from "@/app/_components/MainButton";
import { BackButton } from "@/app/_components/BackButton";
import { LockedButton } from "@/app/_components/LockedButton";

export type Label = "Cat" | "Not cat";

type Props = {
  images: string[];
  labels: { [key: number]: Label };
  onLabel: (index: number, label: Label) => void;
  onBack: () => void;
  onNext: () => void;
};

export function LabelPhotos({ images, labels, onLabel, onBack, onNext }: Props) {
  const catCount = Object.values(labels).filter((l) => l === "Cat").length;
  const notCatCount = Object.values(labels).filter((l) => l === "Not cat").length;
  const stillToLabel = images.length - Object.keys(labels).length;

  // Rule: every photo has a label and both groups have at least 1.
  const canContinue = stillToLabel === 0 && catCount >= 1 && notCatCount >= 1;

  // Зураг бүрийг манай API руу илгээж хадгалаад дараагийн алхам руу шилжих
  const handleNextWithSupabase = async () => {
    try {
      for (let i = 0; i < images.length; i++) {
        const blob = await (await fetch(images[i])).blob();
        const ext = blob.type.split("/")[1] || "jpg";
        const file = new File([blob], `photo-${i}.${ext}`, { type: blob.type });

        const form = new FormData();
        form.append("file", file);
        form.append("label", labels[i]);

        const res = await fetch("/api/photos", { method: "POST", body: form });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          console.error("Хадгалахад алдаа гарлаа:", data);
          alert("Хадгалахад алдаа гарлаа. Console-оо шалгаарай.");
          return; // алдаа гарвал дараагийн алхам руу шилжихгүй
        }
      }
      onNext();
    } catch (err) {
      console.error("Хадгалахад алдаа гарлаа:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-zinc-950">
        Step 2: Tell the model what each photo is
      </h2>

      <HelpBox
        title="Tip"
        text="Press Cat or Not cat under each photo. Label every photo to continue."
      />

      <div className="flex items-center gap-3">
        <CountPills catCount={catCount} notCatCount={notCatCount} />
        <span className="bg-[#edf2f7] text-zinc-600 px-3 py-1 rounded-full text-xs font-bold">
          Still to label: {stillToLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((src, index) => {
          const currentLabel = labels[index];
          return (
            <div
              key={index}
              className="border-2 rounded-xl p-3 flex flex-col items-center justify-between gap-3 shadow-xs bg-white"
            >
              <div className="w-full">
                <PhotoTile src={src} label={currentLabel} />
              </div>
              <LabelButtons
                currentLabel={currentLabel}
                onSelect={(label) => onLabel(index, label)}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-4">
        <BackButton onClick={onBack} />
        {canContinue ? (
          <MainButton onClick={handleNextWithSupabase}>Next: Train Model</MainButton>
        ) : (
          <div className="w-72">
            <LockedButton>
              {stillToLabel > 0
                ? `Label ${stillToLabel} more to continue`
                : "Need at least 1 Cat and 1 Not cat"}
            </LockedButton>
          </div>
        )}
      </div>
    </div>
  );
}