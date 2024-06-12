/*
  Warnings:

  - You are about to alter the column `status` on the `Issue` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Issue` MODIFY `status` ENUM('WEB2', 'WEB3', 'NON_TECH') NOT NULL DEFAULT 'WEB2';
