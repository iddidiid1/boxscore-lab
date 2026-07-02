# Match Management Backend PRD

## 1. 目标

为 Match Management 域提供完整的后端能力，以现有 Event、EventStageTag、EventParticipant、Team 和 Player roster 为基础，支持最终比赛数据的查询、创建、编辑、作废与恢复，并将保存的原始比赛记录作为球员、球队及后续排行榜统计的唯一数据来源。Match 只记录最终比赛结果，不记录比赛各节进程，也不引入任何加时相关字段或判断。

## 2. 范围

### 2.1 In Scope

- 提供 Match 列表与详情查询能力。
- 提供 Match 创建与编辑能力，包括比赛时间、所属 Event、EventStageTag、主客队、球员原始统计和 Team Other Stats。
- Match 最终比分由两队各自的球员 `points` 与 `MatchTeamOtherStat.points` 实时相加计算，不存储独立比分或其他聚合字段。
- Match 最终比分不允许相同；系统仅校验提交的最终比分，不记录或判断比赛是否经历加时。
- 创建 Match 时，两支球队必须不同且均为所选 Event 的 participants；所选 EventStageTag 必须属于该 Event。
- EventStageTag 为可选项；提交时如有选择，必须属于所选 Event。
- 仅允许为 `ONGOING` 或 `COMPLETED` Event 创建和编辑 Match；`PREPARING`、已归档或已删除 Event 不允许创建 Match，已归档或已删除 Event 也不允许编辑或恢复 Match。
- 新建 Match 时，仅允许为参赛 Team 当前 active roster 中实际上场的 Player 创建 `MatchPlayerStat`，不要求为完整 active roster 创建统计记录；是否存在 `MatchPlayerStat` 即代表该 Player 是否出场。
- 已出场 Player 的所有基础统计与 `rating` 均为必填数值并允许默认值 `0`；`rating` 的有效范围为 `0–10`，最多一位小数，不允许 `null`。未出场 Player 不创建 `MatchPlayerStat`，其评分不适用。
- 历史 Match 已引用的 inactive Player 及其统计必须继续可查询，并可在编辑原有 Match 时保留或修改。
- Match 创建后如参赛 Team 被归档，仍允许编辑该历史 Match，但 archived Team 一侧只能保留、修改或移除已有 Player stats，不得新增任何 Player；另一侧未归档 Team 仍按当前 active roster 规则编辑。
- 创建后允许修改比赛时间、EventStageTag 和比赛统计；不允许更换所属 Event 或参赛球队。
- Match 支持作废与恢复；作废记录及其明细保留，但不参与任何球员、球队、排行榜或其他派生统计。V0 的 Match 列表及列表 API 始终排除作废 Match，以及所属 Event 已归档或已软删除的 Match，不提供包含这些记录的筛选参数；详情 API 仍允许按 ID 查询这些历史 Match，以支持直接访问和符合条件时恢复。
- 审计并更新现有基于 `MatchPlayerStat` 或 `MatchTeamOtherStat` 的派生统计查询，使其通过关联 Match 的 `voidedAt = null` 条件排除作废 Match；本期至少包括现有 Team 详情中的 Team 与 Player 平均统计查询。
- 作废 Match 为只读；必须先恢复才能编辑。
- 恢复 Match 时，Event 必须未归档且未删除，两支球队仍须为该 Event 的 participants，已有 EventStageTag 如存在仍须属于该 Event；历史 Match 已引用的 inactive Player 无须重新满足 active roster 限制。
- archived Team 本身不阻止 Match 恢复；恢复不新增或修改统计，只要该 Team 仍是 Event participant 即可。
- Prisma Schema 为 `Match` 增加用于作废状态的可空时间字段，并将 `MatchPlayerStat.rating` 从可空字段调整为默认值为 `0` 的非空字段；不增加任何持久化平均值、总计、比分或其他派生字段。
- 更新 Match 对应的删除规则，使普通管理流程不提供硬删除。
- 所有 Match 及关联明细写入保持事务一致性，并使用项目统一错误响应结构。

### 2.2 Out of Scope

