# Team Roster Management Backend PRD

## 1. 目标

构建 Team Management 域的后端 API，以支持管理员创建、编辑、查看和归档队伍，读取赛区列表，并在队伍详情中展示运行时计算的积分与比赛统计数据。该域涵盖 Division 只读接口、Team 创建/读取/更新/归档、嵌套 Player 管理（含软删除）、以及 TeamProfileRating 的 upsert。所有 Active 队伍必须归属于一个 Division；球员管理仅通过 Team 创建/编辑流程完成；积分与统计数据均为运行时计算，不持久化存储。

## 2. 范围

含 (in scope):
- `GET /api/divisions` — 读取赛区列表（只读，数据由 seed 预设）
- `GET /api/teams` — 按 Division 分组返回队伍列表，含运行时计算的 `totalPoints`
- `GET /api/teams/:slug` — 队伍详情，含 `teamStats`、`players`、`profileRating`
- `POST /api/teams` — 创建队伍（含可选嵌套 `players` 和 `profileRating`）
- `PATCH /api/teams/:slug` — 更新队伍（含嵌套 `players` 变更和 `profileRating` upsert）
- `POST /api/teams/:slug/archive` — 归档队伍（软删除，设 `archivedAt`）
- Player 嵌套创建/更新/软删除（`isActive: false`），仅通过 Team 接口，不提供独立 Player CRUD
- `TeamProfileRating` upsert，作为 Team POST/PATCH 的嵌套字段
- Slug 自动生成（Team 和 Player），后端在创建时生成，前端不传
- 积分运行时计算（`BASE_TEAM_POINTS` + 符合条件的 `EventTeamResult.resultTag.rankingPoints`）

不含 (out of scope):
- Division 的创建/编辑/删除 API（通过 seed 管理）
- 独立的 Player CRUD 接口
- 独立的 `TeamProfileRating` 接口
- Unarchive（取消归档）操作
- Team 或 Player 的物理删除接口
- 认证、登录和角色权限；MVP 为个人单用户应用，所有 API 视为受信任的本地管理操作
- 复杂排名、赛程生成、奖项等超出 Team Management 域的功能

## 3. 业务规则

### 3.1 Active 球队必须归属于 Division

- Team 是否 Active 由 `archivedAt` 决定：`archivedAt = null` 表示 Active，`archivedAt != null` 表示 Archived。
- 创建 Active Team 时，`Team.divisionId` 是必填字段，且必须对应有效的 Division。
- 更新 Active Team 时，`divisionId` 是可选字段：请求体未包含该字段时保留当前 Division；仅在管理员主动更换 Division 时传入新的 `divisionId`。
- 创建或更新请求包含 `divisionId` 时，后端必须校验其对应的 Division 是否存在。
- Active Team 不允许将 `divisionId` 显式更新为 `null`。
- `Division` 被删除后，`Team.divisionId` 通过 `onDelete: SetNull` 自动置 `null`；该 Team 属于需要修复的无 Division 数据状态，不等同于 Archived。
- `archivedAt = null` 但 `divisionId = null` 的 Team 不得出现在 Team 列表中；重新指定有效 Division 后恢复列表可见性。

### 3.2 Team 归档与删除

- 已有历史比赛、统计、球员或奖项关联的 Team，只能归档，不得硬删除。
- 归档通过设置 `Team.archivedAt` 实现；归档后历史数据（Match、Player、奖项）保持可追溯。
- 归档时保留 Team 原有的 `divisionId`，不得清空 Division 关系；是否出现在 Active Team 列表仅由 `archivedAt` 和 Division 有效性决定。
- 对已归档 Team 再次执行归档操作，返回 `422 TEAM_ALREADY_ARCHIVED`。
- Archived Team 的详情接口仍返回 `200`，用于展示历史数据、历史统计和历史积分。
- Archived Team 在 Team Management 域内为只读状态：禁止通过 `PATCH /api/teams/:slug` 修改 Team、Player 或 ProfileRating，返回 `422 TEAM_ARCHIVED`。
- Archived Team 不得被加入新的 Event 或 Match；该约束由 Event/Match 管理域实现，并引用本规则。

### 3.3 Player 管理仅通过 Team 接口

- Player 的新增、编辑、软删除只能通过 `POST /api/teams` 或 `PATCH /api/teams/:slug` 的嵌套 `players` 字段完成。
- 不提供独立的 Player CRUD 路由。

### 3.4 Player 软删除

