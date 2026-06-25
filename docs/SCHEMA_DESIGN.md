# Schema Design Reference

本文档记录当前项目 schema 的设计意图、领域边界和后续实施时需要回溯的原因。

`prisma/schema.prisma` 仍是数据库模型的 source of truth。本文档不替代 Prisma schema，也不直接定义 API 行为；当具体功能 PRD 与当前 schema 发生差异时，应在对应 PRD、迁移和本文档中同步记录原因。

## 1. 设计目标

本项目是个人 fantasy basketball box score 与 league statistics Web App。MVP 目标是支持手动录入球队、球员、赛事、比赛和统计记录，并基于保存的原始记录计算积分、榜单和统计数据。

Schema 设计遵循以下原则：

- 数据库存储原始实体、比赛记录、赛事结果和奖项记录。
- 不存储平均值、总分、榜单排名等可由原始记录推导的数据。
- 需要保留历史可追溯性的实体优先软删除或归档。
- MVP 保持数据模型简单，不提前实现复杂赛程、球员转会历史、认证、多用户权限等未来能力。
- 运行时统计规则由后端服务实现，数据库约束只承担稳定且明确的数据完整性职责。

## 2. 领域模型总览

当前 schema 可分为六个领域：

| 领域 | Models | 设计意图 |
| --- | --- | --- |
| 赛季与分区 | `Season`, `Division` | 为赛事和球队提供组织维度。MVP 中 Division 主要通过 seed 维护，Season 是未来扩展友好的赛事分组元数据。 |
| 球队与球员 | `Team`, `TeamProfileRating`, `Player` | 管理球队资料、球员名单和主观能力评分。球队 slug 与球员 slug 由后端生成。 |
| 赛事配置 | `Event`, `EventStageTag`, `EventResultTag` | 描述一次赛事、赛事阶段标签和该赛事内的结果标签及积分。 |
| 赛事参与与结果 | `EventParticipant`, `EventTeamResult`, `EventPlayerAward` | 记录哪些球队参加赛事、最终结果和球员荣誉。 |
| 比赛记录 | `Match`, `MatchTeam` | 记录赛事内具体比赛、比赛阶段和主客队关系。 |
| Box score 统计 | `MatchPlayerStat`, `MatchTeamOtherStat` | 保存每场比赛的球员统计和球队级统计，作为平均值与详情统计的计算来源。 |

## 3. 核心不变量

### 3.1 不存储派生统计

数据库不得新增或持久化以下派生字段：

- 球队当前积分，例如 `currentPoints`, `manualPoints`, `basePoints`
- 场均统计，例如 `avgPoints`, `avgRebounds`, `avgAssists`
- 排名、榜单位置或 standings 结果

球队总积分运行时计算：

```text
totalPoints = BASE_TEAM_POINTS + sum(EventTeamResult.resultTag.rankingPoints)
```

MVP 积分资格条件：

- `Event.status = COMPLETED`
- `Event.countsForRanking = true`
- `Event.deletedAt = null`
- `Event.archivedAt = null`

`BASE_TEAM_POINTS = 1000` 是后端应用常量，不进入数据库。

### 3.2 Slug 由后端生成且不可变

`Team.slug` 和 `Player.slug` 是全局唯一的稳定标识：

- 前端不发送、不修改 slug。
- 后端创建时根据 `name` 生成 kebab-case slug。
- 冲突时追加数字后缀。
- 写入后不随名称修改而改变。

该设计让 URL 和历史引用保持稳定，同时避免前端承担唯一性生成逻辑。

### 3.3 历史记录优先保护

历史 match、stat、award、event result 是统计和积分的审计来源。普通用户流程不应硬删除这些记录。

当前软删除或归档字段：

- `Team.archivedAt`
- `Player.isActive`
- `Event.archivedAt`
- `Event.deletedAt`

硬删除只适用于明确允许的配置数据或开发维护场景。正常业务操作应通过归档、软删除或 inactive 状态表达。

## 4. Model 设计说明

### 4.1 Season

`Season` 用于对 `Event` 进行可选分组。

关键字段：

- `name` 全局唯一。
- `Event.seasonId` 可为空，并在 Season 删除时 `SetNull`。

设计原因：

- MVP 不要求完整赛季管理，但保留赛季维度便于后续按赛季查看赛事和统计。
- Season 不拥有历史赛事数据；删除 Season 不应删除 Event。

### 4.2 Division

`Division` 是球队分区或赛区配置。

关键字段：

- `slug` 全局唯一。
- `sortOrder` 控制展示顺序。
- `Team.divisionId` 删除时 `SetNull`。

设计原因：

