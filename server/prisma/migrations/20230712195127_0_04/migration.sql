/*
  Warnings:

  - Added the required column `coolant` to the `Maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Maintenance" ADD COLUMN     "coolant" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT NOT NULL;
