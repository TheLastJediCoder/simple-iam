/*
  Warnings:

  - The `refresh_token_expires_at` column on the `user_tokens` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `access_token_expires_at` on the `user_tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `is_revoked` on table `user_tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user_tokens` DROP COLUMN `access_token_expires_at`,
    ADD COLUMN `access_token_expires_at` INTEGER NOT NULL,
    MODIFY `refresh_token` VARCHAR(500) NULL,
    DROP COLUMN `refresh_token_expires_at`,
    ADD COLUMN `refresh_token_expires_at` INTEGER NULL,
    MODIFY `is_revoked` BOOLEAN NOT NULL DEFAULT false;