- Team Management PRD 中 Division 是只读配置，通过 seed 维护。
- Active Team 在业务上必须拥有有效 Division，但 schema 允许 `divisionId` 为 `null`，用于支持 Division 被删除或数据需要修复的中间状态。

### 4.3 Team

`Team` 是球队主实体。

关键字段：

- `slug`：后端生成的稳定唯一标识。
- `divisionId`：可空外键，业务层要求 active team 必须有效。
- `archivedAt`：球队归档字段。
- `overallRating`：手动维护的整体评分，不参与统计计算。
- `logoUrl`, `primaryColor`, `description`：展示资料。

主要关系：

- 一支 Team 有多个 `Player`。
- 一支 Team 可有一个 `TeamProfileRating`。
- Team 通过 `EventParticipant`, `EventTeamResult`, `MatchTeam`, `MatchPlayerStat`, `MatchTeamOtherStat`, `EventPlayerAward` 参与历史数据。

设计原因：

- Team 是历史统计和奖项的关键上下文，因此普通流程优先归档而不是硬删除。
- `archivedAt` 不清空 `divisionId`，以保留球队原始分区上下文。
- 统计字段不落表，详情页中的 `totalPoints` 和 `teamStats` 由后端运行时计算。

### 4.4 TeamProfileRating

`TeamProfileRating` 保存球队五维主观能力评分。

关键字段：

- `teamId` 唯一，形成 Team 到 ProfileRating 的一对一关系。
- `defense`, `offense`, `consistency`, `cohesion`, `depth` 均为 `Float`。

设计原因：

- 五维评分属于球队资料，不是比赛记录推导出的统计值。
- 独立表避免 `Team` 主表继续膨胀，也允许 Team 没有 profile rating。
- Team 删除时 cascade，因为该评分只依附于 Team 本身，不是独立历史记录。

### 4.5 Player

`Player` 是球队名单成员。

关键字段：

- `slug`：后端生成的全局唯一稳定标识。
- `teamId`：当前所属 Team。
- `number`：球衣号码。
- `position`：枚举 `PG / SG / G / F / SF / PF / C`。
- `isActive`：球员是否仍在 active roster 中。

设计原因：

- MVP 不提供独立 Player CRUD，球员通过 Team 创建和编辑流程嵌套管理。
- 不硬删除有历史统计或奖项的球员，使用 `isActive = false` 表示离队、停用或从当前名单移除。
- `MatchPlayerStat` 和 `EventPlayerAward` 通过 `playerId` 保留历史表现和荣誉。

当前待调整事项：

- 当前 `schema.prisma` 仍包含 `@@unique([teamId, number])`。
- Team Roster Management Backend PRD 已确认目标规则为：号码唯一性只适用于同一 Team 的 active players；inactive players 不占用号码。
- 因 SQLite/Prisma 当前 schema 未表达 partial unique index，该约束应由后端在事务内校验最终 active roster，并将数据库层约束调整为普通索引 `@@index([teamId, number, isActive])`。
- 在完成对应迁移前，当前 schema 会阻止 inactive player 的号码被同队新 active player 复用。

### 4.6 Event

`Event` 表示一次赛事或活动。

关键字段：

- `slug`：赛事稳定标识。
- `seasonId`：可选归属 Season。
- `tier`：赛事等级枚举 `S / A / B / C`。
- `status`：赛事状态枚举 `PREPARING / ONGOING / COMPLETED / ARCHIVED`。
- `rankingOrder`：单调递增的历史排序值。
- `countsForRanking`：是否计入积分。
- `archivedAt`, `deletedAt`：归档与软删除标记。

设计原因：

- Event 是积分结果、比赛和奖项的聚合根。
- `rankingOrder` 为未来 ranking decay 保留稳定历史顺序。创建后不得复用、重排或由前端设置。
- `countsForRanking` 只影响积分，不影响历史 box score 统计是否可展示。

### 4.7 EventStageTag

`EventStageTag` 是 Event 内部的阶段标签，例如小组赛、半决赛、决赛。

关键字段：

- `(eventId, slug)` 唯一。
- `sortOrder` 控制展示顺序。
- `Match.stageTagId` 删除时 `SetNull`。

设计原因：

- 阶段标签只在所属 Event 内有意义，因此 slug 是 event-scoped。
- 删除或调整阶段标签不应删除历史 Match。

### 4.8 EventResultTag

`EventResultTag` 是 Event 内部的结果标签和积分配置。

关键字段：

- `(eventId, slug)` 唯一。
- `isWinnerTag` 标识该结果是否为冠军/胜者类标签。
- `rankingPoints` 定义该 Event 下该结果带来的积分。
- `sortOrder` 控制展示顺序。

