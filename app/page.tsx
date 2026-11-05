"use client";

import React, { useState } from "react";
import { StepBar } from "@/app/_components/Stepbar";
import { StepCard } from "@/app/_components/StepCard";
import { UploadPhotos } from "@/app/_features/UploadPhotos";
import { LabelPhotos, type Label } from "@/app/_features/LabelPhotos";
import { TrainModel } from "@/app/_features/TrainModel";
import { TestModel } from "@/app/_features/TestModel";

const TITLES = [
  "Screen 1: Upload",
  "Screen 2: Label",
  "Screen 3: Train",
  "Screen 4: Test",
];

export default function Home() {
  const [step, setStep] = useState<number>(1);
  const [images, setImages] = useState<string[]>([]);
  const [labels, setLabels] = useState<{ [key: number]: Label }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const urls = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...urls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    // Labels are stored by position, so rebuild them after a removal.
    const next: { [key: number]: Label } = {};
    Object.entries(labels).forEach(([key, value]) => {
      const i = Number(key);
      if (i < index) next[i] = value;
      else if (i > index) next[i - 1] = value;
    });
    setLabels(next);
  };

  const setLabelForImage = (index: number, label: Label) => {
    setLabels((prev) => ({ ...prev, [index]: label }));
  };

  const restart = () => {
    setImages([]);
    setLabels({});
    setStep(1);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fc] font-sans text-zinc-800 p-6">
      <div className="w-full max-w-4xl mb-4">
        <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase">
          PART 3 · TRAINING GROUND
        </span>
        <h1 className="text-2xl font-black text-zinc-900 mt-1">{TITLES[step - 1]}</h1>
      </div>

      <StepCard>
        <StepBar currentStep={step} />

        {step === 1 && (
          <UploadPhotos
            images={images}
            onChange={handleImageChange}
            onRemove={removeImage}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <LabelPhotos
            images={images}
            labels={labels}
            onLabel={setLabelForImage}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <TrainModel
            images={images}
            labels={labels}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && <TestModel onBack={() => setStep(3)} onRestart={restart} />}
      </StepCard>
    </div>
  );
}