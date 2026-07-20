# Editorial Scoreboard 迁移 PRD 索引

## 1. 用途

本索引定义 Editorial Scoreboard 迁移文档中使用的 `M0`–`M6` 阶段简称，并提供各阶段
对应的权威文档入口。各 PRD 中的 `M1`、`M2` 等标记仅表示实施顺序和依赖边界，不是
产品功能、数据状态、API version 或独立业务概念。

实施批次的完整边界与验证顺序记录在
[`design-proposals/editorial-scoreboard/MIGRATION_PLAN.md`](../../design-proposals/editorial-scoreboard/MIGRATION_PLAN.md)；
本文件是 `docs/prd` 内用于查找正式 PRD 的稳定入口。

## 2. 阶段索引

| 阶段 | 正式名称 | 主要职责 | PRD / 权威入口 |
|---|---|---|---|
| M0 | Formalize the Contract | 正式化设计、token 与 Mantine theme | [`docs/DESIGN.md`](../DESIGN.md)、[`variables.css`](../../apps/frontend/src/styles/variables.css)、[`theme.ts`](../../apps/frontend/src/app/theme.ts) |
| M1 | Foundation and Shared Primitives | 背景、排版、surface、action、form、feedback、status 与 motion | [Frontend PRD](./EditorialScoreboardSharedPrimitivesFrontendPRD.md) · [Backend 边界 PRD](./EditorialScoreboardSharedPrimitivesBackendPRD.md) |
| M2 | Data Display | Data Bay、table、row states、Ruled Grid、pagination、Filter Bar 与 fractional stars | [Frontend PRD](./EditorialScoreboardDataDisplayFrontendPRD.md) · [Backend 边界 PRD](./EditorialScoreboardDataDisplayBackendPRD.md) |
| M3 | Team and Player Patterns | Team identity/cards、Team hero/editor preview、leader cards 与 Player detail patterns | [Frontend PRD](./EditorialScoreboardTeamPlayerPatternsFrontendPRD.md) · [Backend 边界 PRD](./EditorialScoreboardTeamPlayerPatternsBackendPRD.md) |
| M4 | Event Patterns | Event cards/detail hierarchy、Tournament Insignia、Awards plaque 与 Event editor shells | [Frontend PRD](./EditorialScoreboardEventPatternsFrontendPRD.md) · [Backend 边界 PRD](./EditorialScoreboardEventPatternsBackendPRD.md) |
| M5 | Match Patterns | Scoreline Rail、Arena Scoreline、Match detail data display 与 Match editor composition | [Frontend PRD](./EditorialScoreboardMatchPatternsFrontendPRD.md) · [Backend 边界 PRD](./EditorialScoreboardMatchPatternsBackendPRD.md) |
| M6 | Scenario Sweep and Cleanup | 跨页面场景验证、重复样式清理与最终验收 | [`UI_REDESIGN_READINESS_CHECKLIST.md`](../UI_REDESIGN_READINESS_CHECKLIST.md) |

## 3. 阅读规则

- 阅读某一业务阶段时，先阅读该阶段 Frontend PRD；Backend PRD 用于确认数据、API 与
  业务边界是否保持不变。
- 后续阶段可以复用已批准的前序阶段 primitive，但不因此获得重新设计前序阶段的权限。
- `docs/DESIGN.md` 始终拥有视觉决策；feature PRD 始终拥有既有内容、路由、数据和
  业务行为；本组迁移 PRD 只拥有对应阶段的实施范围和验收目标。
- proposal、preview、lab 与 decision log 是设计历史或验证证据，不替代上述正式 SOT。