- 比赛各节、逐回合、实时比分或比赛时钟记录。
- 加时过程、加时次数或“是否完成加时”的判断。
- 自动赛程、对阵生成或赛事晋级逻辑。
- 独立存储最终比分、球员平均值、球队平均值、排行榜或其他聚合统计。
- Match 普通硬删除。
- Player 独立 CRUD 或 Team roster 管理规则调整。
- Event、Event participant、EventStageTag 或 Team 的管理功能调整。
- 新增 Standings、Players 排行榜、Player 详情及其他统计页面的 API 实现；但现有 Match 派生统计查询增加 `voidedAt = null` 过滤属于本期数据一致性修正，不在此排除范围内。
- 认证、授权、自动化测试、CI 与部署。

## 3. 业务规则

1. Match 只保存最终原始记录。最终比分、命中率、均值、总计和排行榜均在读取时计算，不增加持久化派生字段。
2. 一个 Match 必须恰好包含一个 `HOME` Team 和一个 `AWAY` Team；两队必须不同，且均为所属 Event 的 participants。创建后 `eventId`、两队及其 role 不可修改。
3. 仅 `status IN (ONGOING, COMPLETED)` 且 `archivedAt = null`、`deletedAt = null` 的 Event 可创建 Match。编辑和恢复同样要求 Event 满足这些条件。
4. `stageTagId` 可为 `null`；非空时对应 `EventStageTag` 必须属于 Match 的 Event。
5. 创建时，每队至少选择一名出场 Player。Player 必须属于对应 Team 且 `isActive = true`；未出场 Player 不创建 `MatchPlayerStat`。
6. 编辑时，可增加当前 active roster Player、修改或移除已有 Player 统计。已被该 Match 引用的 inactive Player 可保留、修改或移除，但不能新增其他 inactive Player。
   - 若 Match 的 Team 当前已归档，该 Team 一侧不得新增任何 Player，只能保留、修改或移除该 Match 已有的 Player 统计。
7. 每个 `MatchPlayerStat` 表示该 Player 已出场。整数统计和 `rating` 均不得为空；允许为 `0`。`rating` 为 `0–10`、最多一位小数。
8. 每队恰好保存一条 `MatchTeamOtherStat`；请求中的 `otherStats` 必须完整提供 points、rebounds、assists、fieldGoalsMade、fieldGoalsAttempted、threePointersMade、threePointersAttempted 七个整数统计，均允许为 `0`。minutes 和 rating 对 Other Stats 始终不适用，不得提交，也不在数据库模型或响应中提供。
9. 最终比分分别为该队全部 `MatchPlayerStat.points` 加 `MatchTeamOtherStat.points`，两队最终比分不得相同。
10. 创建和编辑必须在单个 Prisma transaction 中写入 `Match`、`MatchTeam`、`MatchPlayerStat` 和 `MatchTeamOtherStat`；验证失败或任一写入失败时全部回滚。编辑采用提交后的完整快照替换该 Match 的统计明细。
   - `playerStats` 和 `otherStats` 不接受独立 `teamId`；后端只使用其外层 `teams[n].teamId` 写入 Stat 的 `teamId`。
   - 写入前必须确认外层 Team 是该 Match 的 HOME/AWAY Team，并确认每个 Player 属于对应 Team；不得写入第三支 Team 的 Player 或 Other Stats。
   - 每个 Team payload 恰好包含一个 `otherStats` 对象，后端每队恰好写入一条 `MatchTeamOtherStat`。
   - 保留现有 `MatchTeam`、`MatchPlayerStat`、`MatchTeamOtherStat` 唯一约束作为数据库最终防线。本期不增加 Stat `(matchId, teamId)` 到 `MatchTeam(matchId, teamId)` 的复合外键，关系完整性由唯一 API 写入路径的验证与 transaction 保证。