- 前端"移除"球员 = 从编辑列表消失，提交时在 `players` 数组中发送 `{ id, isActive: false }`。
- 后端收到 `isActive: false` 后将该 Player 标记为非活跃，不做硬删除。
- Player 变为非活跃后，其原球衣号码可以分配给同一 Team 的其他 Active Player；历史比赛数据仍通过 Player ID 区分。
- 若球员已有历史 `MatchPlayerStat`，禁止硬删除，只允许设 `isActive = false`。
- `GET /api/teams/:slug` 的 `players` 数组仅返回 `isActive = true` 的球员。

### 3.5 TeamProfileRating 默认创建与 Upsert

- `profileRating` 作为 Team POST/PATCH 请求体的可选嵌套对象传入。
- `POST /api/teams` 时，若请求体不包含 `profileRating`，后端必须在同一事务内创建默认 TeamProfileRating，五个评分字段默认值均为 `5`。
- `POST /api/teams` 时，若请求体包含 `profileRating` 对象，后端按传入值创建 TeamProfileRating。
- `PATCH /api/teams/:slug` 时，后端对 `TeamProfileRating` 执行 upsert：若记录不存在则 create，已存在则 update。
- `PATCH /api/teams/:slug` 时，若请求体不包含 `profileRating` 字段，则不修改现有记录。
- 若 PATCH 请求体包含 `profileRating` 对象，采用完整替换语义，五个评分字段必须全部提供。
- `profileRating: null` 不允许用于创建、更新或清空 TeamProfileRating，返回 `400 VALIDATION_ERROR`。
- `GET /api/teams/:slug` 的 `profileRating` 字段：正常情况下返回对象；若历史数据或异常数据缺失 TeamProfileRating，则返回 `null` 作为兼容兜底。

### 3.6 Division 只读

- `GET /api/divisions` 仅读取，不提供增删改接口。
- Division 数据通过 seed 脚本预设，后端 API 不负责维护。

### 3.7 Team 嵌套写入事务

- `POST /api/teams` 和 `PATCH /api/teams/:slug` 对 Team、Player 与 TeamProfileRating 的数据库写入必须在同一个事务中完成。
- 请求字段格式校验可在事务开始前完成；依赖数据库状态的 Team、Division、Player 归属及 Active roster 号码冲突校验必须基于一致的数据状态执行。
- Player 号码冲突必须按请求完成后的最终 Active roster 判断，不得因逐条写入顺序产生不同结果。
- 任一校验或写入失败时，整个请求全部回滚，不得保留部分 Team、Player 或 TeamProfileRating 变更。
- 只有事务成功提交后才可返回成功响应；不得将原始 Prisma 事务错误暴露给客户端。

### 3.8 PATCH 字段缺省、`null` 与空字符串语义

- PATCH 请求体缺省某字段时，该字段保持不变。
- Nullable 字段显式传入 `null` 时表示清空；适用于 `logoUrl`、`primaryColor`、`description` 和 `overallRating`。
- `name`、`divisionId`、Player `name`、Player `number`、Player `position`、Player `isActive` 不是可清空字段；显式传入 `null` 返回 `400 VALIDATION_ERROR`，但 Active Team 的 `divisionId: null` 返回 `422 ACTIVE_TEAM_REQUIRES_DIVISION`。
- 可清空字符串字段传入空字符串或仅空白字符串时，后端在验证阶段标准化为 `null`。
- 非可清空字符串字段传入空字符串或仅空白字符串时，返回 `400 VALIDATION_ERROR`。

## 4. Schema 变更

### 4.1 新增 / 修改字段

无需新增字段，但需要调整 Player 球衣号码约束：

| Model | 变更 | 原因 |
|-------|------|------|
| `Player` | 移除 `@@unique([teamId, number])` | 允许非活跃 Player 的号码被新的 Active Player 复用 |
| `Player` | 增加 `@@index([teamId, number, isActive])` | 支持按 Team、号码和活跃状态进行冲突校验 |

其余业务所需字段均已存在：`Team.archivedAt`、`Player.number`、`Player.isActive`、`TeamProfileRating` 全部字段以及 `Division.id / name / slug / sortOrder`。

同一 Team 内的球衣号码唯一性仅适用于 `isActive = true` 的 Player，由后端在事务内根据请求完成后的最终 roster 状态校验。数据库不再对 Active 与 inactive Player 共同施加号码唯一约束。

### 4.2 迁移说明

需要执行数据库迁移：

- 删除 Player 的 `(teamId, number)` 唯一约束。
- 增加 `(teamId, number, isActive)` 普通组合索引。
- 迁移前检查现有 Active Player 数据；若同一 Team 内存在重复号码，迁移应停止并先修复数据。

## 5. API 规范

### 5.1 GET /api/divisions

