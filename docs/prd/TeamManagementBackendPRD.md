# Team Management Backend PRD

## 1. 目标

构建后端 Team Management 功能，以支持管理员创建、编辑、查看和管理球队，并保证：
- 所有 Active 球队必须归属于某个 Division。
- Team 总览页按所属 Division 分组展示，并显示 logo、name、overallRating 和计算得出的积分。
- Team 详情页展示球队的 Match 统计内容、球员名单及球员场均数据，并显示 logo、name、division、overallRating、积分、description，以及来自 `TeamProfileRating` 的数据用于雷达图呈现。
- Player 创建与管理仅通过 Team 的创建或编辑页面完成。
- 符合 `docs/DELETION_RULES.md` 中的删除与归档策略。

## 2. 范围

涵盖以下后台功能点：
- Division 关联与校验
- Team CRUD（创建/读取/更新/归档）
- Team 详情统计计算
- Team 下 Player 的嵌套创建与编辑
- Active 状态约束与软删除/归档规则

不包含：
- 复杂排名、奖项、赛程生成等超出 Team 管理的业务。

## 3. 关键业务规则

### 3.1 Active 球队必须归属于 Division

- `Team` 的 `divisionId` 是必须字段，当 `Team` 处于 Active 状态时必须存在有效 Division。
- 后端创建/更新 Team 时，必须校验 `divisionId` 对应的 Division 是否存在。
- 当 `Division` 被删除时，应遵循 `DELETION_RULES`：
  - `Team.divisionId` 使用 `onDelete: SetNull`。
  - 这意味着历史 Team 记录可保留，但业务逻辑应仍然要求在正常创建/编辑流程中提供 Division。

### 3.2 Team 归档与删除

- 对于已经引用过历史比赛、统计、玩家、奖项等数据的 Team，优先采用软删除或归档，而非硬删除。
- `Team` 模型建议支持 `archivedAt` 或类似字段。
- 归档 Team 仍然保留历史数据，不影响历史 Match、Player 或奖项的可追溯性。

### 3.3 Player 管理仅通过 Team 页面

- Player 的新增/修改仅能由 Team 创建/编辑页触发。
- 独立 Player 管理页面不在本功能范围内。
- 这意味着 Team API 需要支持嵌套 Player 数据的保存逻辑。

### 3.4 Player 软删除与状态

- 使用 `Player.isActive` 标识球员是否仍在队内或可见。
- 如果球员已有历史 `MatchPlayerStat` 或奖项，不得硬删除；应采用 `isActive = false`。

## 4. 数据来源与统计计算

### 4.1 Team 详情页统计数据

Team 详情页的统计内容应以数据库 `Match` 中的原始统计数据为 Source of Truth，重点依赖：
- `MatchPlayerStat`（球员比赛统计）
- `MatchTeamOtherStat`（球队比赛其他统计）

统计项的计算原则：
- 先按每场比赛累加或汇总 `Match` 中的原始 stats。
- 再按场次求得平均值，得到”每场平均”数据。
- 不在数据库中预存场均值，避免冗余和历史统计不一致。

示例计算：
- 球队场均得分 = 所有 `MatchTeamOtherStat.score` / 参赛场次
- 球员场均篮板 = 所有 `MatchPlayerStat.rebounds` / 球员参赛场次

### 4.2 Team 积分计算

积分为运行时计算值，**不得**在数据库中存储 `currentPoints`、`manualPoints` 或 `basePoints` 等派生字段。

#### MVP 计算公式

```
totalPoints = BASE_TEAM_POINTS + sum(EventTeamResult.resultTag.rankingPoints)
```

- `BASE_TEAM_POINTS = 1000`，定义于后端常量文件（`apps/backend/src/shared/constants/ranking.ts`），不存入数据库。
- 求和范围仅包含满足以下全部条件的 `EventTeamResult` 记录：
  - 对应 `Event.status = COMPLETED`
  - `Event.countsForRanking = true`
  - `Event.deletedAt = null`
  - `Event.archivedAt = null`（已归档赛事不计入排名，避免歧义）

#### 未来扩展：Ranking Decay（MVP 不启用）

未来版本将引入滑动窗口，仅统计最近 `RANKING_DECAY_WINDOW`（当前配置值为 10）个符合资格的赛事：

```
totalPoints = BASE_TEAM_POINTS + sum(points from latest RANKING_DECAY_WINDOW Events)
```

选取算法：
1. 筛选所有满足资格条件的 Event，按 `Event.rankingOrder DESC` 排序，取前 X 条。
2. 累加这 X 个 Event 对应的各队 `EventTeamResult.resultTag.rankingPoints`。
3. **不得**直接按 `EventTeamResult` 行排序取最新 X 条——必须先确定赛事窗口，再汇总积分。