11. 作废只设置 `Match.voidedAt`，不删除 Match 或明细。作废 Match 不参与任何统计，所有统计查询必须包含 `voidedAt = null`。
12. Match 列表始终包含 `voidedAt = null`、`event.archivedAt = null`、`event.deletedAt = null` 条件，不接受包含作废或不可见 Event 历史 Match 的参数。详情查询仍可按 ID 返回这些 Match；作废 Match 不可编辑，Event 已归档或删除的 Match 也不可编辑或恢复。
13. 恢复前重新校验 Event 可用、两队仍为 participants、StageTag（如有）仍属于 Event。Team 已归档不单独阻止恢复；既有 inactive Player 不重新要求 active；恢复不修改任何统计明细。
14. 普通管理流程不提供 Match 硬删除。Event 被硬删除时仍沿用现有 cascade；Team、Player 被 Match 引用时保持 restrict。
15. 列表按 `playedAt DESC, id DESC` 排序；Team 按 `HOME`、`AWAY` 返回。每队球员统计使用显式 position 权重 `PG → SG → SF → PF → C → G → F`，再按球衣号码升序、姓名升序、Player id 升序稳定排序，不依赖 Prisma enum 声明顺序或字符串字母顺序。若未来出现当前七种取值之外的 position，则排在已知 position 之后，再应用相同兜底排序。所有日期时间以 ISO 8601 UTC 字符串传输；`playedAt` 表示已经发生的比赛，不得晚于服务端收到请求的时间。
16. MVP 不自动判定重复 Match。相同 Event、HOME/AWAY Team 和 `playedAt` 可以存在多条记录；后端不增加重复检查、唯一约束、fingerprint 或 idempotency key。误录的重复记录通过 Void 作废，不硬删除。

## 4. Schema 变更

### 4.1 新增 / 修改字段

| Model | Field / Index | Type | Notes |
|-------|---------------|------|-------|
| `Match` | `voidedAt` | `DateTime?` | `null` 表示有效；非空表示作废时间 |
| `Match` | `@@index([voidedAt])` | Index | 支持列表和统计统一排除作废 Match |
| `MatchPlayerStat` | `rating` | `Float @default(0)` | 由现有 `Float?` 改为非空；有效范围由应用层校验为 `0–10`、最多一位小数 |

不新增比分、命中率、均值、总计或其他派生字段。

### 4.2 迁移说明

- 新增 nullable `Match.voidedAt` 和对应索引，现有 Match 自动保持有效状态。
- 在收紧 `rating` 非空约束前，将历史 `MatchPlayerStat.rating IS NULL` 更新为 `0`，再设置 `NOT NULL DEFAULT 0`。
- 当前项目尚无生产或真实历史 Match 数据，现有数据仅来自可丢弃的开发/playground 环境，因此本次 `null` 到 `0` 的归一化不会改变需要保留的真实历史语义；playground 数据也可按项目隔离数据库流程直接重建。
- 不删除 Match 或统计数据；除历史空评分按已确认规则归一为 `0` 外无数据丢失。
- 同步更新 `docs/DELETION_RULES.md`，明确 Match 的作废、恢复及普通流程禁止硬删除规则。

## 5. API 规范

### 5.1 通用响应对象

Team 摘要：列表和 form-options 可按各自响应示例省略不需要的状态字段；Match 详情中的 Team 摘要必须包含 `archivedAt`，供编辑页识别历史 archived Team。

```json
{ "id": 1, "slug": "falcons", "name": "Falcons", "primaryColor": "#3B82F6" }
```

Player 统计：

```json
{
  "playerId": 10,
  "playerSlug": "alex-lee",
  "playerName": "Alex Lee",
  "playerNumber": 7,
  "position": "PG",
  "isActive": true,
  "points": 18,
  "rebounds": 4,
  "assists": 6,
  "fieldGoalsMade": 7,
  "fieldGoalsAttempted": 14,
  "fieldGoalPercentage": 50,
  "threePointersMade": 3,
  "threePointersAttempted": 7,
  "threePointPercentage": 42.9,
  "minutes": 31,
  "rating": 8.2
}
```

百分比在 attempts 为 `0` 时返回 `null`，否则返回四舍五入到一位小数的百分数；不读取持久化百分比。

### 5.2 GET /api/matches

- **Query**: `page`（默认 `1`）、`pageSize`（默认 `10`，最大 `50`）、可选 `eventId`、`teamId`、`stageTagId`。
- 所有 query id 必须为正整数；`stageTagId` 提供时必须同时提供 `eventId`，且属于该 Event。
- 始终要求 `voidedAt = null`、`event.archivedAt = null`、`event.deletedAt = null`，不提供查询作废 Match 或 archived/deleted Event 历史 Match 的参数。显式传入存在但已归档/删除的 `eventId` 时返回成功空结果，不将历史 Event 状态伪装为资源不存在。
- **Response (200)**:

