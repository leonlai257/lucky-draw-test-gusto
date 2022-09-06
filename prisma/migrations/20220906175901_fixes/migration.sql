/*
  Warnings:

  - You are about to drop the column `daily` on the `prizes_pool` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `prizes_pool` table. All the data in the column will be lost.
  - Added the required column `daily_limit` to the `prizes_pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `prizes_pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_limit` to the `prizes_pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `draw_status` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `prizes_pool` DROP COLUMN `daily`,
    DROP COLUMN `total`,
    ADD COLUMN `daily_limit` INTEGER NOT NULL,
    ADD COLUMN `stock` INTEGER NOT NULL,
    ADD COLUMN `total_limit` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `draw_status` ENUM('available', 'unavailable') NOT NULL;
