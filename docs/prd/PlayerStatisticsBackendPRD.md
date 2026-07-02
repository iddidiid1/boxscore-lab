# Player Statistics Backend PRD

## 1. 目标

为 Player 列表、排行榜与详情页提供只读后端能力，基于已保存的 `Player`、`MatchPlayerStat`、`Match`、`Event` 和 `EventPlayerAward` 原始记录动态计算球员统计、领先者、比赛历史与荣誉信息。统计纳入未归档、未删除的 `ONGOING` 和 `COMPLETED` Event 中未作废的 Match，不纳入 `PREPARING` Event 或其他不可见历史记录；不新增或持久化任何平均值、百分比、排行榜结果或表现条分值。

## 2. 范围

### 2.1 In Scope

- 提供 Player 排行榜列表所需的只读查询能力，包括分页、排序以及按 Event、Team 和 Position 筛选。
- 排行榜仅包含当前 active 且至少拥有一条符合统计范围的 `MatchPlayerStat` 的 Player；不设置最低出场次数门槛。
- 提供 Points、Rebounds、Assists、Field Goal Percentage、Three Point Percentage 和 Rating 等基于原始 Match 记录动态计算的球员统计。
- 提供当前筛选范围内的 Points、Rebounds、Assists 和 Rating 领先者数据。
- 提供按不可变 `Player.slug` 查询 Player 详情的只读能力。
- Player 详情支持 Overall 与指定 Event 统计，并提供符合相同统计资格规则的比赛历史。
- Player 详情提供已保存的 Event Awards；历史 inactive Player 仍可通过详情地址读取。
- Player 详情提供按当前统计范围领先者比例动态计算的 Performance Bars。
- 所有统计只纳入 `voidedAt = null` 的 Match，以及 `status IN (ONGOING, COMPLETED)`、`archivedAt = null`、`deletedAt = null` 的 Event。
- 审计并保证 Player 统计查询不会纳入 voided Match、`PREPARING` Event、已归档 Event 或已删除 Event。
- 复用现有 Prisma 数据模型，不修改 schema，不创建 migration。

### 2.2 Out of Scope

- Player 创建、编辑、停用、恢复、转会或独立 CRUD；Player roster 仍只通过 Team 创建与管理流程维护。
- 为排行榜设置最低出场次数门槛。
- 在排行榜中展示没有符合条件比赛记录的 active Player。
- 在排行榜中展示 inactive Player；inactive Player 仅保留历史详情读取能力。
- 存储平均值、百分比、总计、排行榜名次、领先者或 Performance Bar 分值等派生数据。
- 修改 Match、Event、Team、Player 或 Award 的写入规则和生命周期规则。
- 独立 Standings 页面、独立 Statistics 页面、跨赛季比较或新的 Season 管理能力。
- 认证、授权、自动赛程、实时比赛数据或新的球员评价模型。

## 3. 业务规则