```json
{
  "items": [
    {
      "id": 21,
      "playedAt": "2026-06-30T09:00:00.000Z",
      "event": { "id": 3, "slug": "winter-cup", "name": "Winter Cup" },
      "stageTag": { "id": 8, "slug": "final", "label": "Final" },
      "homeTeam": { "id": 1, "slug": "falcons", "name": "Falcons", "primaryColor": "#3B82F6", "score": 87 },
      "awayTeam": { "id": 2, "slug": "kings", "name": "Kings", "primaryColor": null, "score": 82 }
    }
  ],
  "pagination": { "page": 1, "pageSize": 10, "totalItems": 1, "totalPages": 1 },
  "filterOptions": {
    "events": [{ "id": 3, "name": "Winter Cup" }],
    "teams": [{ "id": 1, "name": "Falcons" }],
    "stageTags": [{ "id": 8, "eventId": 3, "label": "Final" }]
  }
}
```

`filterOptions` 从未作废且所属 Event 未归档/删除的 Match 关联记录生成，不受当前分页影响，并采用 Event 单向联动：

- `events` 始终来自全部可见 Match，不受当前 event/team/stage 筛选影响。
- 未提供 `eventId` 时，`teams` 返回全部可见 Match 中出现过的 Team，`stageTags` 返回空数组。
- 提供 `eventId` 时，`teams` 仅返回该 Event 的可见 Match 中出现过的 Team，`stageTags` 仅返回该 Event 的可见 Match 中出现过的 StageTag。
- `teamId` 和 `stageTagId` 不反向缩小 `events` 或其他 filter options；它们只参与 `items` 查询。

### 5.3 GET /api/matches/form-options

- **Query**: 可选 `eventId`。用于创建/编辑表单，不复用 Event award candidate 语义。
- **Response (200)**:

```json
{
  "events": [{ "id": 3, "name": "Winter Cup", "status": "ONGOING" }],
  "selectedEvent": {
    "id": 3,
    "name": "Winter Cup",
    "status": "ONGOING",
    "stageTags": [{ "id": 8, "label": "Final", "sortOrder": 2 }],
    "teams": [
      {
        "id": 1,
        "slug": "falcons",
        "name": "Falcons",
        "primaryColor": "#3B82F6",
        "players": [{ "id": 10, "slug": "alex-lee", "name": "Alex Lee", "number": 7, "position": "PG" }]
      }
    ]
  }
}
```

`events` 仅含可创建 Match 的 Event。未提供 `eventId` 时 `selectedEvent` 为 `null`；提供时该 Event 必须可用。Teams 仅含未归档 participants，players 仅含当前 active roster。

### 5.4 GET /api/matches/:id

- `id` 为正整数。可查询有效或作废 Match。
- **Response (200)**:

```json
{
  "id": 21,
  "playedAt": "2026-06-30T09:00:00.000Z",
  "voidedAt": null,
  "event": { "id": 3, "slug": "winter-cup", "name": "Winter Cup", "status": "ONGOING", "archivedAt": null, "deletedAt": null },
  "stageTag": { "id": 8, "slug": "final", "label": "Final" },
  "teams": [
    {
      "role": "HOME",
      "team": { "id": 1, "slug": "falcons", "name": "Falcons", "primaryColor": "#3B82F6", "archivedAt": null },
      "score": 87,
      "playerStats": [],
      "otherStats": { "points": 2, "rebounds": 1, "assists": 0, "fieldGoalsMade": 1, "fieldGoalsAttempted": 1, "fieldGoalPercentage": 100, "threePointersMade": 0, "threePointersAttempted": 0, "threePointPercentage": null }
    }
  ],
  "createdAt": "2026-06-30T10:00:00.000Z",
  "updatedAt": "2026-06-30T10:00:00.000Z"
}
```

`teams` 始终按 `HOME`、`AWAY` 返回且恰好两项。`playerStats` 使用 §5.1 结构。作废 Match 原样返回并由 `voidedAt` 标识。

### 5.5 POST /api/matches

- **Request body**:

