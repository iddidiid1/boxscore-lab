# Future Design Notes

This directory stores ideas and design notes that may be useful after the MVP, but are not part of the current implementation scope.

## Status

Documents in this directory are drafts unless explicitly moved into a PRD.

Use one of these status labels near the top of each file:

- `Future / Not in MVP`
- `Needs Decision`
- `Approved for PRD Drafting`
- `Superseded`

## Rules

- Do not implement future-design items unless they have been moved into an approved PRD.
- MVP PRDs may link to these notes, but must not include their requirements in current acceptance criteria.
- Keep each note focused on one future topic.
- Record why the feature is not in MVP, known constraints, likely schema/API/UI impact, and open questions.

## Suggested Template

```md
# Feature Name

## Status
Future / Not in MVP

## Context

## Not In MVP

## Possible Future Rules

## Potential Impact

## Open Questions

## Current Design Constraints
```

## Notes

- `RankingDecay.md` - future ranking decay / recent-event weighting.
- `AwardSelectionRules.md` - future award lineup composition rules.
- `AwardCompleteness.md` - future exact-count award completeness enforced at Event completion.
