/*
  Warnings:

  - You are about to drop the column `tireTread` on the `Maintenance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Truck` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `frontDriverTread` to the `Maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frontPassangerTread` to the `Maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rearDriverTread` to the `Maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rearPassangerTread` to the `Maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Maintenance" DROP COLUMN "tireTread",
ADD COLUMN     "frontDriverTread" TEXT NOT NULL,
ADD COLUMN     "frontPassangerTread" TEXT NOT NULL,
ADD COLUMN     "rearDriverTread" TEXT NOT NULL,
ADD COLUMN     "rearPassangerTread" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Truck_name_key" ON "Truck"("name");
