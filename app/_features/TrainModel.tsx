"use client";

import React, { useEffect, useRef, useState } from "react";
import { RoundCounter } from "@/app/_components/RoundCounter";
import { ProgressBar } from "@/app/_components/ProgressBar";
import { AccuracyChart } from "@/app/_components/AccuracyChart";
import { HelpBox } from "@/app/_components/HelpBox";
import { MainButton } from "@/app/_components/MainButton";
import { BackButton } from "@/app/_components/BackButton";
import { LockedButton } from "@/app/_components/LockedButton";
import {
  embed,
  loadModel,
  looAccuracy,
  setHeldOut,
  setTrained,
  type Example,
  type HeldOut,
  type Label,
} from "@/app/_lib/classifier";

const TOTAL_ROUNDS = 10;

type Phase = "idle" | "loading" | "training" | "done" | "error";

type Props = {
  images: string[];
  labels: { [key: number]: Label };
  onBack: () => void;
  onNext: () => void;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const shuffle = (list: number[]) => list.slice().sort(() => Math.random() - 0.5);

/** Keeps about 1 in 4 photos of each group aside for the test (at least 1 when a group has 3+). */
function split(labels: { [key: number]: Label }, count: number) {
  const train: number[] = [];
  const test: number[] = [];
  for (const label of ["Cat", "Not cat"] as Label[]) {
    const group = shuffle(
      Array.from({ length: count }, (_, i) => i).filter((i) => labels[i] === label)
    );
    const holdOut = group.length >= 3 ? Math.max(1, Math.floor(group.length / 4)) : 0;
    test.push(...group.slice(0, holdOut));
    train.push(...group.slice(holdOut));
  }
  return { train: shuffle(train), test };
}

export function TrainModel({ images, labels, onBack, onNext }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const catCount = Object.values(labels).filter((l) => l === "Cat").length;
  const notCatCount = Object.values(labels).filter((l) => l === "Not cat").length;

  async function start() {
    setPhase("loading");
    setRound(0);
    setHistory([]);
    try {
      await loadModel();
      if (!alive.current) return;
      setPhase("training");

      const { train, test } = split(labels, images.length);
      const examples: Example[] = [];
      let finalAccuracy = 0;

      for (let r = 1; r <= TOTAL_ROUNDS; r++) {
        // Each round the model studies the next part of the training photos.
        const upto = Math.ceil((train.length * r) / TOTAL_ROUNDS);
        while (examples.length < upto) {
          const index = train[examples.length];
          examples.push({ vec: await embed(images[index]), label: labels[index] });
          if (!alive.current) return;
        }
        const acc = looAccuracy(examples);
        finalAccuracy = acc;
        setHistory((h) => [...h, acc]);
        setRound(r);
        await sleep(250);
        if (!alive.current) return;
      }

      // The photos kept aside: the model only looks at them for the test.
      const held: HeldOut[] = [];
      for (const index of test) {
        held.push({ src: images[index], truth: labels[index], vec: await embed(images[index]) });
        if (!alive.current) return;
      }

      setTrained(examples);
      setHeldOut(held);

      // Сургалтын дүнг манай API-аар дамжуулан Postgres-д хадгалах
      try {
        await fetch("/api/training", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rounds: TOTAL_ROUNDS, accuracy: finalAccuracy }),
        });
      } catch (err) {
        console.error("Сургалтын дүнг хадгалж чадсангүй:", err);
      }

      setPhase("done");
    } catch {
      if (alive.current) setPhase("error");
    }
  }

  const done = phase === "done";
  const busy = phase === "loading" || phase === "training";
  const progress = Math.round((round / TOTAL_ROUNDS) * 100);

  const bigLabel =
    phase === "loading"
      ? "Loading the model..."
      : phase === "training"
      ? "Training..."
      : phase === "done"
      ? "Training finished"
      : phase === "error"
      ? "Try again"
      : "Start training";

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-zinc-950">Step 3: Train the model</h2>

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          disabled={busy || done}
          onClick={() => void start()}
          className="rounded-[14px] bg-[#3b5bdb] px-[34px] py-[18px] text-[19px] font-bold text-white transition-colors hover:bg-[#364fc7] disabled:cursor-default disabled:hover:bg-[#3b5bdb]"
        >
          {bigLabel}
        </button>
        {phase === "idle" && (
          <p className="text-center text-sm text-zinc-500">
            {images.length} photos ({catCount} cat, {notCatCount} not cat). About 1 in 4 of each
            group is kept aside for the test, so the model never trains on them. The first start
            downloads the model (about 10-15 MB).
          </p>
        )}
        {phase === "error" && (
          <p className="text-sm text-red-600">
            The model could not be loaded. Check your internet connection and try again.
          </p>
        )}
      </div>

      <div className="flex justify-center">
        <RoundCounter currentRound={round} totalRounds={TOTAL_ROUNDS} />
      </div>

      <ProgressBar progress={progress} />

      <AccuracyChart data={history} totalRounds={TOTAL_ROUNDS} />

      <HelpBox
        title={done ? "Training finished" : "What is happening?"}
        text={
          done
            ? "The model learned from your labeled photos. The line shows how often it is right when it hides one training photo and guesses it from the others. Next it is tested on the photos it never saw."
            : "After each round the model studies more of your labeled photos and learns what a cat looks like."
        }
      />

      <div className="flex justify-between items-center mt-4">
        <BackButton onClick={onBack} />
        {done ? (
          <MainButton onClick={onNext}>Next: Test model</MainButton>
        ) : (
          <div className="w-72">
            <LockedButton>
              {busy ? "Wait for all rounds to finish" : "Press Start training"}
            </LockedButton>
          </div>
        )}
      </div>
    </div>
  );
}