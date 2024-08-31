-- CreateTable
CREATE TABLE "_UserAccessibleRestaurants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserAccessibleRestaurants_A_fkey" FOREIGN KEY ("A") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserAccessibleRestaurants_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserAccessibleRestaurants_AB_unique" ON "_UserAccessibleRestaurants"("A", "B");

-- CreateIndex
CREATE INDEX "_UserAccessibleRestaurants_B_index" ON "_UserAccessibleRestaurants"("B");
