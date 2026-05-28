-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountSecuritySettings" JSONB,
ADD COLUMN     "notificationSettings" JSONB,
ADD COLUMN     "privacySettings" JSONB;
