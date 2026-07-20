# E6 Candidate-System Approval Packet

## Gate E2 proposal

Editorial Scoreboard passed whole-system Gate E2 review on 2026-07-20. The
approval authorizes formalization into active project documentation and
token/theme sources. It does **not** authorize an unbounded frontend rewrite or
the deferred Player Awards workflow redesign.

## Approval evidence

| Evidence | Result |
|---|---|
| Decision log | Continuous `UI-DEC-000` through `UI-DEC-058` |
| Inventory | 97 items: 91 Approved, 4 Deferred, 2 Rejected |
| Foundation/component batches | B01–B07 approved |
| Product patterns | Team, Player, Event, and Match rounds approved |
| Page scenarios | All Overview/List, Detail, and Create/Edit families approved |
| Candidate specification | Consolidated in `DESIGN.md` |
| Production-token contract | Mapped in `TOKEN_MAPPING.md` |
| Exceptions and implementation impact | Recorded in `MIGRATION_PLAN.md` |

## Coverage summary

| Inventory level | Approved | Deferred | Rejected | Total |
|---|---:|---:|---:|---:|
| Foundation | 11 | 0 | 0 | 11 |
| Component and Component variant | 59 | 0 | 2 | 61 |
| Pattern | 21 | 4 | 0 | 25 |
| **Total** | **91** | **4** | **2** | **97** |

The three approved page-pattern families are validated by 12 E5 page scenarios
covering Teams, Players, Events, and Matches. Scenario files are evidence rather
than additional inventory components.

## Candidate in one view

- Neutral Black canvas with low-strength neutral ambience;
- Deep Green Black Brand Mint `#43f2c8`;
- Anton display, Space Grotesk interface/body, JetBrains Mono data;
- 4/8/10/12px precise shape hierarchy;
- Editorial Outline for Editor contexts;
- edge-highlight Dark Glass for Data and Summary;
- restricted 40% Deep Light Glass for Team identity;
- one compact, outline-hierarchy action family with solid Mint Primary;
- 40px fields, 34px dense number entry, 38px table rows;
- Neutral Gradient Edge Plate tags and separate Event/Match Stage scales;
- Ruled Grid summaries and unified Data Bay tables;
- restrained state feedback, explicit keyboard focus, and Reduced Motion;
- named product patterns instead of one universal Card.

## Explicit boundaries

Approval retains the existing Sidebar shell/brand structure and Main Content
Shell. It rejects the decorative Page Eyebrow and nested Team Logo Container.
It preserves the existing Event Player Awards selection behavior until a
separate functional-design PR.

Pattern exceptions are limited to their named scopes: Team identity glass,
Leader category Glow, Tournament Insignia, Black Metal Plaque, Team-color
traces, Championship Gold outcomes, Operational Neutral Other rows, and
Neutral Ambient.

## Formalization after approval

The first post-approval change is M0 only:

1. replace the active design intent in `docs/DESIGN.md`;
2. mirror approved semantic values into canonical `variables.css`;
3. align the Mantine theme;
4. mark inventory items Formalized.

Page migration then follows bounded M1–M6 batches and the existing frontend PRD
approval workflow. Formalization and implementation may be separate commits or
PRs.

## Gate E2 decision

Approve only if all of the following are acceptable as one system:

- the visual direction and component/pattern rules in `DESIGN.md`;
- the proposed semantic contract in `TOKEN_MAPPING.md`;
- the named exceptions, deferrals, and rejected directions;
- the migration boundary and M0–M6 sequence in `MIGRATION_PLAN.md`.

Gate E2 is approved. Active design intent now lives in `docs/DESIGN.md`;
application migration remains governed by the bounded migration plan and
frontend PRD approvals.