```json
{
  "eventId": 3,
  "stageTagId": 8,
  "playedAt": "2026-06-30T09:00:00.000Z",
  "teams": [
    {
      "role": "HOME",
      "teamId": 1,
      "playerStats": [{ "playerId": 10, "points": 18, "rebounds": 4, "assists": 6, "fieldGoalsMade": 7, "fieldGoalsAttempted": 14, "threePointersMade": 3, "threePointersAttempted": 7, "minutes": 31, "rating": 8.2 }],
      "otherStats": { "points": 2, "rebounds": 1, "assists": 0, "fieldGoalsMade": 1, "fieldGoalsAttempted": 1, "threePointersMade": 0, "threePointersAttempted": 0 }
    },
    {
      "role": "AWAY",
      "teamId": 2,
      "playerStats": [{ "playerId": 20, "points": 15, "rebounds": 3, "assists": 5, "fieldGoalsMade": 6, "fieldGoalsAttempted": 12, "threePointersMade": 2, "threePointersAttempted": 5, "minutes": 29, "rating": 7.5 }],
      "otherStats": { "points": 0, "rebounds": 0, "assists": 0, "fieldGoalsMade": 0, "fieldGoalsAttempted": 0, "threePointersMade": 0, "threePointersAttempted": 0 }
    }
  ]
}
```

- `stageTagId` 可显式为 `null`。`teams` 是完整快照，必须恰好包含 HOME、AWAY 各一项。
- **Response (201)**: 完整 Match 详情，结构同 §5.4。
- **Errors**: §7 endpoint matrix。

### 5.6 PATCH /api/matches/:id

- 不接受 `eventId`。两项 `teamId` 和 role 必须与既有 Match 完全一致，不能借 PATCH 更换球队或主客角色。
- Request body 使用 §5.5 的 `playedAt`、`stageTagId`、`teams`，且三项均为必填完整快照；后端事务内替换 playerStats 和 otherStats。
- 作废 Match 返回 `MATCH_VOIDED`，不得编辑。
- MVP 并发策略为 last-write-wins：请求不发送 `updatedAt`、version 或 ETag，后端不执行乐观锁检查；多个合法 PATCH 依提交完成顺序覆盖，后完成的完整快照为最终状态。每次 PATCH 仍必须在单个 transaction 中原子替换全部明细，并返回写入后的最新完整详情。
- **Response (200)**: 完整 Match 详情，结构同 §5.4。
- **Errors**: §7 endpoint matrix。

### 5.7 POST /api/matches/:id/void

- 无 request body。设置 `voidedAt = now()`，保留所有明细。
- **Response (200)**: `{ "id": 21, "voidedAt": "2026-06-30T11:00:00.000Z" }`
- 已作废 Match 返回 `MATCH_ALREADY_VOIDED`。

### 5.8 POST /api/matches/:id/restore

- 无 request body。通过 §3.13 校验后设置 `voidedAt = null`，不修改明细。
- **Response (200)**: 完整 Match 详情，结构同 §5.4。
- 未作废 Match 返回 `MATCH_NOT_VOIDED`。
- 恢复条件不满足时返回 `MATCH_RESTORE_NOT_ALLOWED`，并使用统一 `{ field, message }` details：Event 状态/归档/删除问题定位为 `event`；HOME/AWAY Team 不再是 participant 分别定位为其详情顺序对应的 `teams[0].teamId` / `teams[1].teamId`；StageTag 归属问题定位为 `stageTagId`。同一请求中的多个恢复障碍全部收集。Team 仅处于 archived 状态不是恢复障碍，不返回对应 detail。

## 6. 验证规则

### 6.1 请求结构

1. 所有请求拒绝未声明字段；所有结构和字段错误一次收集到 `details`，不得首错即返回。
2. URL/query/body 中的 id 必须为正整数。`playedAt` 必须是可解析、明确带时区的 ISO 8601 日期时间，且不得晚于服务端收到该请求的时间；未来时间返回 `400 VALIDATION_ERROR`，field 为 `playedAt`。不接受缺少时区的日期时间字符串。
3. Create/Patch 的 `teams` 必须恰好两项，role 只能为 `HOME`、`AWAY` 且不得重复，teamId 不得重复。
4. 每队 `playerStats` 必须为非空数组，`playerId` 在整个 Match 内不得重复；`otherStats` 必须存在并完整包含 §3.8 的七个整数统计，缺少任一字段均返回 `VALIDATION_ERROR`。

