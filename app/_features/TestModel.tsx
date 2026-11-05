"use client";

import React, { useState } from "react";
import { UploadBox } from "@/app/_components/UploadBox";
import { HelpBox } from "@/app/_components/HelpBox";
import { MainButton } from "@/app/_components/MainButton";
import { BackButton } from "@/app/_components/BackButton";
import { Score } from "@/app/_components/Score";
import { ResultTile } from "@/app/_components/ResultTile";
import { GuessResult } from "@/app/_components/GuessResult";
import { embed, getHeldOut, getTrained, predict, type Label } from "@/app/_lib/classifier";

type Guess = { label: Label; confidence: number };

type Props = {
  onBack: () => void;
  onRestart: () => void;
};

export function TestModel({ onBack, onRestart }: Props) {
  // The photos kept aside during training: no labeling needed, we already know the answers.
  const examples = getTrained();
  const heldOut = getHeldOut();
  const results: Guess[] = heldOut.map((item) => predict(examples, item.vec));
  const correct = results.filter((r, i) => r.label === heldOut[i].truth).length;

  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const [newGuess, setNewGuess] = useState<Guess | null>(null);
  const [newBusy, setNewBusy] = useState(false);
  const [error, setError] = useState("");

  const addNewPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    e.target.value = "";
    setNewPhoto(url);
    setNewGuess(null);
    setError("");
    setNewBusy(true);
    try {
      setNewGuess(predict(examples, await embed(url)));
    } catch {
      setError("The model could not read that photo. Please try another.");
    }
    setNewBusy(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-zinc-950">Step 4: Test the model</h2>

      {heldOut.length > 0 ? (
        <>
          <Score correct={correct} total={heldOut.length} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {heldOut.map((item, index) => (
              <ResultTile
                key={index}
                src={item.src}
                correct={results[index].label === item.truth}
                guess={results[index].label}
              />
            ))}
          </div>

          <HelpBox
            title="What does this mean?"
            text="These photos were kept aside and never used in training. Right means the model guessed correctly. Wrong shows what it guessed instead."
          />
        </>
      ) : (
        <HelpBox
          title="No test photos"
          text="There were too few photos to keep any aside. Go back and add at least 3 cat and 3 not cat photos. You can still try a new photo below."
        />
      )}

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-zinc-950">Try one new photo</h3>

        {newPhoto && newBusy && (
          <p className="text-sm text-zinc-500">The model is looking at your photo...</p>
        )}

        {newPhoto && newGuess && (
          <GuessResult src={newPhoto} answer={newGuess.label} confidence={newGuess.confidence} />
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <UploadBox onChange={(e) => void addNewPhoto(e)} />
      </div>

      <div className="flex justify-between items-center mt-4">
        <BackButton onClick={onBack} />
        <MainButton onClick={onRestart}>Start over</MainButton>
      </div>
    </div>
  );
}