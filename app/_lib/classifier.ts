import type { MobileNet } from "@tensorflow-models/mobilenet";

export type Label = "Cat" | "Not cat";
export type Example = { vec: number[]; label: Label };
export type HeldOut = { src: string; truth: Label; vec: number[] };

let modelPromise: Promise<MobileNet> | null = null;

/** Loads MobileNet once (about 10-15 MB, downloaded on first use). */
export function loadModel(): Promise<MobileNet> {
  if (!modelPromise) {
    modelPromise = (async () => {
      const tf = await import("@tensorflow/tfjs");
      await tf.ready();
      const mobilenet = await import("@tensorflow-models/mobilenet");
      return mobilenet.load({ version: 2, alpha: 1.0 });
    })().catch((error) => {
      modelPromise = null; // allow a retry
      throw error;
    });
  }
  return modelPromise;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read the photo"));
    img.src = url;
  });
}

/** What the model "sees" in a photo: a list of numbers, scaled to length 1. */
export async function embed(url: string): Promise<number[]> {
  const model = await loadModel();
  const img = await loadImage(url);
  const tensor = model.infer(img, true);
  const data = Array.from(await tensor.data());
  tensor.dispose();
  const norm = Math.sqrt(data.reduce((sum, v) => sum + v * v, 0)) || 1;
  return data.map((v) => v / norm);
}

function dot(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

/** Looks at the k most similar training photos and goes with the majority. */
export function predict(
  examples: Example[],
  vec: number[],
  k = 3
): { label: Label; confidence: number } {
  if (examples.length === 0) return { label: "Not cat", confidence: 50 };
  const nearest = examples
    .map((e) => ({ label: e.label, sim: dot(e.vec, vec) }))
    .sort((a, b) => b.sim - a.sim)
    .slice(0, Math.min(k, examples.length));
  let cat = 0;
  let total = 0;
  for (const n of nearest) {
    const weight = Math.max(n.sim, 0.0001);
    total += weight;
    if (n.label === "Cat") cat += weight;
  }
  const pCat = cat / total;
  return pCat >= 0.5
    ? { label: "Cat", confidence: Math.min(99, Math.round(pCat * 100)) }
    : { label: "Not cat", confidence: Math.min(99, Math.round((1 - pCat) * 100)) };
}

/** Hide each photo in turn and guess it from the others: an honest accuracy. */
export function looAccuracy(examples: Example[]): number {
  if (examples.length < 2) return 0;
  let right = 0;
  examples.forEach((example, i) => {
    const others = examples.filter((_, j) => j !== i);
    if (predict(others, example.vec).label === example.label) right += 1;
  });
  return Math.round((right / examples.length) * 100);
}

// What the Train screen learned, shared with the Test screen.
let trained: Example[] = [];
let heldOut: HeldOut[] = [];

export const setTrained = (examples: Example[]) => {
  trained = examples;
};
export const getTrained = () => trained;

/** Photos kept aside during training. The model never learns from these. */
export const setHeldOut = (items: HeldOut[]) => {
  heldOut = items;
};
export const getHeldOut = () => heldOut;