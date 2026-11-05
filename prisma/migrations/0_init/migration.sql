-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Label" AS ENUM ('CAT', 'NOT_CAT');

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "label" "Label",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingRun" (
    "id" SERIAL NOT NULL,
    "rounds" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingRun_pkey" PRIMARY KEY ("id")
);

