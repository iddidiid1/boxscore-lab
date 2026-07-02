-- Add Match voiding without deleting historical records.
ALTER TABLE "Match" ADD COLUMN "voidedAt" DATETIME;

CREATE INDEX "Match_voidedAt_idx" ON "Match"("voidedAt");

-- Normalize disposable pre-production null ratings before making rating required.
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_MatchPlayerStat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rebounds" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "fieldGoalsMade" INTEGER NOT NULL DEFAULT 0,
    "fieldGoalsAttempted" INTEGER NOT NULL DEFAULT 0,
    "threePointersMade" INTEGER NOT NULL DEFAULT 0,
    "threePointersAttempted" INTEGER NOT NULL DEFAULT 0,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "rating" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MatchPlayerStat_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MatchPlayerStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchPlayerStat_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_MatchPlayerStat" (
    "assists",
    "createdAt",
    "fieldGoalsAttempted",
    "fieldGoalsMade",
    "id",
    "matchId",
    "minutes",
    "playerId",
    "points",
    "rating",
    "rebounds",
    "teamId",
    "threePointersAttempted",
    "threePointersMade",
    "updatedAt"
)
SELECT
    "assists",
    "createdAt",
    "fieldGoalsAttempted",
    "fieldGoalsMade",
    "id",
    "matchId",
    "minutes",
    "playerId",
    "points",
    COALESCE("rating", 0),
    "rebounds",
    "teamId",
    "threePointersAttempted",
    "threePointersMade",
    "updatedAt"
FROM "MatchPlayerStat";

DROP TABLE "MatchPlayerStat";
ALTER TABLE "new_MatchPlayerStat" RENAME TO "MatchPlayerStat";

CREATE UNIQUE INDEX "MatchPlayerStat_matchId_playerId_key" ON "MatchPlayerStat"("matchId", "playerId");
CREATE INDEX "MatchPlayerStat_matchId_idx" ON "MatchPlayerStat"("matchId");
CREATE INDEX "MatchPlayerStat_playerId_idx" ON "MatchPlayerStat"("playerId");
CREATE INDEX "MatchPlayerStat_teamId_idx" ON "MatchPlayerStat"("teamId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
