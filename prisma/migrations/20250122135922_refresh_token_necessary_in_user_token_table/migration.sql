/*
  Warnings:

  - Made the column `refresh_token` on table `user_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `refresh_token_expires_at` on table `user_tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user_tokens` MODIFY `refresh_token` VARCHAR(500) NOT NULL,
    MODIFY `refresh_token_expires_at` INTEGER NOT NULL;
