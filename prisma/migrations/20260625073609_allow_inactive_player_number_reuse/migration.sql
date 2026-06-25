-- DropIndex
DROP INDEX "Player_teamId_number_key";

-- CreateIndex
CREATE INDEX "Player_teamId_number_isActive_idx" ON "Player"("teamId", "number", "isActive");