`RANKING_DECAY_WINDOW` 仅需修改常量文件，无需数据库迁移。

#### rankingOrder 管理规则

- 创建 Event 时，后端自动取 `max(existing rankingOrder) + 1` 赋值。
- 前端不得传入或修改 `rankingOrder`。
- 归档或删除 Event 后，其 `rankingOrder` 不得被复用、重排或重新计算。
- 允许出现序号间隙（例如删除 Event 3 后，下一个 Event 编号为 4）。

### 4.3 Team 详情页应展示的数据分区

- Team 基本信息：logo、name、division、overallRating、积分（`totalPoints`）、description。
- TeamProfileRating 数据：用于雷达图呈现。
- Team 历史 Match 统计摘要（按场均计算）。
- Team 当前有效 Player 列表。
- 每名 Player 的场均统计。

### 4.4 计算边界与过滤

- 仅统计未归档/未删除的 Match 记录，除非业务明确需要历史归档 Match。
- 若球员或球队因归档/软删除而仍保留历史统计，计算应继续包含这些历史记录，以确保统计数据的可追溯性。

## 5. API 设计

### 5.1 Team 列表接口

`GET /api/teams`
- 支持可选查询参数 `includeArchived=true`（默认 `false`，仅返回 Active Team）。
- 后端按 Division 分组后返回，前端无需自行分组。
- `totalPoints` 由后端动态计算（见 4.2 节），不从数据库读取持久字段：
  - MVP 公式：`BASE_TEAM_POINTS + sum(符合资格的 EventResultTag.rankingPoints)`
  - 资格条件：`Event.status = COMPLETED`、`countsForRanking = true`、`deletedAt = null`、`archivedAt = null`

**响应结构：**

```json
{
  "divisions": [
    {
      "divisionId": 1,
      "divisionName": "Division A",
      "divisionSlug": "division-a",
      "divisionSortOrder": 1,
      "teams": [
        {
          "id": 1,
          "slug": "red-eagles",
          "name": "Red Eagles",
          "logoUrl": "https://...",
          "primaryColor": "#FF0000",
          "overallRating": 85.5,
          "totalPoints": 1250,
          "archivedAt": null
        }
      ]
    }
  ]
}
```

- Division 列表按 `divisionSortOrder ASC` 排序。
- 每组内的 Team 列表按 `totalPoints DESC` 排序。
- `slug` 由后端生成（见 §6.6），前端使用 `slug` 进行页面导航，不自行构造或修改。
- 若不存在任何 Active Team 的 Division，该 Division 不出现在响应中。

### 5.2 Team 详情接口

`GET /api/teams/:slug`
- 返回单个 Team 的完整信息。
- Division 信息仅需 `divisionName`（字符串），详情页不需要 Division 的其他字段。
- `totalPoints` 与列表接口使用相同的动态计算逻辑（见 4.2 节）。
- 统计结果由后端动态计算，不从持久层读取派生字段。

**响应结构：**

```json
{
  "id": 1,
  "slug": "red-eagles",
  "name": "Red Eagles",
  "logoUrl": "https://...",
  "primaryColor": "#FF0000",
  "divisionName": "Division A",
  "overallRating": 85.5,
  "totalPoints": 1250,
  "description": "...",
  "archivedAt": null,
  "profileRating": {
    "defense": 80.0,
    "offense": 75.0,
    "consistency": 70.0,
    "cohesion": 85.0,
    "depth": 65.0
  },
  "teamStats": {
    "gamesPlayed": 12,
    "avgPoints": 98.5,
    "avgRebounds": 42.3,
    "avgAssists": 22.1,
    "avgFieldGoalsMade": 36.4,
    "avgFieldGoalsAttempted": 78.2,
    "avgThreePointersMade": 10.5,
    "avgThreePointersAttempted": 28.0
  },
  "players": [
    {
      "id": 5,
      "slug": "james-lee",
      "name": "James Lee",
      "number": 23,
      "position": "SF",
      "isActive": true,
      "stats": {
        "gamesPlayed": 10,
        "avgPoints": 18.5,
        "avgRebounds": 7.2,
        "avgAssists": 3.1,
        "avgFieldGoalsMade": 6.8,
        "avgFieldGoalsAttempted": 14.5,
        "avgThreePointersMade": 2.1,
        "avgThreePointersAttempted": 5.6,
        "avgMinutes": 32.0,
        "avgRating": 85.5
      }
    }
  ]
}
```

