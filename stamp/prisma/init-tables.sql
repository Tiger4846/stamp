-- Create User table
CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `phone` VARCHAR(191) NOT NULL,
  `qrCode` VARCHAR(191) NOT NULL,
  `isClaimed` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_phone_key`(`phone`),
  UNIQUE INDEX `User_qrCode_key`(`qrCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Sponsor table
CREATE TABLE IF NOT EXISTS `Sponsor` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `level` ENUM('gold', 'silver') NOT NULL,
  `adminId` VARCHAR(191) NOT NULL,
  `logoUrl` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Sponsor_adminId_idx`(`adminId`),
  CONSTRAINT `Sponsor_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create UserStamp table
CREATE TABLE IF NOT EXISTS `UserStamp` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `sponsorId` VARCHAR(191) NOT NULL,
  `total` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UserStamp_userId_sponsorId_key`(`userId`, `sponsorId`),
  INDEX `UserStamp_userId_idx`(`userId`),
  INDEX `UserStamp_sponsorId_idx`(`sponsorId`),
  CONSTRAINT `UserStamp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `UserStamp_sponsorId_fkey` FOREIGN KEY (`sponsorId`) REFERENCES `Sponsor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create StampTransaction table
CREATE TABLE IF NOT EXISTS `StampTransaction` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `sponsorId` VARCHAR(191) NOT NULL,
  `amount` INT NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `StampTransaction_userId_idx`(`userId`),
  INDEX `StampTransaction_sponsorId_idx`(`sponsorId`),
  CONSTRAINT `StampTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StampTransaction_sponsorId_fkey` FOREIGN KEY (`sponsorId`) REFERENCES `Sponsor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
