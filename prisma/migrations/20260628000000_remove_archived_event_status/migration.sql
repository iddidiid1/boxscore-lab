-- Event archival is represented by Event.archivedAt. Preserve legacy archived
-- records while converting status back to a supported workflow state.
UPDATE "Event"
SET
  "archivedAt" = COALESCE("archivedAt", CURRENT_TIMESTAMP),
  "status" = CASE
    WHEN (
      SELECT COUNT(*)
      FROM "EventParticipant" AS participant
      WHERE participant."eventId" = "Event"."id"
    ) > 0
    AND (
      SELECT COUNT(*)
      FROM "EventParticipant" AS participant
      WHERE participant."eventId" = "Event"."id"
    ) = (
      SELECT COUNT(*)
      FROM "EventTeamResult" AS result
      WHERE result."eventId" = "Event"."id"
    )
    THEN 'COMPLETED'
    ELSE 'PREPARING'
  END
WHERE "status" = 'ARCHIVED';