- `slug` 由后端生成（见 §6.6），前端使用 `slug` 进行页面导航。
- `teamStats` 基于 `MatchTeamOtherStat` 计算；`players[n].stats` 基于 `MatchPlayerStat` 计算。
- 若 `profileRating` 不存在（未录入），该字段返回 `null`。
- 若球员或球队无历史比赛记录，对应 `stats` 中所有均值字段返回 `0`，`gamesPlayed` 返回 `0`。

### 5.3 创建 Team

`POST /api/teams`
- 接收 Team 必填字段与可选的嵌套 Player 列表。
- 前端**不得**传入 `slug`；后端自动根据 `name` 生成（见 §6.6）。
- 必须校验所有 Team Table 的必须字段。
- 必须校验 `divisionId` 的存在性。
- 嵌套 Player 创建：校验 Player Table 的所有必填字段；后端为每个 Player 自动生成 `slug`。
- 成功时返回 `201` 及新建 Team 记录，响应结构同 §5.2。

### 5.4 更新 Team

`PATCH /api/teams/:slug`
- 仅更新请求体中包含的字段。
- 前端**不得**传入 `slug`；`slug` 在创建后不可修改（见 §6.6）。
- 接收 Team 更新字段与可选的嵌套 `players` 变更。
- 必须校验 `divisionId`（如果包含）以及 Team 必填字段的值。
- 对嵌套 `players` 的处理：
  - 含 `id` 的 Player 对象：更新已有球员；前端**不得**传入球员的 `slug`。
  - 不含 `id` 的 Player 对象：在该 Team 下创建新球员，后端自动生成 `slug`。
  - 包含 `isActive: false` 的 Player 对象：将该球员标记为非活跃。
  - payload 中未包含的已有玩家：保持不变。
- 不支持 MVP 硬删除。
- 如果 Player 关联了历史比赛统计，则不允许硬删除该 Player，仅允许设为非活跃。

### 5.5 归档 Team

`POST /api/teams/:slug/archive`
- 将 Team 标记为归档而不是永久删除。
- 仍保留其历史 Match、Player、统计数据。

## 6. 后端验证规则

### 6.1 Division 校验

- `divisionId` 在创建/更新时必须存在且有效。
- Active Team 必须有 Division，除非该 Team 已归档。
- `Division` 删除后 `Team.divisionId` 可设为 `null`，但仅用于历史数据保留；前端不可通过 Team 创建/编辑流程生成无 Division 的 Active Team。
- `Division` 删除后，受影响 Team 应自动视为 archived 或 requires reassignment，不能继续作为 Active Team 出现在默认列表中。

### 6.2 Team 必填字段

后端应严格校验 `Team` 所有数据库必填字段，至少包括：
- `name`
- `divisionId`
- `isActive` 或等效状态字段

如果数据库中有更多必填字段，则一并要求输入。

### 6.3 Player 必填字段

嵌套 Player 创建/更新时，应要求所有 Player Table 的必填字段，包括：
- `name`
- `position`（枚举值：PG / SG / G / F / SF / PF / C）
- `number`（正整数，同一 Team 内不得重复；数据库层约束为 `@@unique([teamId, number])`）
- `isActive`

> **注意**：当前 Prisma schema 中 `Player.number` 定义为 `Int?`（可空），与业务规则不符。
> 应将其修改为 `Int`（非空），并执行数据库迁移（见 §6.3.1）。

#### 6.3.1 Player.number 的 Schema 修改建议

**问题**：`number Int?` 允许 NULL 值。SQLite 对 nullable 字段的唯一约束行为是将多个 NULL 视为互不相等，导致同一 Team 下可存在多个 `number = NULL` 的球员，绕过 `@@unique([teamId, number])` 的业务意图。

**建议改动**（[prisma/schema.prisma](../../prisma/schema.prisma)）：

```diff
- number    Int?
+ number    Int
```

**迁移注意事项**：
- 执行 `pnpm db:migrate` 前，确认 `dev.db` 中不存在 `number = NULL` 的 Player 行；否则 SQLite 迁移会因 NOT NULL 约束失败。
- 当前 seed 文件不创建 Player 数据，无历史数据风险。
- 若后续测试数据含 NULL number，需先清除或补填后再迁移。

### 6.4 软删除/归档约束

- 禁止硬删除存在历史 Match 统计的 Team。
- 禁止硬删除存在历史 `MatchPlayerStat` 的 Player。
- 若删除发生，应优先设置 `Player.isActive = false` 或 `Team.archivedAt`。

### 6.5 积分计算约束