### 6.2 数值统计

1. `points`、`rebounds`、`assists`、`fieldGoalsMade`、`fieldGoalsAttempted`、`threePointersMade`、`threePointersAttempted`、`minutes` 必须为 `0–10000` 的整数。
2. Player `rating` 必须为 `0–10` 的有限数值，且乘以 10 后为整数；不得为 `null`。Other Stats 不接受 `rating` 或 `minutes`。
3. 对 Player 和 Other 分别校验 `fieldGoalsMade <= fieldGoalsAttempted`、`threePointersMade <= threePointersAttempted`、`threePointersMade <= fieldGoalsMade`、`threePointersAttempted <= fieldGoalsAttempted`。
4. 两队按 points 求和后的最终比分必须不同。

### 6.3 关联与状态

1. Event、Team、StageTag、Player 和 Match 必须存在；避免用笼统 validation error 隐藏资源不存在。
2. `GET /api/matches/form-options`、Create、Patch 和 Restore 使用的 Event 必须为 ONGOING/COMPLETED 且未归档、未删除；创建所选 Team 还必须未归档。编辑时既有 archived Team 不导致整个 Match 不可编辑，但该 Team 一侧适用 §3.6 的禁止新增 Player 规则。列表按 §5.2 直接排除 archived/deleted Event 下的 Match；详情查询不受 Event 当前状态限制。
3. 两队必须为 Event participants；StageTag 非空时必须属于 Event。
4. 创建时 Player 必须属于 payload 外层对应 Team 且 active。编辑时，未归档 Team 一侧新增 Player 也必须满足该条件；既有统计中的 inactive Player 可继续提交。archived Team 一侧不得提交原 Match 中不存在的 playerId，不论该 Player 当前是否 active。后端从外层 Team 注入 Stat 的 `teamId`，不得信任或接受 Stat 内的独立 Team 关联字段。
5. PATCH 的 event、teams、roles 不可变；作废 Match 不可 PATCH。
6. restore 重新执行 Event、participants 和 StageTag 校验，但不因既有 Player inactive 而失败。

## 7. 错误码

标准结构：`{ "statusCode": 422, "error": "CODE", "message": "...", "details": [] }`。

字段级错误的 `details` 元素统一使用 `{ "field": string, "message": string }`。`field` 是供前端定位输入控件的请求 payload 路径，不是数据库字段名，规则如下：

- 顶层字段使用 `playedAt`、`eventId`、`stageTagId`、`teams`。
- Team 字段使用 `teams[n].teamId`、`teams[n].role` 或 Team 级路径 `teams[n]`。
- Player 字段使用 `teams[n].playerStats[m].<field>`；整行错误使用 `teams[n].playerStats[m]`。
- Other Stats 字段使用 `teams[n].otherStats.<field>`。
- 无法定位到单个输入项的 Match 整体错误使用 `form`，例如最终比分相同。
- `n`、`m` 必须对应原始请求数组索引；后端不得在排序、过滤或转换后使用变化后的索引生成错误路径。
- 同一阶段收集的错误按请求字段和数组顺序稳定返回。