1. 所有统计在请求时从 `MatchPlayerStat` 动态计算，不持久化平均值、百分比、排名、领先者或 Performance Bar 分值。
2. 合格统计记录必须同时满足：`match.voidedAt = null`，且所属 Event 为 `ONGOING` 或 `COMPLETED`、`archivedAt = null`、`deletedAt = null`。Event 是否 `countsForRanking` 不影响球员统计；该字段只控制 Team ranking points。
3. 一条 `MatchPlayerStat` 代表一次出场。`gamesPlayed` 等于符合当前筛选范围的记录数；没有记录的 Player 不进入排行榜。
4. Overall 表示全部合格 Event；指定 `eventId` 时只统计该 Event。不存在的 Event 返回 404。存在但为 `PREPARING`、已归档或已删除的 Event 返回 200，并以 `scope.available = false` 表示该 Event 当前不可用于 Player 统计；响应保留 Player profile 及其他可见 `eventOptions`，但不得返回该 Event 的统计、Performance Bars 基准或比赛历史内容。Awards 使用第 15 条的独立可见性规则：未归档、未删除的 `PREPARING` Event Award 仍可返回，已归档或已删除 Event Award 不返回。
5. Player 排行榜只包含 `Player.isActive = true` 的 Player，并以 `Player.teamId` 表达当前 roster 归属：
    - `teamId` query 按 Player 当前 `Player.teamId` 筛选，排行榜响应中的 `team` 也始终返回 Player 当前 Team，而不是某场比赛时的 Team。
    - 当前 Team 已归档的 Player 不进入排行榜、leaders 或 filter options。
    - 指定 Event 时，Player 当前 Team 还必须是该 Event 的未归档 `EventParticipant`；否则该 Player 不进入该 Event 的排行榜候选集。
    - Player 进入候选集后，其统计仍从当前 Event/Overall 范围内属于该 Player 的全部合格 `MatchPlayerStat` 聚合；MVP 不按历史 Team 拆分同一 Player 的排行榜行。
    - Player 详情仍可按 slug 读取，并显示 Player 与当前 Team 的状态。
6. inactive Player 不进入排行榜和领先者候选，但详情可读取其合格历史统计、比赛记录与 Awards。
7. 所有 per-game 数值为合格记录总和除以 `gamesPlayed`。Points、Rebounds、Assists、Minutes 与 Rating 四舍五入到一位小数。`gamesPlayed = 0` 时不得执行除法，必须返回标准零场统计对象：`gamesPlayed`、Points、Rebounds、Assists、Minutes、Rating 均为数值 `0`，Field Goal Percentage 与 Three Point Percentage 均为 `null`。该规则统一适用于可见 Event 中零出场及 `scope.available = false` 的稳定空结构。
8. `fieldGoalPercentage = sum(fieldGoalsMade) / sum(fieldGoalsAttempted) * 100`；`threePointPercentage` 同理。attempts 总和为 `0` 时返回 `null`，否则四舍五入到一位小数。不得计算“每场命中率的平均值”。
9. 排行榜支持 `points`、`rebounds`、`assists`、`fieldGoalPercentage`、`threePointPercentage`、`rating` 排序。百分比为 `null` 时，无论升序或降序均排在有值记录之后。
10. 排名与排序基于完整筛选结果后再分页。主排序值相同时，依次按 `gamesPlayed DESC`、Player name 升序、Player id 升序稳定排序；`rank` 为当前排序下的顺序名次，不做并列名次。
11. 领先者使用 Event、Team、Position 筛选后的完整候选集。Event 筛选决定统计记录范围；Team 与 Position 进一步筛选候选 Player。因此指定 Event 后，四项领先者均只依据该 Event 内且满足当前 Team、Position 条件的合格统计计算。领先者不受分页、`sortBy` 或 `sortDirection` 影响，并始终按 `points`、`rebounds`、`assists`、`rating` 的固定顺序返回四项：
    - 候选集非空时，每项取对应 per-game 值最高的 Player；即使最高值为 `0`，仍返回该 Player、Team 与数值 `0`。同值时使用第 10 条的兜底顺序。
    - 候选集为空时仍返回四项，每项 `value = 0`、`player = null`、`team = null`，不得伪造领先者身份。
12. `filterOptions` 使用 Event → Team → Position 的单向级联规则；下游筛选不得反向缩小上游 options：
    - Event options 包含全部 `status IN (ONGOING, COMPLETED)`、`archivedAt = null`、`deletedAt = null` 的 Event，不要求 Event 已存在 Match 或合格 Player stat。Team、Position 筛选不影响 Event options。
    - 未指定 Event（Overall）时，Team options 只包含至少有一名排行榜合格 Player 的未归档 Team。
    - 指定 Event 时，Team options 只包含该 Event 的 `EventParticipant` Team，并排除已归档 Team；participant Team 即使暂时没有合格 Player stat 也保留在 options 中。Position 筛选不影响 Team options。
    - Position options 根据当前 Event 与 Team 条件计算，只包含至少有一名排行榜合格 Player 的位置；计算时忽略当前 Position 筛选本身。返回值使用固定 enum 展示顺序 `PG`、`SG`、`G`、`SF`、`PF`、`F`、`C`，并省略当前范围内不存在的值。
    - 此处“排行榜合格 Player”必须满足 `Player.isActive = true`、当前 Team 未归档，并在当前 Event/Overall 统计范围内至少有一条合格 `MatchPlayerStat`；指定 Team 时还必须属于该 Team。