- 数据库中不得新增任何存储积分的持久字段（`currentPoints`、`manualPoints`、`basePoints` 等）。
- `BASE_TEAM_POINTS` 必须定义在后端常量文件中，不允许写入数据库或由前端传入。
- `Event.rankingOrder` 由后端在创建 Event 时自动赋值（`max(rankingOrder) + 1`），前端不得传入或修改该字段。
- 归档或删除的 Event（`archivedAt != null` 或 `deletedAt != null`）不得计入积分计算。
- 积分计算仅面向 `status = COMPLETED` 且 `countsForRanking = true` 的 Event。

### 6.6 Slug 生成与约束

- `Team.slug` 和 `Player.slug` 均由**后端在创建时自动生成**，前端不得在任何请求体中传入或修改 `slug`。
- 后端收到含 `slug` 字段的请求体时，应忽略该字段（不报错，不使用）。
- **生成规则**：将 `name` 转为 kebab-case（小写、空格和特殊字符替换为连字符），若与已有记录冲突，则在末尾追加数字后缀（如 `red-eagles-2`）；不使用随机字符串。
- **不可变性**：`slug` 一经写入数据库后不再修改，即使 `name` 更新。
- **用途**：`slug` 供前端用于页面路由（如 `/teams/red-eagles`），所有需要标识 Team 或 Player 的 API 响应均必须返回 `slug`。
- `Player.slug` 的生成规则与 `Team.slug` 相同，作用域为全局唯一（不限于同一 Team 内）。

## 7. 错误响应与验证错误设计

### 7.1 统一错误响应结构

所有接口在出错时返回以下 JSON 格式，字段固定，前端可按此结构统一处理：

```json
{
  "statusCode": 422,
  "error": "TEAM_HAS_MATCH_DATA",
  "message": "Cannot delete a team that has match statistics.",
  "details": []
}
```

字段说明：

| 字段 | 类型 | 说明 |
|------|------|------|
| `statusCode` | number | 与 HTTP 状态码一致 |
| `error` | string | 机器可读的错误码（见 7.3 节），用于前端判断错误类型 |
| `message` | string | 人类可读的错误描述 |
| `details` | array | 字段级校验错误列表；非校验类错误传空数组 |

字段级校验错误的 `details` 条目结构：

```json
{
  "details": [
    { "field": "name", "message": "name is required" },
    { "field": "players[1].number", "message": "number must be a positive integer" }
  ]
}
```

嵌套字段使用 `entity[index].field` 格式（例如 `players[1].number`）。

---

### 7.2 HTTP 状态码映射

| 状态码 | 适用场景 |
|--------|---------|
| `400 Bad Request` | 请求体格式非法、类型错误、缺少必填字段 |
| `404 Not Found` | 请求的资源不存在（Team、Player、Division） |
| `409 Conflict` | 唯一性冲突（slug、球衣号码重复等） |
| `422 Unprocessable Entity` | 字段格式合法但违反业务规则（归档约束、硬删除约束等） |
| `500 Internal Server Error` | 未预期的服务端错误 |

---

### 7.3 错误码目录

#### Team 相关

| 错误码 | 状态码 | 触发场景 |
|--------|--------|---------|
| `TEAM_NOT_FOUND` | 404 | URL 中的 `slug` 对应的 Team 不存在 |
| `TEAM_SLUG_CONFLICT` | 409 | `slug` 与已有 Team 重复 |
| `TEAM_ALREADY_ARCHIVED` | 422 | 对已归档 Team 再次执行归档操作 |
| `TEAM_HAS_MATCH_DATA` | 422 | 尝试硬删除存在历史 `MatchPlayerStat` 或 `MatchTeamOtherStat` 的 Team |

#### Division 相关

| 错误码 | 状态码 | 触发场景 |
|--------|--------|---------|
| `DIVISION_NOT_FOUND` | 404 | `divisionId` 对应的 Division 不存在 |
| `ACTIVE_TEAM_REQUIRES_DIVISION` | 422 | 创建/更新 Active Team 时未提供 `divisionId`，或提供了 `null` |

#### Player 相关

| 错误码 | 状态码 | 触发场景 |
|--------|--------|---------|
| `PLAYER_NOT_FOUND` | 404 | 嵌套更新时 `players[n].id` 不存在，或不属于该 Team |
| `PLAYER_NUMBER_CONFLICT` | 409 | 同一 Team 下球衣号码重复（对应 `@@unique([teamId, number])`） |
| `PLAYER_HAS_MATCH_DATA` | 422 | 尝试硬删除存在历史 `MatchPlayerStat` 的 Player |

#### 通用校验

| 错误码 | 状态码 | 触发场景 |
|--------|--------|---------|
| `VALIDATION_ERROR` | 400 | 请求体字段缺失或类型非法；`details` 数组包含逐字段错误 |

