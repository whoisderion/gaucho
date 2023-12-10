/*
  Warnings:

  - You are about to drop the column `quantity` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `frontPassangerTread` on the `Maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `rearPassangerTread` on the `Maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `areaName` on the `PhotoAreas` table. All the data in the column will be lost.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `roleRole` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,fleetId]` on the table `Truck` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `frontPassengerTread` to the `Maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rearPassengerTread` to the `Maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `PhotoAreas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Role` table without a default value. This is not possible if the table is not empty.
  - The required column `urlPath` was added to the `Truck` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Fleet" DROP CONSTRAINT "Fleet_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_truckId_fkey";

-- DropForeignKey
ALTER TABLE "Maintenance" DROP CONSTRAINT "Maintenance_truckId_fkey";

-- DropForeignKey
ALTER TABLE "PhotoAreas" DROP CONSTRAINT "PhotoAreas_truckId_fkey";

-- DropForeignKey
ALTER TABLE "Photos" DROP CONSTRAINT "Photos_photoAreasId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Truck" DROP CONSTRAINT "Truck_fleetId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_roleRole_fkey";

-- DropIndex
DROP INDEX "Truck_name_key";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "quantity",
ALTER COLUMN "companyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "equipmentId",
DROP COLUMN "quantity",
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Maintenance" DROP COLUMN "frontPassangerTread",
DROP COLUMN "rearPassangerTread",
ADD COLUMN     "frontPassengerTread" TEXT NOT NULL,
ADD COLUMN     "rearPassengerTread" TEXT NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PhotoAreas" DROP COLUMN "areaName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Photos" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
DROP COLUMN "role",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "companyId" DROP NOT NULL,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "Truck" ADD COLUMN     "urlPath" TEXT NOT NULL,
ALTER COLUMN "fleetId" SET DEFAULT 'null';

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "roleRole",
ADD COLUMN     "roleName" TEXT,
ALTER COLUMN "companyId" SET DEFAULT 'End User';

-- CreateTable
CREATE TABLE "EquipmentInInventory" (
    "inventoryId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "EquipmentInInventory_pkey" PRIMARY KEY ("inventoryId","equipmentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Truck_name_fleetId_key" ON "Truck"("name", "fleetId");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleName_fkey" FOREIGN KEY ("roleName") REFERENCES "Role"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Truck" ADD CONSTRAINT "Truck_fleetId_fkey" FOREIGN KEY ("fleetId") REFERENCES "Fleet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentInInventory" ADD CONSTRAINT "EquipmentInInventory_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentInInventory" ADD CONSTRAINT "EquipmentInInventory_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoAreas" ADD CONSTRAINT "PhotoAreas_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photos" ADD CONSTRAINT "Photos_photoAreasId_fkey" FOREIGN KEY ("photoAreasId") REFERENCES "PhotoAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
