# Event Status Migration Note

Event archival is represented only by `Event.archivedAt`. The legacy
`EventStatus.ARCHIVED` value is removed by the Event Management migration.

## Preflight review

Before applying the migration to a database that may contain legacy data, run:

```sql
SELECT
  e.id,
  e.slug,
  e.name,
  e."archivedAt",
  COUNT(DISTINCT ep.id) AS participantCount,
  COUNT(DISTINCT etr.id) AS teamResultCount
FROM Event e
LEFT JOIN EventParticipant ep ON ep."eventId" = e.id
LEFT JOIN EventTeamResult etr ON etr."eventId" = e.id
WHERE e.status = 'ARCHIVED'
GROUP BY e.id, e.slug, e.name, e."archivedAt"
ORDER BY e.id;
```

Review and retain this output before migration. The migration then:

- fills a missing `archivedAt` with the migration timestamp;
- changes a legacy archived Event to `COMPLETED` only when it has at least one
  participant and every participant has exactly one team result;
- changes every other legacy archived Event to `PREPARING`;
- never infers `ONGOING`, because the old value did not preserve the prior
  workflow state.

SQLite stores Prisma enum values as text, so removing the enum member does not
require rebuilding the `Event` table. The data update ensures generated Prisma
clients never encounter the removed value.

## Post-migration verification

```sql
SELECT COUNT(*) AS remainingArchivedStatuses
FROM Event
WHERE status = 'ARCHIVED';

SELECT id, slug, status, "archivedAt"
FROM Event
WHERE "archivedAt" IS NOT NULL
ORDER BY id;
```

The first query must return `0`. Every Event included in the preflight report
must have a non-null `archivedAt` in the second query.