- **Method + Path**: `GET /api/divisions`
- **描述**: 返回所有 Division，按 `sortOrder ASC, name ASC, id ASC` 排序。供前端表单下拉使用。
- **Request body**: 无
- **Response (200)**:
  ```json
  {
    "divisions": [
      {
        "id": 1,
        "name": "Division A",
        "slug": "division-a",
        "sortOrder": 1
      },
      {
        "id": 2,
        "name": "Division B",
        "slug": "division-b",
        "sortOrder": 2
      }
    ]
  }
  ```
- **Errors**: 无（空列表时返回 `{ "divisions": [] }`）

---

### 5.2 GET /api/teams

- **Method + Path**: `GET /api/teams`
- **描述**: 按 Division 分组返回有效的 Active 队伍列表，含运行时计算的 `totalPoints`。
- **筛选规则**: 仅返回 `archivedAt = null` 且 `divisionId != null` 的 Team；MVP 不提供查询 Archived Team 列表的参数
- **Query params**: 无
- **Request body**: 无
- **Response (200)**:
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
            "logoUrl": "https://example.com/logo.png",
            "primaryColor": "#FF0000",
            "overallRating": 8.5,
            "totalPoints": 1250,
            "archivedAt": null
          }
        ]
      }
    ]
  }
  ```
- **排序规则**:
  - Division 按 `sortOrder ASC, name ASC, id ASC`
  - 每组内 Team 按 `totalPoints DESC, name ASC, id ASC`
  - 无符合筛选条件 Team 的 Division 不出现在响应中
- **Errors**: 无

---

### 5.3 GET /api/teams/:slug

- **Method + Path**: `GET /api/teams/:slug`
- **描述**: 返回单个 Team 的完整详情，含运行时统计与球员列表。
- **归档 Team 行为**: 返回 `200`，`archivedAt` 字段非 null；前端展示归档提示横幅。
- **Request body**: 无
- **Response (200)**:
  ```json
  {
    "id": 1,
    "slug": "red-eagles",
    "name": "Red Eagles",
    "logoUrl": "https://example.com/logo.png",
    "primaryColor": "#FF0000",
    "divisionId": 1,
    "divisionName": "Division A",
    "divisionSlug": "division-a",
    "overallRating": 8.5,
    "totalPoints": 1250,
    "description": "A fast-paced squad...",
    "archivedAt": null,
    "profileRating": {
      "defense": 8.0,
      "offense": 7.5,
      "consistency": 7.0,
      "cohesion": 8.5,
      "depth": 6.5
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
- **说明**:
  - `divisionId` 用于编辑表单和后续更新请求，`divisionName` 用于展示，`divisionSlug` 用于稳定标识与路由场景
  - Team 未归属 Division 时，`divisionId`、`divisionName`、`divisionSlug` 均返回 `null`
  - `players` 仅返回 `isActive = true` 的球员
  - `profileRating` 正常情况下返回对象；仅当历史数据或异常数据缺失 TeamProfileRating 时返回 `null`
  - 无历史比赛记录时，`teamStats` 均值字段返回 `0`，`gamesPlayed` 返回 `0`；`players[n].stats` 同理
  - `teamStats` 基于 `MatchTeamOtherStat` 计算；`players[n].stats` 基于 `MatchPlayerStat` 计算
- **Errors**: `TEAM_NOT_FOUND`

---

### 5.4 POST /api/teams

- **Method + Path**: `POST /api/teams`
- **描述**: 创建新队伍，可选嵌套 Player 列表与 ProfileRating。若缺省 `profileRating`，后端创建默认五项评分均为 `5` 的 TeamProfileRating。成功返回 `201` 及完整 Team 详情（结构同 §5.3）。
- **Request body**:
  ```json
  {
    "name": "Red Eagles",
    "divisionId": 1,
    "logoUrl": "https://example.com/logo.png",
    "primaryColor": "#FF0000",
    "overallRating": 8.5,
    "description": "A fast-paced squad...",
    "profileRating": {
      "defense": 8.0,
      "offense": 7.5,
      "consistency": 7.0,
      "cohesion": 8.5,
      "depth": 6.5
    },
    "players": [
      {
        "name": "James Lee",
        "number": 23,
        "position": "SF",
        "isActive": true
      }
    ]
  }
  ```
- **说明**:
  - `name`、`divisionId` 为必填；其余字段可选
  - `slug` 由后端自动生成，前端不得传入
  - `profileRating` 和 `players` 均为可选；`profileRating` 缺省时后端创建默认五项评分均为 `5` 的 TeamProfileRating，`players` 缺省时跳过创建球员
  - Player 不含 `id`；后端为每个 Player 自动生成 `slug`
  - Team、Players 与 ProfileRating 的创建必须在同一个数据库事务中完成，任一部分失败时全部回滚
- **Response (201)**: 结构同 §5.3
- **Errors**: `VALIDATION_ERROR`、`DIVISION_NOT_FOUND`、`ACTIVE_TEAM_REQUIRES_DIVISION`、`PLAYER_NUMBER_CONFLICT`、`SLUG_CONFLICT`

---

### 5.5 PATCH /api/teams/:slug

- **Method + Path**: `PATCH /api/teams/:slug`
- **描述**: 更新队伍信息。仅更新请求体中包含的字段；`profileRating` 执行 upsert；`players` 数组按下方规则处理。
- **Request body**:
  ```json
  {
    "name": "Red Eagles Updated",
    "divisionId": 1,
    "logoUrl": "https://example.com/logo.png",
    "primaryColor": "#CC0000",
    "overallRating": 9.0,
    "description": "Updated description...",
    "profileRating": {
      "defense": 8.5,
      "offense": 8.0,
      "consistency": 7.5,
      "cohesion": 9.0,
      "depth": 7.0
    },
    "players": [
      {
        "id": 5,
        "name": "James Lee",
        "number": 23,
        "position": "SF",
        "isActive": true
      },
      {
        "id": 6,
        "isActive": false
      },
      {
        "name": "New Player",
        "number": 10,
        "position": "PG",
        "isActive": true
      }
    ]
  }
  ```
- **players 处理规则**:
  - 含 `id`：更新已有球员；`slug` 不可修改
  - 含 `id` + `isActive: false`：标记为非活跃（软删除）
  - 不含 `id`：创建新球员，后端生成 `slug`
  - payload 中未包含的已有球员：保持不变
  - 号码冲突按本次 PATCH 完成后的最终 Active roster 统一校验；同一请求中停用旧 Player 并将其号码分配给新 Player 是合法操作
- **说明**:
  - `slug` 不可修改，前端不得传入
  - `divisionId` 为可选字段；未传入时保留当前 Division，传入有效的新 ID 时更换 Division
  - Active Team 显式传入 `divisionId: null` 时返回 `422 ACTIVE_TEAM_REQUIRES_DIVISION`
  - Archived Team 禁止 PATCH，返回 `422 TEAM_ARCHIVED`
  - 请求体中不包含 `profileRating` 时，不修改现有 ProfileRating 记录
  - 请求体中包含 `profileRating` 对象时，按完整替换处理，五个评分字段均必填
  - 请求体中包含 `profileRating: null` 时，返回 `400 VALIDATION_ERROR`，不允许清空 ProfileRating
  - 请求体中不包含 `players` 时，不修改现有球员
  - Team、Players 与 ProfileRating 的更新必须在同一个数据库事务中完成，任一部分失败时全部回滚
- **Response (200)**: 结构同 §5.3
- **Errors**: `TEAM_NOT_FOUND`、`TEAM_ARCHIVED`、`VALIDATION_ERROR`、`DIVISION_NOT_FOUND`、`ACTIVE_TEAM_REQUIRES_DIVISION`、`PLAYER_NOT_FOUND`、`PLAYER_NUMBER_CONFLICT`、`SLUG_CONFLICT`

---

### 5.6 POST /api/teams/:slug/archive

- **Method + Path**: `POST /api/teams/:slug/archive`
- **描述**: 将 Team 标记为归档（软删除）。保留所有历史 Match、Player、统计数据。
- **归档字段规则**: 仅设置 `archivedAt`；保留现有 `divisionId`，不得清空 Division 关系
- **Request body**: 无
- **Response (200)**:
  ```json
  {
    "id": 1,
    "slug": "red-eagles",
    "archivedAt": "2026-06-20T10:00:00.000Z"
  }
  ```
- **Errors**: `TEAM_NOT_FOUND`、`TEAM_ALREADY_ARCHIVED`

## 6. 验证规则

字段级验证错误必须全量收集后一次性返回，不得在首个字段错误时短路。跨 HTTP 状态码的错误不要求合并，按 §7.2 的阶段顺序返回。

### 6.0 通用请求体验证

- 请求体只能包含本 PRD 声明的字段；未知字段统一返回 `400 VALIDATION_ERROR`。
- `slug` 不得出现在 POST/PATCH 请求体中；若出现，按未知字段处理并返回 `400 VALIDATION_ERROR`。
- 字符串字段先执行 trim；可清空字段的空字符串按 §3.8 标准化为 `null`，不可清空字段的空字符串返回 `400 VALIDATION_ERROR`。
- URL 字段只允许合法的 `http://` 或 `https://` URL。**例外**：`logoUrl` 额外接受站内相对路径（以 `/` 开头，如 `/logos/celtics.png`），详见字段表与 `docs/TEAM_LOGO_ASSETS.md`。
- 字符串长度限制：
  - `Team.name`：trim 后 1–100 字符
  - `Team.description`：最多 2,000 字符
  - `Team.logoUrl`：最多 2,048 字符
  - `Player.name`：trim 后 1–100 字符

### 6.1 Division 校验

- `divisionId` 必须对应数据库中存在的 Division 记录；否则返回 `404 DIVISION_NOT_FOUND`。
- 创建 Active Team 时，`divisionId` 不得缺省或为 `null`；否则返回 `422 ACTIVE_TEAM_REQUIRES_DIVISION`。
- 更新 Active Team 时，未传入 `divisionId` 表示保留当前值；显式传入 `null` 时返回 `422 ACTIVE_TEAM_REQUIRES_DIVISION`。

### 6.2 Team 必填字段

| 字段 | 规则 |
|------|------|
| `name` | 必填，trim 后 1–100 字符 |
| `divisionId` | 若提供，必须为正整数；创建 Active Team 时缺省或为 `null` 按 §6.1 返回 `422 ACTIVE_TEAM_REQUIRES_DIVISION` |
| `logoUrl` | 若提供，必须为合法 HTTP/HTTPS URL **或**站内相对路径（如 `/logos/celtics.png`），最多 2,048 字符；可用 `null` 或空字符串清空。详见 `docs/TEAM_LOGO_ASSETS.md` |
| `primaryColor` | 若提供，必须严格匹配 `^#[0-9A-Fa-f]{6}$`；可用 `null` 或空字符串清空 |
| `overallRating` | 若提供，必须为 `0–10` 范围内的数值 |
| `description` | 若提供，最多 2,000 字符；可用 `null` 或空字符串清空 |

### 6.3 Player 必填字段

嵌套 Player 创建时，以下字段必填：

| 字段 | 规则 |
|------|------|
| `name` | 必填，trim 后 1–100 字符 |
| `number` | 必填，0 至 99 的整数，同一 Team 的 Active Player 内不得重复；inactive Player 不占用号码 |
| `position` | 必填，枚举值：`PG / SG / G / F / SF / PF / C` |
| `isActive` | 必填，布尔值 |

嵌套 Player 更新（含 `id`）时，仅校验请求体中提供的字段；`isActive: false` 可单独发送。若将 Player 设为 `isActive: true`，必须重新校验其号码是否与请求完成后的其他 Active Player 冲突。

### 6.4 ProfileRating 校验

若请求体包含 `profileRating` 对象，采用完整替换语义，以下五个字段均必填：

| 字段 | 规则 |
|------|------|
| `defense` | 必填，`1–10` 范围内的数值 |
| `offense` | 必填，`1–10` 范围内的数值 |
| `consistency` | 必填，`1–10` 范围内的数值 |
| `cohesion` | 必填，`1–10` 范围内的数值 |
| `depth` | 必填，`1–10` 范围内的数值 |

若请求体包含 `profileRating: null`，返回 `400 VALIDATION_ERROR`。MVP 不提供清空 TeamProfileRating 的 API 语义；缺失记录仅视为历史数据或异常数据兜底状态。

### 6.5 软删除 / 归档约束

- 禁止硬删除 Team；只允许通过 `POST /api/teams/:slug/archive` 归档。
- 禁止硬删除 Player；只允许通过 `isActive: false` 软删除。
- PATCH Archived Team 时返回 `422 TEAM_ARCHIVED`。

### 6.6 积分计算约束

- 数据库中不得存储任何积分派生字段（`currentPoints`、`manualPoints`、`basePoints` 等）。
- `BASE_TEAM_POINTS = 1000`，定义于 `apps/backend/src/shared/constants/ranking.ts`，不存入数据库，前端不得传入。
- 积分计算仅面向满足以下全部条件的 `EventTeamResult`：
  - `Event.status = COMPLETED`
  - `Event.countsForRanking = true`
  - `Event.deletedAt = null`
  - `Event.archivedAt = null`

### 6.7 Slug 生成与约束

- `Team.slug` 和 `Player.slug` 均由后端在创建时自动生成。
- 生成前先对 `name` 执行 trim 和 Unicode 标准化，再转 kebab-case。
- 冲突时追加数字后缀，后缀从 `-2` 开始递增（如 `red-eagles-2`）。
- 若名称无法生成有效 slug，使用安全 fallback：`team-{id}` 或 `player-{id}`。fallback 必须仍满足唯一约束。
- 数据库唯一约束是 slug 唯一性的最终保障。
- 并发创建导致 slug 冲突时，后端应在限定次数内重新生成并重试；超过重试次数后返回 `409 SLUG_CONFLICT`，不得暴露原始数据库错误。
- Slug 一经写入不可修改，前端不得在任何请求体中传入或修改 `slug`；后端收到时返回 `400 VALIDATION_ERROR`。
- `Player.slug` 全局唯一（不限于同一 Team 内）。

## 7. 错误码

### 7.1 统一错误响应结构

```json
{
  "statusCode": 422,
  "error": "ERROR_CODE",
  "message": "Human-readable description.",
  "details": []
}
```

字段级校验错误的 `details` 格式：

```json
{
  "details": [
    { "field": "name", "message": "name is required" },
    { "field": "players[1].number", "message": "number must be an integer from 0 to 99" }
  ]
}
```

嵌套字段使用 `entity[index].field` 格式。

`PLAYER_NUMBER_CONFLICT` 返回 `409`，但在能够定位到请求 payload 中具体冲突球员时，仍应返回字段级 `details`，以便前端映射到对应输入项。例如：

```json
{
  "statusCode": 409,
  "error": "PLAYER_NUMBER_CONFLICT",
  "message": "Active player numbers must be unique within a team.",
  "details": [
    {
      "field": "players[2].number",
      "message": "number conflicts with another active player"
    }
  ]
}
```

若冲突只能定位到数据库中既有 Active Player，无法可靠映射到请求 payload 的具体 index，则允许返回 `details: []`，由前端显示 roster 级错误。

### 7.2 HTTP 状态码映射

| 状态码 | 适用场景 |
|--------|---------|
| `400 Bad Request` | 请求体格式非法、类型错误、缺少必填字段 |
| `404 Not Found` | 请求的资源不存在（Team、Division） |
| `409 Conflict` | 唯一性冲突（球衣号码重复、slug 并发冲突等） |
| `422 Unprocessable Entity` | 字段合法但违反业务规则（归档约束等） |
| `500 Internal Server Error` | 未预期的服务端错误 |

错误检查按以下阶段执行：

1. 请求结构、未知字段、类型、必填字段、字段长度和字段范围校验；返回 `400 VALIDATION_ERROR`，并全量收集该阶段字段错误。`divisionId` 缺省或为 `null` 属于 Active Team 业务规则，不在此阶段返回。
2. URL 中的 Team slug 存在性校验；不存在时返回 `404 TEAM_NOT_FOUND`。
3. PATCH 请求中，若 URL Team 已归档，返回 `422 TEAM_ARCHIVED`，不再继续执行 Division、Player、号码冲突或写入校验。
4. Active Team 的 `divisionId` 缺省或为 `null` 时，返回 `422 ACTIVE_TEAM_REQUIRES_DIVISION`。创建 Team 没有 URL Team，因此该阶段紧随字段校验之后执行；PATCH 请求仅在 Team 未归档后执行该阶段。
5. Division、Player 存在性及归属校验；返回对应 404。若同阶段存在多个资源错误，优先级为 Division、嵌套 Player。
6. 唯一性冲突校验；返回 409。
7. 其他业务状态约束校验；返回 422。
8. 跨阶段错误不合并，只返回最早失败阶段的错误。

### 7.3 错误码目录

#### Team 相关

| 错误码 | 状态码 | 触发场景 |
|--------|--------|---------|
| `TEAM_NOT_FOUND` | 404 | URL 中的 `slug` 对应的 Team 不存在 |
| `TEAM_ARCHIVED` | 422 | 尝试 PATCH 已归档 Team |
| `TEAM_ALREADY_ARCHIVED` | 422 | 对已归档 Team 再次执行归档操作 |

#### Division 相关

| 错误码 | 状态码 | 触发场景 |
|--------|--------|---------|
| `DIVISION_NOT_FOUND` | 404 | `divisionId` 对应的 Division 不存在 |
| `ACTIVE_TEAM_REQUIRES_DIVISION` | 422 | 创建 Active Team 时未提供 `divisionId` 或提供 `null`；更新 Active Team 时显式提供 `divisionId: null` |

#### Player 相关

| 错误码 | 状态码 | 触发场景 |
|--------|--------|---------|
| `PLAYER_NOT_FOUND` | 404 | 嵌套更新时 `players[n].id` 不存在或不属于该 Team |
| `PLAYER_NUMBER_CONFLICT` | 409 | 请求完成后的同一 Team Active roster 中存在重复球衣号码；能定位 payload 行时 `details` 返回 `players[n].number` |

#### 通用

| 错误码 | 状态码 | 触发场景 |
|--------|--------|---------|
| `VALIDATION_ERROR` | 400 | 请求体字段缺失或类型非法；`details` 包含逐字段错误 |
| `SLUG_CONFLICT` | 409 | slug 并发冲突重试后仍无法生成唯一 slug |

### 7.4 各接口错误速查

| 接口 | 可能返回的错误码 |
|------|----------------|
| `GET /api/teams/:slug` | `TEAM_NOT_FOUND` |
| `POST /api/teams` | `VALIDATION_ERROR`、`DIVISION_NOT_FOUND`、`ACTIVE_TEAM_REQUIRES_DIVISION`、`PLAYER_NUMBER_CONFLICT`、`SLUG_CONFLICT` |
| `PATCH /api/teams/:slug` | `TEAM_NOT_FOUND`、`TEAM_ARCHIVED`、`VALIDATION_ERROR`、`DIVISION_NOT_FOUND`、`ACTIVE_TEAM_REQUIRES_DIVISION`、`PLAYER_NOT_FOUND`、`PLAYER_NUMBER_CONFLICT`、`SLUG_CONFLICT` |
| `POST /api/teams/:slug/archive` | `TEAM_NOT_FOUND`、`TEAM_ALREADY_ARCHIVED` |

### 7.5 设计约束

- 后端不得在错误响应中暴露数据库内部细节（表名、原始 Prisma 错误、堆栈）。
- `500` 响应的 `message` 统一返回 `"Internal server error"`，详细堆栈只写服务端日志。
- `VALIDATION_ERROR` 的 `details` 必须列出所有字段错误，不得短路。

## 8. 数据来源与统计计算

### 8.1 Team 详情统计

统计来源：
- `MatchTeamOtherStat` — 球队场均数据（得分、篮板、助攻、投篮）
- `MatchPlayerStat` — 球员场均数据

统计过滤条件：
- 仅统计所属 `Event.status = COMPLETED` 的 Match。
- 不统计所属 `Event.deletedAt != null` 或 `Event.archivedAt != null` 的 Match。
- 统计逻辑不要求 `Event.countsForRanking = true`；该字段只影响积分，不影响历史比赛统计。

Team 统计口径：
- `teamStats.gamesPlayed` 为该 Team 对应的唯一 `MatchTeamOtherStat.matchId` 数量。
- 缺少 `MatchTeamOtherStat` 的比赛不计入 `teamStats.gamesPlayed`，也不参与 Team 平均值计算。
- Team 各平均字段以参与该字段计算的 `MatchTeamOtherStat` 记录数为分母。当前字段均来自同一记录集，因此通常等同于 `teamStats.gamesPlayed`。

Player 统计口径：
- `players` 数组仅返回当前 `isActive = true` 的 Player；inactive Player 的历史统计不在 Team Management 详情接口中展示。
- `players[n].stats.gamesPlayed` 为该 Player 在当前 Team 下对应的 `MatchPlayerStat` 记录数量，即必须满足 `MatchPlayerStat.playerId = player.id` 且 `MatchPlayerStat.teamId = team.id`。
- Player 各平均字段以参与该字段计算的、属于当前 Team 的 `MatchPlayerStat` 记录数为分母。
- `avgRating` 排除 `rating = null` 的记录；若所有 rating 均为 `null` 或无记录，返回 `0`。

数值返回规则：
- 所有平均值在 API 层四舍五入到 1 位小数。
- 分母为 0 时，对应数值字段返回数字 `0`，不返回 `null`。
- 不预存 `gamesPlayed`、平均值、总计或其他派生统计。

### 8.2 积分计算公式

```
totalPoints = BASE_TEAM_POINTS + sum(EventTeamResult.resultTag.rankingPoints)
```

资格条件（全部满足）：
- `Event.status = COMPLETED`
- `Event.countsForRanking = true`
- `Event.deletedAt = null`
- `Event.archivedAt = null`

`BASE_TEAM_POINTS = 1000`，定义于 `apps/backend/src/shared/constants/ranking.ts`。

## 9. 示例工作流

### 9.1 创建 Team

1. 前端 `POST /api/teams`，带 `name`、`divisionId`，可选 `players`、`profileRating`。
2. 后端全量校验请求结构、未知字段、类型、必填字段和字段范围；有错误则 `400 VALIDATION_ERROR`（`details` 含所有字段错误）。
3. `divisionId` 缺省或为 `null` 则 `422 ACTIVE_TEAM_REQUIRES_DIVISION`。
4. 后端校验 Division 存在；否则 `404 DIVISION_NOT_FOUND`。
5. 球衣号码冲突则 `409 PLAYER_NUMBER_CONFLICT`。
6. 成功返回 `201` + 完整 Team 详情。

### 9.2 编辑 Team

1. 前端 `PATCH /api/teams/:slug`。
2. 后端全量校验请求结构、未知字段、字段格式和 Player 嵌套数据；有错误则 `400 VALIDATION_ERROR`。
3. Team 不存在则 `404 TEAM_NOT_FOUND`。
4. Team 已归档则 `422 TEAM_ARCHIVED`，不再继续校验 Division、Player 或号码冲突。
5. Active Team 显式传入 `divisionId: null` 则 `422 ACTIVE_TEAM_REQUIRES_DIVISION`。
6. 校验 `divisionId`（若含）和 Player 归属；Player `id` 不存在或不属于该 Team 则 `404 PLAYER_NOT_FOUND`。
7. 球衣号码冲突则 `409 PLAYER_NUMBER_CONFLICT`。
8. 成功返回 `200` + 完整 Team 详情。

### 9.3 查看 Team 详情

1. 前端 `GET /api/teams/:slug`。
2. Team 不存在则 `404 TEAM_NOT_FOUND`；归档 Team 返回 `200`（`archivedAt` 非 null）。
3. 后端动态计算 `totalPoints` 与所有场均统计。
4. 返回 `200` + 完整详情。

### 9.4 归档 Team

1. 前端 `POST /api/teams/:slug/archive`。
2. Team 不存在则 `404 TEAM_NOT_FOUND`。
3. 已归档则 `422 TEAM_ALREADY_ARCHIVED`。
4. 设置 `archivedAt`，返回 `200`。

## 10. 验收标准

### 10.1 创建 Team

- Given 合法 Team、Players 和 ProfileRating，When 创建，Then 所有实体在同一事务中成功写入并返回 `201`。
- Given 任一字段非法，When 创建，Then 返回 `400 VALIDATION_ERROR` 且 `details` 包含同阶段所有字段错误，数据库不写入 Team。
- Given 同一 payload 有重复 Active Player 号码，When 创建，Then 返回 `409 PLAYER_NUMBER_CONFLICT`，且全部写入回滚。
- Given Division 不存在，When 创建，Then 返回 `404 DIVISION_NOT_FOUND`，且数据库无新增记录。
- Given 两个并发请求生成相同 slug，When 创建，Then slug 保持唯一；超过重试次数时返回 `409 SLUG_CONFLICT`，不暴露原始数据库错误。

### 10.2 更新 Team

- PATCH 缺少字段时保留原值。
- PATCH 可清空字段显式传入 `null` 或空字符串时按规则清空；不可清空字段返回 `400 VALIDATION_ERROR`。
- Archived Team 的 PATCH 返回 `422 TEAM_ARCHIVED`。
- Player 不在 payload 中时保持不变。
- `{ id, isActive: false }` 只停用 Player，不删除记录。
- Player ID 不属于 URL 对应 Team 时返回 `404 PLAYER_NOT_FOUND`，且整个请求回滚。
- 修改 Player 造成 Active roster 号码冲突时返回 `409 PLAYER_NUMBER_CONFLICT`，且 Team 和其他 Player 修改全部回滚。
- `profileRating` 对象执行完整替换；`profileRating: null` 返回 `400 VALIDATION_ERROR`，不允许清空记录。

### 10.3 查询 Team 列表

- 默认不返回 archived Team。
- 不支持 `includeArchived` 查询参数。
- Division 和 Team 排序在 `sortOrder` 或积分相同时仍保持稳定。
- 没有符合条件 Team 时返回 `{ "divisions": [] }`。
- `totalPoints` 只计算符合资格条件的 EventTeamResult。

### 10.4 查询 Team 详情

- 响应包含 `divisionId`、`divisionName` 和 `divisionSlug`；无 Division 时三者均为 `null`。
- 不存在的 slug 返回 `404 TEAM_NOT_FOUND`。
- Archived Team 返回 `200` 并展示历史详情、历史积分和历史统计。
- 无比赛记录时所有统计数值返回 `0`。
- `rating = null` 和小数舍入按 §8.1 统一处理。
- `players` 只返回 Active Player。

### 10.5 归档 Team

- 首次归档设置 UTC 时间并返回 `200`。
- 重复归档返回 `422 TEAM_ALREADY_ARCHIVED`。
- 归档不删除 Player、Match、Stats、Award 或 Event 历史记录。
- 归档后不再出现在默认 Team 列表。
- 归档后 Team Management 域内禁止编辑。