13. Player 详情的 Event options 只包含该 Player 至少出场一次的合格 Event。指定 Event 不在该 Player options 中时：
    - Event 合法可见时，返回 `scope.available = true`、Player 资料、标准零场统计、三项值为 `0` 的 Performance Bars、按第 15 条筛选的 Awards 和空比赛历史，表示该 Player 在可统计 Event 中没有出场。
    - Event 为 `PREPARING`、已归档或已删除时，按第 4 条返回 `scope.available = false`；同样使用稳定的零场统计结构，但该结构只表示统计内容不可用，不得用于确认该 Event 中是否存在历史统计。Awards 仍单独按第 15 条处理。
14. Player 详情比赛历史按 `playedAt DESC, match.id DESC` 排序并服务端分页；每场记录的 `team` 使用该条 `MatchPlayerStat.teamId` 关联的比赛时 Team，不使用 Player 当前 `Player.teamId`。对手通过同一 Match 中另一条 `MatchTeam` 计算。响应返回页面所需的 Match id、Opponent、Date、Event、Points、Rebounds、Assists、FG%、3PT%、Minutes 与 Rating；FG%/3PT% 在请求时由该场 `MatchPlayerStat` 的 made/attempted 原始字段计算，但本接口不额外返回 FGM/FGA、3PM/3PA。正常 Match 写入规则保证恰好两支 Team；若历史或异常数据中无法找到另一支 Team，则保留该历史记录并返回 `opponent = null`，同时在服务端记录包含 Match id 的数据完整性警告，不得因此使整个 Player 详情请求失败。
15. Awards 从 `EventPlayerAward` 读取，并使用独立于统计资格的可见性规则：
    - 只返回所属 Event `archivedAt = null` 且 `deletedAt = null` 的 Award；Event status 不影响 Award 可见性，因此 `PREPARING`、`ONGOING`、`COMPLETED` Event 的已保存 Award 均可返回。
    - Overall 返回上述全部可见 Award。指定 `eventId` 时同步按该 Event 筛选；指定未归档、未删除的 `PREPARING` Event 时，即使 `scope.available = false` 且统计为空，仍返回该 Event 已保存的 Award。
    - 已归档或已删除 Event 的 Award 在 Overall 和指定 Event 响应中均不返回。
    - Awards 不因 Player inactive 或当前 Team archived 而丢失；响应中的 Award `team` 必须使用 `EventPlayerAward.teamId` 保留颁奖时 Team，不使用 Player 当前 `Player.teamId`。
    - 正常 Match Management 流程禁止为 `PREPARING` Event 写入 Match，因此该状态不会产生合格 Player 统计；这不改变 Event Management 当前允许预先保存 Award 的独立行为。若未来 Event Management 禁止 PREPARING Award，本查询规则无需改变。
16. Performance Bars 必须由详情当前统计范围动态计算，不持久化：
    - 分别使用当前 Player 的 per-game Points、Rebounds、Assists 作为分子。
    - 每项分母为相同 Overall/Event 范围内排行榜合格 Player 的对应最高 per-game 值；合格群体必须满足 `Player.isActive = true`、Team 未归档且至少有一次合格出场。
    - `value = round(min(100, playerAverage / eligibleLeaderAverage * 100))`。
    - 分母为 `0` 或当前范围没有排行榜合格 Player 时返回 `0`。
    - inactive Player 或 archived Team 下的 Player 可读取自己的详情与 bars，但不进入分母候选；其结果仍通过 `min(100, ...)` 限制在 `0–100`。