示例：

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "Request validation failed.",
  "details": [
    { "field": "teams[0].playerStats[2].rating", "message": "rating must be between 0 and 10" },
    { "field": "teams[1].otherStats.points", "message": "points must be an integer from 0 to 10000" }
  ]
}
```

错误检查使用以下固定阶段；只有当前阶段通过后才进入下一阶段：

1. 请求结构：未知字段、缺失字段、类型、范围、数组结构及可仅依据 payload 判断的统计关系。返回 `400 VALIDATION_ERROR`，并收集该阶段全部字段错误。
2. URL 目标 Match：详情、编辑、作废、恢复接口先确认 Match 存在，否则返回 `404 MATCH_NOT_FOUND`。
3. Match 自身状态与不可变字段：包括 `MATCH_VOIDED`、`MATCH_ALREADY_VOIDED`、`MATCH_NOT_VOIDED`、`MATCH_TEAM_IMMUTABLE`。
4. 关联资源存在性：按 Event → StageTag → Team（payload 顺序）→ Player（payload 顺序）检查。不同资源错误不能共用一个顶层 error code，因此返回该固定顺序中最先出现的错误。
5. 业务状态与归属：按 Event 可用性 → Team archived（仅创建）→ Event participant → StageTag/Event 归属 → Player/Team 归属 → Player active 或是否允许新增的顺序检查，返回最先出现的错误。
6. Match 整体业务规则：包括计算后的最终比分不得相同。

`POST /api/matches/:id/restore` 是明确例外：Match 存在性与作废状态通过后，按 §5.8 一次收集全部恢复障碍。未预期的数据库或 Prisma 错误不得暴露内部信息，统一返回 `500` 与通用 message，详细信息仅写入服务端日志。

| Code | HTTP | Condition |
|------|------|-----------|
| `VALIDATION_ERROR` | 400 | 字段缺失、未知字段、类型/范围/数组结构或统计关系非法；`details` 收集所有可定位错误 |
| `MATCH_NOT_FOUND` | 404 | Match id 不存在 |
| `EVENT_NOT_FOUND` | 404 | eventId 不存在 |
| `TEAM_NOT_FOUND` | 404 | teamId 不存在 |
| `STAGE_TAG_NOT_FOUND` | 404 | stageTagId 不存在 |
| `PLAYER_NOT_FOUND` | 404 | playerId 不存在 |
| `EVENT_NOT_AVAILABLE_FOR_MATCH` | 422 | Event 为 PREPARING、已归档或已删除 |
| `TEAM_NOT_EVENT_PARTICIPANT` | 422 | Team 不是 Event participant |
| `TEAM_ARCHIVED` | 422 | 创建 Match 时 participant Team 已归档，或编辑 archived Team 一侧时尝试新增 Player |
| `STAGE_TAG_EVENT_MISMATCH` | 422 | StageTag 不属于 Match Event |
| `PLAYER_TEAM_MISMATCH` | 422 | Player 不属于 payload 对应 Team |
| `PLAYER_INACTIVE` | 422 | 创建或编辑时新增 inactive Player |
| `MATCH_TEAM_IMMUTABLE` | 422 | PATCH 尝试更换 Team 或 role |
| `MATCH_SCORE_TIED` | 422 | 两队计算后的最终比分相同；`details` 使用 `{ "field": "form", ... }` |
| `MATCH_VOIDED` | 422 | 尝试编辑作废 Match |
| `MATCH_ALREADY_VOIDED` | 422 | 重复作废 |
| `MATCH_NOT_VOIDED` | 422 | 恢复未作废 Match |
| `MATCH_RESTORE_NOT_ALLOWED` | 422 | 恢复时 Event、participants 或 StageTag 已不满足规则；`details` 按 §5.8 使用 `event`、`teams[n].teamId`、`stageTagId` 指明全部原因 |

| Endpoint | Errors |
|----------|--------|
| `GET /api/matches` | `VALIDATION_ERROR`、`EVENT_NOT_FOUND`、`TEAM_NOT_FOUND`、`STAGE_TAG_NOT_FOUND`、`STAGE_TAG_EVENT_MISMATCH` |
| `GET /api/matches/form-options` | `VALIDATION_ERROR`、`EVENT_NOT_FOUND`、`EVENT_NOT_AVAILABLE_FOR_MATCH` |
| `GET /api/matches/:id` | `VALIDATION_ERROR`、`MATCH_NOT_FOUND` |
| `POST /api/matches` | `VALIDATION_ERROR`、所有 Event/Team/StageTag/Player 关联错误、`MATCH_SCORE_TIED` |
| `PATCH /api/matches/:id` | `VALIDATION_ERROR`、`MATCH_NOT_FOUND`、`MATCH_VOIDED`、`MATCH_TEAM_IMMUTABLE`、所有 Event/StageTag/Player 关联错误、`MATCH_SCORE_TIED` |
| `POST /api/matches/:id/void` | `VALIDATION_ERROR`、`MATCH_NOT_FOUND`、`MATCH_ALREADY_VOIDED` |
| `POST /api/matches/:id/restore` | `VALIDATION_ERROR`、`MATCH_NOT_FOUND`、`MATCH_NOT_VOIDED`、`MATCH_RESTORE_NOT_ALLOWED` |
