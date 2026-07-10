# Screenshot Stat Import

## Status

Future / Not in MVP

## Context

The MVP records every box score through **manual data entry only** (see project overview in `CLAUDE.md`). Entering each player's line by hand is tedious.

Because match data usually originates from an in-game post-match stats panel (e.g. NBA 2K), those screenshots are a strong candidate for assisted extraction:

- Numbers are **rendered digital text**, not handwriting or photographed receipts.
- The layout is **fixed** for a given game/screen — columns (PTS/REB/AST/…) are always in the same order.
- No lighting, angle, or distortion noise.

This makes recognition far more reliable than general-purpose OCR. The idea: let the user upload a screenshot, have the system extract a **draft** of the player stats, and pre-fill the existing manual entry form for the user to review before saving.

The guiding principle is **"AI pre-fill + human confirm," never auto-commit.** This keeps the feature additive: if extraction fails or is wrong, the user simply falls back to today's manual entry with zero risk to stored data.

## Not In MVP

- No image upload / screenshot ingestion endpoint.
- No OCR or vision-model integration.
- No automatic writing of extracted stats to the database.
- No new stored fields — extraction only produces a transient draft for the entry form.
- No batch import of multiple screenshots.

## Possible Future Rules

- Flow: `upload screenshot → model extracts draft JSON → pre-fill existing entry form → user edits/confirms → save through the normal Match write path`.
- Extraction returns **only raw entry fields** that already exist on `MatchPlayerStat` / `MatchTeamOtherStat`. It must never return or infer computed values (points, averages, totals) — those stay runtime-computed per the "Never Store Computed Stats" invariant.
- Recognition runs **only on explicit user upload** (no background/polling calls), keeping cost proportional to actual use.
- Player-name alignment reuses existing `Player.name` / `slug` matching. Unmatched rows are left blank for the user to assign, never guessed silently.
- Saving still goes through the **existing Match validation and write path** — the screenshot path is an input convenience, not a second write channel that bypasses business rules.

## Potential Impact

### Approach comparison

| Approach | Cost (per image) | Effort | Notes |
|----------|------------------|--------|-------|
| Multimodal LLM (vision) | a few cents | Lowest | Returns structured JSON directly; no layout parsing code |
| Cloud OCR (Baidu/Tencent/Azure) | cheaper, has free tier | Medium | Returns text + coordinates; must reassemble columns ourselves |
| Local OCR (PaddleOCR/Tesseract) | free (compute only) | Highest | Full layout-parsing logic; brittle to layout changes |

At personal-use volume (a handful of matches per week), even the LLM-vision route costs on the order of a few RMB per month, and only when a user uploads. **Cost is not the constraint.** The recommended starting point is the LLM-vision route for lowest implementation effort.

### System impact

- **Backend**: one new endpoint accepting an image, calling the vision provider, returning draft JSON aligned to `MatchPlayerStat` fields. Requires a provider API key / config (new dependency + secret management).
- **Frontend**: an "upload screenshot to auto-fill" control on the existing match entry page that populates the current form; no new page or layout redesign.
- **API shape**: existing Match write endpoints unchanged; the new endpoint is read-only extraction (produces a draft, writes nothing).
- **Error handling**: extraction failure must degrade gracefully to manual entry, following the standard error response shape.

## Open Questions

- Which provider/model, and self-hosted OCR vs. cloud vision vs. multimodal LLM as the long-term choice?
- How to handle screenshots from different games / resolutions / stat layouts — assume a single known format first, or make it format-tolerant?
- Where does the API key live and how is per-call cost bounded (rate limit, size cap on uploads)?
- Should uploaded screenshots be stored (for re-review/audit) or discarded after extraction?
- How much confirmation friction is acceptable — always full manual review, or auto-accept high-confidence rows?
- Name matching: how to disambiguate players with similar/duplicate names across teams?

## Current Design Constraints

- Do not persist computed stats — extraction returns raw entry fields only; points/averages stay runtime-computed.
- All saves must go through the existing Match validation and write path; the screenshot flow must not bypass business rules or error-collection behavior.
- Never auto-commit extracted data — a human confirmation step is mandatory.
- Follow the five-phase workflow before implementing: this note is a future draft and must be moved into approved Backend + Frontend PRDs (`docs/prd/`) before any code is written.