17. 实现应避免逐 Player 查询的 N+1 模式；筛选、聚合、排序和分页由数据库查询与有界后端处理共同完成，不向前端发送全量原始记录。
18. 排行榜与比赛历史使用相同的分页边界规则：
    - `totalPages = max(1, ceil(totalItems / pageSize))`，因此 `totalItems = 0` 时返回 `totalPages = 1`、`page = 1` 和空 `items`。
    - 合法正整数 `page` 超过 `totalPages` 时不返回 validation error；后端将其归一化为最后一页，并在响应 pagination 中返回归一化后的有效 `page`。
    - 分页归一化发生在完整筛选结果的 `totalItems` 确定之后；不得因请求页码越界而改变 filters、leaders 或 filter options。

## 4. Schema 变更

### 4.1 新增 / 修改字段

无。现有 `Player`、`MatchPlayerStat`、`Match`、`Event`、`MatchTeam` 与 `EventPlayerAward` 已满足需求。

### 4.2 迁移说明

不修改 Prisma schema，不创建 migration，不执行数据回填。

## 5. API 规范

### 5.1 通用统计对象

```json
{
  "gamesPlayed": 8,
  "points": 21.5,
  "rebounds": 6.3,
  "assists": 7.1,
  "fieldGoalPercentage": 48.6,
  "threePointPercentage": null,
  "minutes": 30.4,
  "rating": 8.2
}
```

`points`、`rebounds`、`assists`、`minutes`、`rating` 为 per-game 值；命中率按 §3.8 由累计 made/attempted 计算。

零场统计固定返回：

```json
{
  "gamesPlayed": 0,
  "points": 0,
  "rebounds": 0,
  "assists": 0,
  "fieldGoalPercentage": null,
  "threePointPercentage": null,
  "minutes": 0,
  "rating": 0
}
```

普通平均值使用 `0` 表示当前范围没有出场贡献；百分比使用 `null` 表示没有 attempts，二者不得互换。

### 5.2 GET /api/players

- **Query**：`page`（默认 `1`）、`pageSize`（默认 `10`，最大 `50`）、可选正整数 `eventId`、`teamId`，可选 `position`，`sortBy`（默认 `points`）和 `sortDirection`（默认 `desc`）。
- Team、Position 只筛选排行榜候选与 leaders；Event 同时决定统计记录范围。Team 筛选及列表响应使用 Player 当前 `Player.teamId`；不得使用 `MatchPlayerStat.teamId` 把同一 Player 按历史 Team 拆成多行。
- `filterOptions` 按 §3.12 的单向级联规则计算。当前请求中的 Team 或 Position 即使不在返回的 options 中，也不改变其存在性验证规则；资源存在但与当前上游筛选不匹配时返回成功空结果。
- **Response (200)**：

