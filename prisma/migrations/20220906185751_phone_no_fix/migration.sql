/*
  Warnings:

  - A unique constraint covering the columns `[phone_no]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `prizes_pool` MODIFY `daily_limit` INTEGER NULL,
    MODIFY `stock` INTEGER NULL,
    MODIFY `total_limit` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `phone_no` VARCHAR(191) NOT NULL,
    MODIFY `draw_status` ENUM('available', 'unavailable') NOT NULL DEFAULT 'available';

-- CreateIndex
CREATE UNIQUE INDEX `users_phone_no_key` ON `users`(`phone_no`);