设计原因：

- 不同 Event 的冠军、亚军或其他结果可以有不同积分，所以 result tag 归属于 Event。
- `EventTeamResult` 通过 `resultTagId` 引用该配置，保证历史积分可回溯。
- 已被结果引用的 result tag 应限制删除，避免破坏历史积分来源。

### 4.9 EventParticipant

`EventParticipant` 记录 Team 是否参加某个 Event。

关键字段：

- `(eventId, teamId)` 唯一。
- Event 删除时 cascade。
- Team 删除时 restrict。

设计原因：

- 参与记录是 Event 内部名单，不等同于比赛出场或最终排名。
- Team 被历史 Event 引用后不应硬删除。

### 4.10 EventTeamResult

`EventTeamResult` 记录 Team 在 Event 中的最终结果。

关键字段：

- `(eventId, teamId)` 唯一，表示一个 Team 在一个 Event 中只有一个最终结果。
- `resultTagId` 指向 Event 内的结果标签。
- `rank` 可选，用于记录名次。
- `notes` 可选。

设计原因：

- 这是球队积分的直接来源，通过 `resultTag.rankingPoints` 参与 `totalPoints` 计算。
- `rank` 是原始结果记录的一部分，可以保存；但排行榜位置、总积分排名仍运行时计算。
- Team 和 ResultTag 删除均 restrict，以保护历史积分来源。

### 4.11 EventPlayerAward

`EventPlayerAward` 记录 Event 级别球员荣誉。

关键字段：

- `awardType` 枚举：`EVENT_MVP`, `ALL_EVENT_FIRST_TEAM`, `ALL_EVENT_SECOND_TEAM`。
- `(eventId, playerId, awardType)` 唯一，避免同一球员在同一 Event 重复获得同类奖项。
- 同时保存 `playerId` 和 `teamId`。

设计原因：

- 奖项是历史记录，不应因 Team、Player 后续变化而丢失。
- `teamId` 保存获奖时的球队上下文，避免只依赖 Player 当前 team 造成历史解释歧义。
- 每类奖项的人数上限属于业务校验，不由当前数据库唯一约束完全表达。

### 4.12 Match

`Match` 表示 Event 内一场具体比赛。

关键字段：

- `eventId` 必填。
- `stageTagId` 可选。
- `playedAt` 记录比赛时间。

设计原因：

- Match 归属于 Event；Event 硬删除时可以 cascade，但普通流程应通过 Event 归档/软删除保留 Match。
- 阶段标签可为空，支持未分阶段或阶段标签被删除后的历史记录保留。

### 4.13 MatchTeam

`MatchTeam` 记录一场 Match 中的参赛球队和主客队角色。

关键字段：

- `(matchId, role)` 唯一，确保一场比赛只有一个 HOME 和一个 AWAY。
- `(matchId, teamId)` 唯一，确保同一 Team 不会在同一 Match 重复出现。

设计原因：

- 该表表达比赛参赛关系，不直接保存比分或统计。
- Team 删除 restrict，保护历史比赛上下文。

### 4.14 MatchPlayerStat

`MatchPlayerStat` 保存单场比赛中某位球员的 box score。

关键字段：

- `(matchId, playerId)` 唯一。
- 同时保存 `playerId` 和 `teamId`。
- 统计字段默认为 0。
- `rating` 可为空。

设计原因：

- 球员场均统计由这些原始单场记录计算。
- `teamId` 保存该场比赛中的球队上下文，避免未来球员归属变化影响历史统计解释。
- `rating` 可为空，表示该场未录入或不适用；计算平均 rating 时应排除 null。

### 4.15 MatchTeamOtherStat

`MatchTeamOtherStat` 保存单场比赛中的球队级统计。

关键字段：

- `(matchId, teamId)` 唯一。
- 保存球队 points、rebounds、assists、field goals、three pointers 等统计。

设计原因：

- Team 详情页的 teamStats 基于该表计算。
- 该表不要求由球员统计自动汇总，允许手动录入球队级 box score 或保存无法从球员明细完整推导的数据。
- 缺少该记录的比赛不计入 Team 场均统计分母。

## 5. 删除与归档策略