```json
{
  "items": [
    {
      "rank": 1,
      "id": 10,
      "slug": "alex-lee",
      "name": "Alex Lee",
      "number": 7,
      "position": "PG",
      "team": { "id": 1, "slug": "falcons", "name": "Falcons", "primaryColor": "#3B82F6" },
      "stats": { "gamesPlayed": 8, "points": 21.5, "rebounds": 6.3, "assists": 7.1, "fieldGoalPercentage": 48.6, "threePointPercentage": 39.2, "minutes": 30.4, "rating": 8.2 }
    }
  ],
  "leaders": [
    { "stat": "points", "label": "Points Per Game", "value": 21.5, "player": { "id": 10, "slug": "alex-lee", "name": "Alex Lee" }, "team": { "id": 1, "name": "Falcons" } },
    { "stat": "rebounds", "label": "Rebounds Per Game", "value": 9.4, "player": { "id": 12, "slug": "sam-wu", "name": "Sam Wu" }, "team": { "id": 2, "name": "Kings" } },
    { "stat": "assists", "label": "Assists Per Game", "value": 7.1, "player": { "id": 10, "slug": "alex-lee", "name": "Alex Lee" }, "team": { "id": 1, "name": "Falcons" } },
    { "stat": "rating", "label": "Player Rating", "value": 8.7, "player": { "id": 12, "slug": "sam-wu", "name": "Sam Wu" }, "team": { "id": 2, "name": "Kings" } }
  ],
  "pagination": { "page": 1, "pageSize": 10, "totalItems": 1, "totalPages": 1 },
  "filterOptions": {
    "events": [{ "id": 3, "name": "Winter Cup", "status": "ONGOING" }],
    "teams": [{ "id": 1, "name": "Falcons" }],
    "positions": ["PG", "SG"]
  }
}
```

当当前 Event、Team、Position 筛选组合没有候选 Player 时，`items` 为空，但 `leaders` 仍保持固定四项结构，例如：

```json
{
  "leaders": [
    { "stat": "points", "label": "Points Per Game", "value": 0, "player": null, "team": null },
    { "stat": "rebounds", "label": "Rebounds Per Game", "value": 0, "player": null, "team": null },
    { "stat": "assists", "label": "Assists Per Game", "value": 0, "player": null, "team": null },
    { "stat": "rating", "label": "Player Rating", "value": 0, "player": null, "team": null }
  ]
}
```

### 5.3 GET /api/players/:slug

- **Query**：可选正整数 `eventId`、`page`（比赛历史默认 `1`）、`pageSize`（默认 `10`，最大 `50`）。
- Player 本身无论 active/inactive、Team 是否 archived 均可按 slug 查询。
- 响应始终包含 `scope`：Overall 为 `{ "eventId": null, "available": true }`；可见 Event 为对应 id 且 `available = true`；`PREPARING`、已归档或已删除 Event 为对应 id 且 `available = false`。
- **Response (200)**：

```json
{
  "scope": { "eventId": 3, "available": true },
  "player": {
    "id": 10,
    "slug": "alex-lee",
    "name": "Alex Lee",
    "number": 7,
    "position": "PG",
    "isActive": true,
    "team": { "id": 1, "slug": "falcons", "name": "Falcons", "primaryColor": "#3B82F6", "archivedAt": null }
  },
  "stats": { "gamesPlayed": 8, "points": 21.5, "rebounds": 6.3, "assists": 7.1, "fieldGoalPercentage": 48.6, "threePointPercentage": 39.2, "minutes": 30.4, "rating": 8.2 },
  "performanceBars": [
    { "stat": "points", "label": "Points", "value": 86 },
    { "stat": "rebounds", "label": "Rebounds", "value": 68 },
    { "stat": "assists", "label": "Assists", "value": 74 }
  ],
  "eventOptions": [{ "id": 3, "name": "Winter Cup", "status": "ONGOING" }],
  "awards": [{ "id": 5, "awardType": "EVENT_MVP", "notes": null, "event": { "id": 3, "slug": "winter-cup", "name": "Winter Cup" }, "team": { "id": 1, "slug": "falcons", "name": "Falcons" } }],
  "matches": {
    "items": [
      {
        "id": 21,
        "playedAt": "2026-06-30T09:00:00.000Z",
        "event": { "id": 3, "slug": "winter-cup", "name": "Winter Cup" },
        "stageTag": { "id": 8, "slug": "final", "label": "Final" },
        "team": { "id": 1, "slug": "falcons", "name": "Falcons" },
        "opponent": { "id": 2, "slug": "kings", "name": "Kings" },
        "stats": { "points": 24, "rebounds": 5, "assists": 8, "fieldGoalPercentage": 50, "threePointPercentage": 40, "minutes": 32, "rating": 8.7 }
      }
    ],
    "pagination": { "page": 1, "pageSize": 10, "totalItems": 8, "totalPages": 1 }
  }
}
```