---

### 7.4 各接口错误场景速查

| 接口 | 可能返回的错误码 |
|------|----------------|
| `GET /api/teams/:slug` | `TEAM_NOT_FOUND` |
| `POST /api/teams` | `VALIDATION_ERROR`、`DIVISION_NOT_FOUND`、`ACTIVE_TEAM_REQUIRES_DIVISION`、`TEAM_SLUG_CONFLICT`、`PLAYER_NUMBER_CONFLICT` |
| `PATCH /api/teams/:slug` | `TEAM_NOT_FOUND`、`VALIDATION_ERROR`、`DIVISION_NOT_FOUND`、`ACTIVE_TEAM_REQUIRES_DIVISION`、`TEAM_SLUG_CONFLICT`、`PLAYER_NOT_FOUND`、`PLAYER_NUMBER_CONFLICT`、`PLAYER_HAS_MATCH_DATA` |
| `POST /api/teams/:slug/archive` | `TEAM_NOT_FOUND`、`TEAM_ALREADY_ARCHIVED` |

---

### 7.5 设计约束

- 后端**不得**在错误响应中暴露数据库内部细节（表名、原始 Prisma 错误信息、堆栈）。
- 生产环境 `500` 响应的 `message` 统一返回 `"Internal server error"`，详细堆栈仅记录至服务端日志。
- `VALIDATION_ERROR` 的 `details` 必须列出**所有**字段错误，不得在首个错误时即短路返回，以便前端一次性展示完整表单错误。

## 8. 数据一致性与审计

- Team 与 Player 的历史 Match 统计必须保持可追溯，不可通过删除操作破坏计算结果。
- 对于已经产生历史数据的实体，后端应提供归档而非删除的路径。
- 统计计算始终使用原始 Match 数据，避免派生字段失效。

## 9. 示例工作流（含错误路径）

### 9.1 创建 Team

**成功路径：**
1. 前端发送 `POST /api/teams`，带入 Team 必填字段和 `divisionId`。
2. 后端校验 Division 存在；不存在则返回 `404 DIVISION_NOT_FOUND`。
3. 后端校验 Team 必填字段；字段缺失或非法则返回 `400 VALIDATION_ERROR`（`details` 含逐字段错误）。
4. 若包含 Player 嵌套数据，校验所有 Player 必填字段；球衣号码重复则返回 `409 PLAYER_NUMBER_CONFLICT`。
5. 返回 `201` 及新建 Team 记录（含关联 Players）。

### 9.2 编辑 Team

**成功路径：**
1. 前端发送 `PATCH /api/teams/:slug`。
2. Team 不存在则返回 `404 TEAM_NOT_FOUND`。
3. 后端校验 `divisionId`（若含）；不存在则返回 `404 DIVISION_NOT_FOUND`。
4. 字段格式非法则返回 `400 VALIDATION_ERROR`。
5. 嵌套 Player 含未知 `id` 则返回 `404 PLAYER_NOT_FOUND`；球衣号码冲突则返回 `409 PLAYER_NUMBER_CONFLICT`。
6. 若请求尝试硬删除有历史统计的 Player，返回 `422 PLAYER_HAS_MATCH_DATA`。
7. 返回 `200` 及更新后的 Team。

### 9.3 查看 Team 详情

1. 前端请求 `GET /api/teams/:slug`。
2. Team 不存在则返回 `404 TEAM_NOT_FOUND`。
3. 后端读取 Team、Division、Active Player、Match 统计源数据，动态计算 `totalPoints` 与各项场均统计。
4. 返回 `200` 及组合后的详情响应。

### 9.4 归档 Team

1. 前端发送 `POST /api/teams/:slug/archive`。
2. Team 不存在则返回 `404 TEAM_NOT_FOUND`。
3. Team 已归档则返回 `422 TEAM_ALREADY_ARCHIVED`。
4. 设置 `archivedAt`，返回 `200`。

## 10. 风险与注意事项

- 若 `Division` 结构发生变更，必须避免重写历史 Team 的 `divisionId`，应保持历史记录可用。
- 不要在后台存储统计平均值，避免与 `Match` 数据源出现数据不同步。
- 确保 Player 的管理仅限于 Team 创建/编辑逻辑，不引入独立 Player 管理 CRUD，从而降低功能边界风险。

---

> 本 PRD 以 `AGENTS.md` 中的 MVP 目标与 `docs/DELETION_RULES.md` 的数据删除策略为基础，确保 Team Management 后端设计既满足功能需求，又维护历史统计的可追溯性。