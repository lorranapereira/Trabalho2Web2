/*
  Warnings:

  - You are about to drop the `_UserAccessibleRestaurants` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN "imageUrl" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UserAccessibleRestaurants";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserRestaurant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "UserRestaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRestaurant_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRestaurant_userId_restaurantId_key" ON "UserRestaurant"("userId", "restaurantId");
