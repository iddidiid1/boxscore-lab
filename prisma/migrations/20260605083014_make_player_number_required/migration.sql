/*
  Warnings:

  - You are about to drop the `Competition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompetitionResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MatchPlayerStats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `competitionId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `matchDate` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `scoreA` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `scoreB` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `teamAId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `teamBId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `attribute` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Player` table. All the data in the column will be lost.
  - Added the required column `eventId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playedAt` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Made the column `position` on table `Player` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `slug` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Competition_seasonId_name_key";

-- DropIndex
DROP INDEX "Competition_seasonId_idx";

-- DropIndex
DROP INDEX "CompetitionResult_competitionId_rank_key";

-- DropIndex
DROP INDEX "CompetitionResult_competitionId_teamId_key";

-- DropIndex
DROP INDEX "CompetitionResult_teamId_idx";

-- DropIndex
DROP INDEX "CompetitionResult_competitionId_idx";

-- DropIndex
DROP INDEX "MatchPlayerStats_matchId_playerId_key";

-- DropIndex
DROP INDEX "MatchPlayerStats_teamId_idx";

-- DropIndex
DROP INDEX "MatchPlayerStats_playerId_idx";

-- DropIndex
DROP INDEX "MatchPlayerStats_matchId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Competition";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CompetitionResult";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MatchPlayerStats";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Division" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeamProfileRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "defense" REAL NOT NULL,
    "offense" REAL NOT NULL,
    "consistency" REAL NOT NULL,
    "cohesion" REAL NOT NULL,
    "depth" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TeamProfileRating_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "seasonId" INTEGER,
    "name" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PREPARING',
    "description" TEXT,
    "rankingOrder" INTEGER NOT NULL,
    "countsForRanking" BOOLEAN NOT NULL DEFAULT true,
    "archivedAt" DATETIME,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventStageTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "EventStageTag_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventResultTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isWinnerTag" BOOLEAN NOT NULL DEFAULT false,
    "rankingPoints" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "EventResultTag_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventParticipant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventParticipant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventParticipant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventTeamResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "resultTagId" INTEGER NOT NULL,
    "rank" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EventTeamResult_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventTeamResult_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventTeamResult_resultTagId_fkey" FOREIGN KEY ("resultTagId") REFERENCES "EventResultTag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventPlayerAward" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "awardType" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EventPlayerAward_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventPlayerAward_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventPlayerAward_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchTeam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "MatchTeam_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MatchTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchPlayerStat" (
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
    "rating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MatchPlayerStat_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MatchPlayerStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchPlayerStat_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchTeamOtherStat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rebounds" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "fieldGoalsMade" INTEGER NOT NULL DEFAULT 0,
    "fieldGoalsAttempted" INTEGER NOT NULL DEFAULT 0,
    "threePointersMade" INTEGER NOT NULL DEFAULT 0,
    "threePointersAttempted" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "MatchTeamOtherStat_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MatchTeamOtherStat_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "stageTagId" INTEGER,
    "playedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Match_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_stageTagId_fkey" FOREIGN KEY ("stageTagId") REFERENCES "EventStageTag" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE INDEX "Match_eventId_idx" ON "Match"("eventId");
CREATE INDEX "Match_stageTagId_idx" ON "Match"("stageTagId");
CREATE INDEX "Match_playedAt_idx" ON "Match"("playedAt");
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("createdAt", "id", "position", "teamId", "updatedAt") SELECT "createdAt", "id", "position", "teamId", "updatedAt" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_slug_key" ON "Player"("slug");
CREATE INDEX "Player_teamId_idx" ON "Player"("teamId");
CREATE INDEX "Player_position_idx" ON "Player"("position");
CREATE INDEX "Player_isActive_idx" ON "Player"("isActive");
CREATE UNIQUE INDEX "Player_teamId_number_key" ON "Player"("teamId", "number");
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "divisionId" INTEGER,
    "logoUrl" TEXT,
    "primaryColor" TEXT,
    "description" TEXT,
    "overallRating" REAL,
    "archivedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Team_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("createdAt", "description", "id", "name", "updatedAt") SELECT "createdAt", "description", "id", "name", "updatedAt" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_slug_key" ON "Team"("slug");
CREATE INDEX "Team_divisionId_idx" ON "Team"("divisionId");
CREATE INDEX "Team_name_idx" ON "Team"("name");
CREATE INDEX "Team_archivedAt_idx" ON "Team"("archivedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Division_slug_key" ON "Division"("slug");

-- CreateIndex
CREATE INDEX "Division_sortOrder_name_idx" ON "Division"("sortOrder", "name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamProfileRating_teamId_key" ON "TeamProfileRating"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_seasonId_idx" ON "Event"("seasonId");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_tier_idx" ON "Event"("tier");

-- CreateIndex
CREATE INDEX "Event_countsForRanking_rankingOrder_idx" ON "Event"("countsForRanking", "rankingOrder");

-- CreateIndex
CREATE INDEX "Event_archivedAt_idx" ON "Event"("archivedAt");

-- CreateIndex
CREATE INDEX "Event_deletedAt_idx" ON "Event"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Event_rankingOrder_key" ON "Event"("rankingOrder");

-- CreateIndex
CREATE INDEX "EventStageTag_eventId_idx" ON "EventStageTag"("eventId");

-- CreateIndex
CREATE INDEX "EventStageTag_sortOrder_idx" ON "EventStageTag"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "EventStageTag_eventId_slug_key" ON "EventStageTag"("eventId", "slug");

-- CreateIndex
CREATE INDEX "EventResultTag_eventId_idx" ON "EventResultTag"("eventId");

-- CreateIndex
CREATE INDEX "EventResultTag_sortOrder_idx" ON "EventResultTag"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "EventResultTag_eventId_slug_key" ON "EventResultTag"("eventId", "slug");

-- CreateIndex
CREATE INDEX "EventParticipant_teamId_idx" ON "EventParticipant"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "EventParticipant_eventId_teamId_key" ON "EventParticipant"("eventId", "teamId");

-- CreateIndex
CREATE INDEX "EventTeamResult_eventId_idx" ON "EventTeamResult"("eventId");

-- CreateIndex
CREATE INDEX "EventTeamResult_teamId_idx" ON "EventTeamResult"("teamId");

-- CreateIndex
CREATE INDEX "EventTeamResult_resultTagId_idx" ON "EventTeamResult"("resultTagId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTeamResult_eventId_teamId_key" ON "EventTeamResult"("eventId", "teamId");

-- CreateIndex
CREATE INDEX "EventPlayerAward_eventId_idx" ON "EventPlayerAward"("eventId");

-- CreateIndex
CREATE INDEX "EventPlayerAward_playerId_idx" ON "EventPlayerAward"("playerId");

-- CreateIndex
CREATE INDEX "EventPlayerAward_teamId_idx" ON "EventPlayerAward"("teamId");

-- CreateIndex
CREATE INDEX "EventPlayerAward_awardType_idx" ON "EventPlayerAward"("awardType");

-- CreateIndex
CREATE UNIQUE INDEX "EventPlayerAward_eventId_playerId_awardType_key" ON "EventPlayerAward"("eventId", "playerId", "awardType");

-- CreateIndex
CREATE INDEX "MatchTeam_teamId_idx" ON "MatchTeam"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchTeam_matchId_role_key" ON "MatchTeam"("matchId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "MatchTeam_matchId_teamId_key" ON "MatchTeam"("matchId", "teamId");

-- CreateIndex
CREATE INDEX "MatchPlayerStat_matchId_idx" ON "MatchPlayerStat"("matchId");

-- CreateIndex
CREATE INDEX "MatchPlayerStat_playerId_idx" ON "MatchPlayerStat"("playerId");

-- CreateIndex
CREATE INDEX "MatchPlayerStat_teamId_idx" ON "MatchPlayerStat"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchPlayerStat_matchId_playerId_key" ON "MatchPlayerStat"("matchId", "playerId");

-- CreateIndex
CREATE INDEX "MatchTeamOtherStat_teamId_idx" ON "MatchTeamOtherStat"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchTeamOtherStat_matchId_teamId_key" ON "MatchTeamOtherStat"("matchId", "teamId");
