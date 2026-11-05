import React from "react";
import { ArrowRight } from "lucide-react";
import { UploadBox } from "@/app/_components/UploadBox";
import { PhotoTile } from "@/app/_components/PhotoTile";
import { HelpBox } from "@/app/_components/HelpBox";
import { MainButton } from "@/app/_components/MainButton";
import { LockedButton } from "@/app/_components/LockedButton";

type Props = {
  images: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onNext: () => void;
};

export function UploadPhotos({ images, onChange, onRemove, onNext }: Props) {
  // Rule: Next unlocks at 2 or more photos.
  const canContinue = images.length >= 2;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-zinc-950">Step 1: Add your photos</h2>

      <UploadBox onChange={onChange} />

      {images.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-zinc-700">
            Selected Photos ({images.length}):
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-48 overflow-y-auto p-2 border border-zinc-200 rounded-xl bg-zinc-50">
            {images.map((src, index) => (
              <div key={index} className="relative group">
                <PhotoTile src={src} onRemove={() => onRemove(index)} />
              </div>
            ))}
          </div>
        </div>
      )}

      <HelpBox
        title="Why add more photos?"
        text="The more photos the model sees, the better it learns what a cat looks like. Add at least 2."
      />

      <div className="flex justify-end mt-2">
        {canContinue ? (
          <MainButton onClick={onNext}>
            Next: Label photos <ArrowRight className="w-5 h-5" />
          </MainButton>
        ) : (
          <div className="w-72">
            <LockedButton>Add 2 or more photos to continue</LockedButton>
          </div>
        )}
      </div>
    </div>
  );
}