| Model | 当前策略 |
| --- | --- |
| `Season` | 删除时 Event `seasonId` 置空。 |
| `Division` | 删除时 Team `divisionId` 置空，但 active Team 业务上仍需有效 Division。 |
| `Team` | 普通流程归档，设置 `archivedAt`。已有历史引用时不硬删除。 |
| `TeamProfileRating` | Team 硬删除时 cascade。业务上可通过 Team 更新流程清空。 |
| `Player` | 普通流程设置 `isActive = false`。已有历史 stat/award 时不硬删除。 |
| `Event` | 普通流程归档或软删除，保留 `rankingOrder`。 |
| `EventStageTag` | 删除时 Match `stageTagId` 置空。 |
| `EventResultTag` | 已被 `EventTeamResult` 引用时限制删除。 |
| `EventParticipant` | Event 硬删除时 cascade，Team 删除 restrict。 |
| `EventTeamResult` | Event 硬删除时 cascade，Team/ResultTag 删除 restrict。 |
| `EventPlayerAward` | Event 硬删除时 cascade，Player/Team 删除 restrict。 |
| `Match` | Event 硬删除时 cascade；普通流程保留。 |
| `MatchTeam` | Match 硬删除时 cascade，Team 删除 restrict。 |
| `MatchPlayerStat` | Match 硬删除时 cascade，Player/Team 删除 restrict。 |
| `MatchTeamOtherStat` | Match 硬删除时 cascade，Team 删除 restrict。 |

## 6. 运行时计算来源

### 6.1 Team totalPoints

来源：

- `EventTeamResult`
- `EventResultTag.rankingPoints`
- `Event.status`
- `Event.countsForRanking`
- `Event.archivedAt`
- `Event.deletedAt`

不来源于：

- `Team.overallRating`
- `TeamProfileRating`
- `MatchPlayerStat`
- `MatchTeamOtherStat`

### 6.2 Team teamStats

来源：

- `MatchTeamOtherStat`
- 关联的 `Match`
- 关联的 `Event`

Team Management PRD 已确认：

- 只统计 `Event.status = COMPLETED` 的 Match。
- 排除 `Event.deletedAt != null` 或 `Event.archivedAt != null` 的 Match。
- `Event.countsForRanking` 不影响历史比赛统计。
- 无记录或分母为 0 时返回数字 `0`。
- 平均值由 API 层四舍五入到 1 位小数。

### 6.3 Player stats

来源：

- `MatchPlayerStat`
- 关联的 `Match`
- 关联的 `Event`

Team 详情页 MVP 行为：

- `players` 只返回 `isActive = true` 的球员。
- `gamesPlayed` 为该 Player 的 `MatchPlayerStat` 记录数。
- `avgRating` 排除 `rating = null` 的记录；全部为空或无记录时返回 `0`。

## 7. 当前已知设计追踪项

### 7.1 Player number 唯一性

状态：Team Roster Management Backend PRD 已确认，schema 尚待迁移。

当前 schema：

```prisma
@@unique([teamId, number])
```

目标设计：

```prisma
@@index([teamId, number, isActive])
```

唯一性规则改由后端在 Team create/edit 事务中校验：

- 同一 Team 的 active players 不得有重复 `number`。
- inactive players 不占用号码。
- 同一请求中停用旧 Player 并把其号码分配给新 active Player 是合法操作。

### 7.2 Active Team division 约束

状态：业务规则已确认，数据库保持可空。

原因：

- `Division` 删除时需要 `Team.divisionId = null` 以保留 Team。
- 业务层禁止 active Team 创建或更新为无 Division。
- `archivedAt = null` 且 `divisionId = null` 的 Team 属于需要修复的数据状态，不应出现在默认 Team 列表中。

### 7.3 Award 与 Match stat 中保存 teamId

状态：当前 schema 已落地。

原因：

- 保存 award/stat 发生时的 Team 上下文。
- 避免未来 Player team 变化后，历史奖项和比赛统计只能通过 Player 当前 Team 解释。
- MVP 尚不实现完整球员转会历史，但该冗余字段为历史解释提供最小保护。

## 8. 后续功能设计检查清单

在新增或调整功能 PRD 时，若涉及 schema，应逐项检查：

- 是否新增了可由已有记录运行时计算的字段；如果是，默认不应落表。
- 是否会破坏 `rankingOrder` 单调递增、不可复用、不可重排的规则。
- 是否需要保护历史 match、stat、award 或 event result；如果需要，优先软删除或 restrict。
- 是否让前端发送或修改 slug；如果是，应改为后端生成。
- 是否引入新的列表排名或榜单；如果是，应说明计算来源，而不是新增持久化排名字段。
- 是否新增跨实体唯一性规则；如果数据库无法准确表达，应明确后端事务校验策略。
- 是否改变 active/inactive 或 archived 的可见性；如果是，应同步 API PRD 和查询过滤规则。

## 9. Source Documents

- `prisma/schema.prisma`
- `docs/prd/TeamRosterManagementBackendPRD.md`
- `docs/DELETION_RULES.md`
- `docs/TEAM_POINTS_RULES.md`
- `docs/TEAM_RANKING_CONFIG.md`