`matches.items[].opponent` 为 nullable。仅在历史或异常数据缺少另一条 `MatchTeam` 时返回 `null`；正常应用写入的 Match 必须继续遵守恰好两支 Team 的 Match Management 规则。

顶层 `player.team` 表示 Player 当前 Team；`matches.items[].team` 表示该场 `MatchPlayerStat.teamId` 对应的比赛时 Team；`awards[].team` 表示 `EventPlayerAward.teamId` 对应的颁奖时 Team。三者不得通过 Player 当前 Team 相互覆盖。

`performanceBars` 按 §3.16 的领先者比例公式计算；三项固定按 Points、Rebounds、Assists 顺序返回。

指定的 Event 存在但为 `PREPARING`、已归档或已删除时，统计、Performance Bars 与 Match History 使用以下稳定空结构。示例采用没有可见 Award 的情形；若 Event 为未归档、未删除的 `PREPARING` Event，则 `awards` 仍按 §3.15 返回已保存记录。已归档或已删除 Event 的 `awards` 必须为空：

```json
{
  "scope": { "eventId": 12, "available": false },
  "player": { "id": 10, "slug": "alex-lee", "name": "Alex Lee" },
  "stats": {
    "gamesPlayed": 0,
    "points": 0,
    "rebounds": 0,
    "assists": 0,
    "fieldGoalPercentage": null,
    "threePointPercentage": null,
    "minutes": 0,
    "rating": 0
  },
  "performanceBars": [
    { "stat": "points", "label": "Points", "value": 0 },
    { "stat": "rebounds", "label": "Rebounds", "value": 0 },
    { "stat": "assists", "label": "Assists", "value": 0 }
  ],
  "eventOptions": [],
  "awards": [],
  "matches": {
    "items": [],
    "pagination": { "page": 1, "pageSize": 10, "totalItems": 0, "totalPages": 1 }
  }
}
```

示例中的 `eventOptions: []` 仅表示该 Player 没有其他合格出场 Event；若存在其他合格 Event，仍正常返回。`player` 在实际响应中保持本节正常响应定义的完整结构。不存在的 Event 仍返回 `404 EVENT_NOT_FOUND`。

## 6. 验证规则

1. 只接受文档列出的 query 字段；未知字段返回 `VALIDATION_ERROR`。
2. `page`、`pageSize`、`eventId`、`teamId` 必须为正整数；`pageSize` 不得超过 `50`。
3. `position` 必须为现有 `PlayerPosition` enum；`sortBy` 与 `sortDirection` 必须为 §5.2 支持值。
4. `eventId` 不存在返回 `EVENT_NOT_FOUND`；`teamId` 不存在返回 `TEAM_NOT_FOUND`。存在但当前不可见的 Event/Team 返回成功空列表，不泄露其候选统计。
5. `:slug` 必须非空；不存在时返回 `PLAYER_NOT_FOUND`。
6. 所有统计资格过滤必须在聚合前执行；分页必须在完整筛选、聚合和排序后执行，并按 §3.18 归一化越界页码。

## 7. 错误码

统一结构：`{ "statusCode": number, "error": string, "message": string, "details": [{ "field": string, "message": string }] }`。

| Code | HTTP | Condition |
|---|---:|---|
| `VALIDATION_ERROR` | 400 | Query 字段未知、类型/范围无效或 enum/sort 值无效 |
| `PLAYER_NOT_FOUND` | 404 | slug 不对应任何 Player |
| `EVENT_NOT_FOUND` | 404 | eventId 不存在 |
| `TEAM_NOT_FOUND` | 404 | teamId 不存在 |
| `INTERNAL_SERVER_ERROR` | 500 | 未预期数据库或服务错误；不得泄露内部细节 |
