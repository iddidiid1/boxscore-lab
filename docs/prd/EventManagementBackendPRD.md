# Event Management Backend PRD

## 1. 目标

构建 Event Management 的后端 API，使管理员可以创建、查看、编辑和归档赛事，并在同一功能域内维护赛事内部的阶段标签、结果标签、参与球队、最终球队结果和球员奖项。Event 基础管理负责创建和维护 StageTag 与 ResultTag；后续结果录入只使用已创建的 ResultTag，StageTag 仅供 Match Entry 选择使用。Event 是后续 Match Entry 和 standings/statistics 展示的上游实体；本功能不录入比赛 box score，也不计算或持久化任何派生统计。Event 的 `slug` 与 `rankingOrder` 均由后端在创建时生成，`rankingOrder` 必须单调递增且不可由前端设置或重排。

## 2. 范围

含 (in scope):
- `GET /api/events`：读取未归档、未软删除的 Event 列表，供 Events 页面展示。
- `GET /api/events/:slug`：读取单个 Event 详情，包含基础信息、阶段标签、结果标签、参与球队、球队结果和球员奖项。
- `POST /api/events`：创建 Event，包含基础信息、可选阶段标签、可选结果标签和可选参与球队。
- `PATCH /api/events/:slug`：更新 Event 基础信息、阶段标签、结果标签和参与球队。
- `PATCH /api/events/:slug/outcomes`：更新 Event 的最终球队结果和球员奖项；该接口只使用当前 Event 已存在的 ResultTag，不创建或修改 StageTag / ResultTag。
- `POST /api/events/:slug/archive`：归档 Event，设置 `archivedAt`，保留历史数据和 `rankingOrder`。
- Event 基础字段管理：`name`、`tier`、`description`、`countsForRanking`；创建时 status 固定为 `PREPARING`，后续由受控状态转换更新。
- Event 创建时后端自动生成 `slug` 和 `rankingOrder`；前端不得传入或修改这两个字段。
- EventStageTag 管理：创建、更新、删除未被 Match 使用的阶段标签；已被 Match 使用的阶段标签删除行为在设计阶段明确，但不得删除历史 Match。
- EventResultTag 管理：创建、更新、删除未被 EventTeamResult 使用的结果标签；已被结果引用的标签不得破坏历史积分来源。
- EventParticipant 管理：为 Event 选择参与 Team；不得加入 archived Team。
- EventTeamResult 管理：在 outcomes 流程中为参与球队录入最终结果，包含 `resultTagId` 和可选 `notes`；该记录是后续 team points 运行时计算的数据来源之一，但本功能不新增独立 standings 计算接口。
- EventPlayerAward 管理：在 outcomes 流程中为 Event 录入球员奖项，包含 `EVENT_MVP`、`ALL_EVENT_FIRST_TEAM`、`ALL_EVENT_SECOND_TEAM`；获奖球员必须来自对应 Event 参与球队的 active players。
- 所有 API 错误遵循统一错误响应结构，并收集同阶段字段级 validation errors。
- 不新增存储型平均值、总分、排行榜位置或其他派生统计字段。

不含 (out of scope):
- Match 创建、编辑、box score 录入和比赛详情 API。
- Standings、leaderboards、team totalPoints 或 player averages 的新计算接口。
- Season 管理 UI/API；本阶段不要求 Event 必须归属 Season。
- 自动赛程生成、自动排名、淘汰赛 bracket、复杂赛制规则。
- Event 硬删除 API。
- Event unarchive / restore。
- 独立管理 StageTag 或 ResultTag 的跨 Event 模板库。

## 3. 业务规则

### 3.1 Event 创建与排序

- `Event.slug` 由后端根据 `name` 创建时自动生成，前端不得传入或修改。
- Event 创建后 slug 保持不可变；后续修改 `name` 不会重新生成或修改 slug。
- `Event.rankingOrder` 由后端创建时自动分配，规则为当前最大 `rankingOrder + 1`。
- Event 创建必须在数据库事务内读取当前最大 `rankingOrder` 并分配新值；Event 与其 participants、StageTag、ResultTag 的创建属于同一事务。
- 若并发创建触发 `rankingOrder` 唯一约束冲突，后端必须重新执行一次完整创建事务；重试后仍冲突时返回 `RANKING_ORDER_CONFLICT`，不得将该冲突混入 `SLUG_CONFLICT`。
- `rankingOrder` 一经写入不得修改、重排、复用；归档或未来软删除 Event 都不影响后续 Event 的递增序列。
- `countsForRanking` 只影响后续 team points 计算资格，不影响 Event 是否可展示、是否可录入 Match、是否可录入结果。
- MVP 不要求 Event 必须归属 `Season`；`seasonId` 本阶段不暴露在主流程中。
- 不同 Event 可采用不同赛制；最终成绩分类通过该 Event 自己的 ResultTag 表达，不使用全局固定名次或硬编码赛制规则。

### 3.2 Event 状态与归档

- `status` 只表示赛事流程状态，使用枚举：`PREPARING`、`ONGOING`、`COMPLETED`。
- Event 创建时后端固定写入 `PREPARING`；`POST /api/events` 不接收 `status`，请求包含该字段时返回 `VALIDATION_ERROR`。
- 允许的状态转换只有 `PREPARING → ONGOING`、`ONGOING → COMPLETED` 和用于 reopen 的 `COMPLETED → ONGOING`。
- 禁止 `PREPARING → COMPLETED`、`ONGOING → PREPARING` 和 `COMPLETED → PREPARING`；非法转换返回 `INVALID_EVENT_STATUS_TRANSITION`。
- `PREPARING → ONGOING` 前至少需要 1 个 participant；否则返回 `EVENT_PARTICIPANTS_REQUIRED`。
- `ONGOING → COMPLETED` 前必须满足所有 participants 都有 TeamResult；否则返回 `EVENT_RESULTS_INCOMPLETE`。
- `ONGOING → COMPLETED` 同样至少需要 1 个 participant；空 Event 返回 `EVENT_PARTICIPANTS_REQUIRED`，不得利用空集合判断完成。
- `PREPARING → ONGOING` 和 `ONGOING → COMPLETED` 可以与同一次配置 PATCH 中的其他修改原子提交；状态转换校验必须基于该请求应用后的最终 participants 和当前已保存 outcomes。前端也可选择先保存配置、再以独立 status PATCH 转换状态，但不得假定未保存的本地数据已被后端纳入校验。
- 当前为 `COMPLETED` 的 Event 配置和 outcomes 均只读。reopen 时 `PATCH /api/events/:slug` 请求体必须仅包含 `{ "status": "ONGOING" }`；不得在同一请求中夹带其他配置修改。
- Event 归档状态只由 `archivedAt != null` 表示；`status` 不承担归档语义。
- 通过 `POST /api/events/:slug/archive` 归档 Event 时，后端设置 `archivedAt = now()`，并保留 Event 原有 `status`。
- `POST /api/events` 和 `PATCH /api/events/:slug` 不得接收或写入任何归档状态；前端也不得提交 `ARCHIVED` 作为 `status`。
- 已归档 Event 仍可通过详情接口读取，用于历史查看。
- 本 MVP 不提供 archived Event 列表；`GET /api/events` 默认只返回 `archivedAt = null` 的 Event，归档后的 Event 只能通过直接详情 URL 或已有跳转查看。
- `archivedAt != null` 的 Event 不允许通过 `PATCH /api/events/:slug` 或 `PATCH /api/events/:slug/outcomes` 修改。
- `COMPLETED` Event 的配置和 outcomes 作为历史内容只读；除仅包含 `status = ONGOING` 的 reopen 请求外，配置 PATCH 和 outcomes PATCH 都必须返回 `EVENT_COMPLETED`。完成修正后可重新设置为 `COMPLETED`。

### 3.3 Event 配置与 outcomes 分离

- `PATCH /api/events/:slug` 只负责 Event 配置：基础字段、参与球队、StageTag、ResultTag。
- `PATCH /api/events/:slug/outcomes` 只负责 EventTeamResult 和 EventPlayerAward。
- outcomes 流程只能使用当前 Event 已存在的 ResultTag，不得创建、修改或删除 ResultTag。
- StageTag 只在 Event 配置中创建和管理；它的使用发生在后续 Match Entry 中，本功能不录入 Match。

### 3.4 StageTag 规则

- StageTag 属于单个 Event，`slug` 在同一 Event 内唯一。
- 前端提交 StageTag 时只提交 `label`、可选 `description` 和可选 `sortOrder`；后端根据 `label` 生成 event-scoped `slug`。
- StageTag slug 仅在创建时生成；后续修改 `label` 不会重新生成或修改 slug。
- 若同一 Event 内多个 StageTag label 生成相同 slug，返回 `VALIDATION_ERROR`，字段定位到对应 `stageTags[n].label`。
- 删除未被 Match 使用的 StageTag 时可物理删除。
- 删除已被 Match 使用的 StageTag 不得删除历史 Match；MVP 设计为拒绝删除并返回 `STAGE_TAG_IN_USE`。
- 修改 StageTag 的 `label` 不应影响已存在 Match 的 `stageTagId` 关系。

### 3.5 ResultTag 规则

- ResultTag 属于单个 Event，`slug` 在同一 Event 内唯一。
- 前端提交 ResultTag 时只提交 `label`、`isWinnerTag`、`rankingPoints` 和可选 `sortOrder`；后端根据 `label` 生成 event-scoped `slug`。
- ResultTag slug 仅在创建时生成；后续修改 `label` 不会重新生成或修改 slug。
- 若同一 Event 内多个 ResultTag label 生成相同 slug，返回 `VALIDATION_ERROR`，字段定位到对应 `resultTags[n].label`。
- `isWinnerTag = true` 表示该 tag 可作为列表页和详情页中的冠军摘要来源。
- 一个 Event 最多允许一个 ResultTag 标记为 `isWinnerTag = true`。
- 每个 Event 最多允许一个 EventTeamResult 使用 `isWinnerTag = true` 的 ResultTag；也就是说一个 Event 只能有一个 champion team。
- 非 winner ResultTag 可以被多个 EventTeamResult 使用，例如 Semifinalist、Quarterfinalist、Participant 等结果标签。
- `sortOrder` 表示该 Event 内成绩分类的展示顺序，用于适配不同赛制；它不是具体 Team 名次。
- 删除未被 EventTeamResult 使用的 ResultTag 时可物理删除。
- 删除已被 EventTeamResult 使用的 ResultTag 会破坏历史积分来源，必须拒绝并返回 `RESULT_TAG_IN_USE`。
- 修改已被结果引用的 ResultTag 的 `rankingPoints` 会影响后续运行时 points 计算；MVP 允许管理员修改，但 UI/PRD 必须将其视为 Event 配置修改而非独立积分记录。
- 已被 EventTeamResult 引用的 ResultTag 仍可修改 `label`、`isWinnerTag`、`rankingPoints` 和 `sortOrder`，但后端必须对修改后的最终数据集重新执行 winner tag 和 champion team 唯一性校验。若产生多个 winner ResultTag，返回 `RESULT_TAG_WINNER_CONFLICT`；若使多个 TeamResult 同时成为 champion result，返回 `CHAMPION_RESULT_CONFLICT`，整次配置 PATCH 回滚。

### 3.6 Participant 规则

- 新增 EventParticipant 只能引用 active Team。本功能中 active Team 明确定义为 `archivedAt = null`、`divisionId != null`，且关联的 Division 仍然存在。
- 新增 participant 时，archived Team 返回 `TEAM_ARCHIVED`；未归档但缺少有效 Division 的 Team 返回 `ACTIVE_TEAM_REQUIRES_DIVISION`。
- Team 在加入 Event 后可能被归档或失去有效 Division。此类既有 participant 可以在后续配置请求中原样保留，不得因为当前已不符合新增资格而拒绝整个请求；但不能在被移除后以 unavailable 状态重新添加。
- 同一 Team 在同一 Event 中只能出现一次。
- 从参与球队中移除一个 Team 前，后端必须检查该 Team 是否已在该 Event 中存在 Match、EventTeamResult 或 EventPlayerAward。
- 若存在上述历史引用，拒绝移除并返回 `EVENT_PARTICIPANT_IN_USE`。
- 添加或移除参与球队不自动创建、删除或修改 Match。

### 3.7 EventTeamResult 规则

- EventTeamResult 只允许为当前 Event 的参与球队创建。
- 每个参与球队在同一 Event 中最多有一条 EventTeamResult。
- `resultTagId` 必须属于当前 Event。
- 若 `resultTagId` 对应的 ResultTag 为 `isWinnerTag = true`，同一 Event 中最多只能有一条 EventTeamResult 使用该 ResultTag。
- 非 winner ResultTag 允许被多个 TeamResult 使用。
- `notes` 为可选文本。
- MVP 不暴露或使用具体 Team rank；结果展示排序由 ResultTag 的 `sortOrder` 表达成绩分类顺序。
- `PREPARING` / `ONGOING` Event 允许部分或全部参与球队暂时没有 EventTeamResult。
- `COMPLETED` Event 必须让每个 EventParticipant 都有且只有一条 EventTeamResult；缺失结果表示“未录入”，不等同于 0 分。
- 0 分最终成绩也应通过 ResultTag 表示，例如 Group Stage Exit、Participant、Unplaced。
- 当 `PATCH /api/events/:slug` 将 Event 的最终状态设置为 `COMPLETED` 时，后端必须校验所有 participants 都已有 TeamResult；若不完整，返回 `EVENT_RESULTS_INCOMPLETE`。Event 完成后 outcomes 只读。
- EventTeamResult 是后续 team points 运行时计算的数据来源之一，但本功能不新增 standings API，也不存储派生分数。

### 3.8 EventPlayerAward 规则

- EventPlayerAward 只允许引用当前 Event 参与球队中的 active players。本功能中 active player 明确定义为 `Player.isActive = true`，且 Player 当前的 `teamId` 对应当前 Event 的既有 participant。Team 后续归档或失去有效 Division 不会单独使该 participant 下的 active player 失去奖项候选资格。
- 上述 active 限制适用于新增或变更奖项。Event reopen 后，若既有获奖球员已经 inactive，请求可以原样保留该既有 EventPlayerAward；不得为该 inactive player 新增其他奖项或改变其既有奖项内容。
- inactive player 的既有奖项可以在明确的完整替换中移除；一旦移除，不得在 inactive 状态下重新添加。
- `teamId` 必须是获奖球员当前所属 Team，且该 Team 必须参与当前 Event。
- MVP 奖项类型沿用现有枚举：`EVENT_MVP`、`ALL_EVENT_FIRST_TEAM`、`ALL_EVENT_SECOND_TEAM`。
- `EVENT_MVP` 每个 Event 最多 1 人。
- `ALL_EVENT_FIRST_TEAM` 每个 Event 最多 5 人。
- `ALL_EVENT_SECOND_TEAM` 每个 Event 最多 5 人。
- 同一球员在同一 Event 中不得重复获得同一 `awardType`；数据库唯一约束兜底。
- 同一球员不得同时获得 `ALL_EVENT_FIRST_TEAM` 和 `ALL_EVENT_SECOND_TEAM`；冲突时返回 `AWARD_TEAM_CONFLICT`。
- `EVENT_MVP` 不参与上述互斥：MVP 可以同时入选 First Team 或 Second Team。
- `notes` 为可选文本。

### 3.9 事务与原子性

- `POST /api/events` 必须在一个数据库事务内创建 Event、participants、StageTag 和 ResultTag，并在同一事务内分配 `rankingOrder`。
- `PATCH /api/events/:slug` 必须在一个数据库事务内完成 Event 基础字段以及 participants、StageTag、ResultTag 的新增、更新和删除。
- `PATCH /api/events/:slug/outcomes` 必须在一个数据库事务内完成 teamResults 与 playerAwards 的完整替换。
- 依赖数据库当前状态的引用检查、完整性检查和对应写入必须处于同一事务；任一步失败时整次请求回滚，不允许部分保存。
- 不依赖数据库状态的请求格式验证应在事务前完成并一次性收集，以缩短事务占用时间。
- `POST /api/events/:slug/archive` 只更新单条 Event，不要求显式事务。

## 4. Schema 变更

### 4.1 新增 / 修改字段

| Model | Field | Type | Notes |
|-------|-------|------|-------|
| `EventStatus` | enum values | `PREPARING / ONGOING / COMPLETED` | 移除 `ARCHIVED`，归档统一由 `Event.archivedAt` 表示 |
| 无新增模型 | 无 | 无 | 当前 Prisma schema 已包含 Event Management 所需模型和字段 |

### 4.2 迁移说明

本阶段需要一次 Prisma schema 迁移：
- 从 `EventStatus` enum 中移除 `ARCHIVED`。
- 保留 `Event.archivedAt` 字段作为唯一归档标记。
- 迁移前查询所有 `status = ARCHIVED` 的 Event，并输出受影响清单，包含 Event 标识、`archivedAt`、participant 数量和 TeamResult 数量，供人工复核。
- 对每个 `status = ARCHIVED` 的 Event，若 `archivedAt = null`，使用迁移执行时间补齐。
- 若该 Event 的 participant 数量大于 0，且每个 participant 都恰好有一条 TeamResult，则将 `status` 回填为 `COMPLETED`；其他情况统一回填为 `PREPARING`。
- 不自动回填为 `ONGOING`，因为旧的 `ARCHIVED` 状态已经覆盖归档前状态，现有数据无法可靠证明 Event 原先处于进行中。
- 状态与 `archivedAt` 回填完成后再移除 enum value，并验证数据库中不再存在 `status = ARCHIVED`，所有原 archived Event 均具有非空 `archivedAt`。
- 若迁移前确认没有 `status = ARCHIVED` 的记录，则无需执行数据回填，可直接移除 enum value。
- 详细原因、风险和示例见项目根目录 `EVENT_STATUS_MIGRATION_NOTE.md`。

已存在并使用的模型包括：
- `Event`
- `EventStageTag`
- `EventResultTag`
- `EventParticipant`
- `EventTeamResult`
- `EventPlayerAward`
- `Team`
- `Player`

## 5. API 规范

### 5.1 GET /api/events

- **Method + Path**: `GET /api/events`
- **描述**: 返回未归档、未软删除的 Event 列表，供 `/events` 列表页展示。
- **Request body**: 无
- **Response (200)**:
  ```json
  {
    "events": [
      {
        "id": 1,
        "slug": "summer-cup",
        "name": "Summer Cup",
        "tier": "A",
        "status": "COMPLETED",
        "description": "Short event description.",
        "countsForRanking": true,
        "rankingOrder": 3,
        "participatingTeamCount": 8,
        "champion": {
          "teamId": 1,
          "teamSlug": "red-eagles",
          "teamName": "Red Eagles",
          "resultTagId": 1,
          "resultTagLabel": "Champion"
        },
        "createdAt": "2026-06-26T00:00:00.000Z",
        "updatedAt": "2026-06-26T00:00:00.000Z"
      }
    ]
  }
  ```
- **排序**: `rankingOrder DESC, id DESC`
- **过滤**: `archivedAt = null` 且 `deletedAt = null`
- **说明**: 本 MVP 不支持 archived Event 列表或 archived filter。当 Event 没有 winner ResultTag，winner ResultTag 尚未被 TeamResult 使用，或尚无任何 TeamResult 时，`champion` 字段稳定返回 `null`，不得省略。
- **Errors**: 无

### 5.2 GET /api/events/:slug

- **Method + Path**: `GET /api/events/:slug`
- **描述**: 返回单个 Event 的完整详情，供详情页、编辑页和 outcomes 页使用。
- **Request body**: 无
- **Response (200)**:
  ```json
  {
    "id": 1,
    "slug": "summer-cup",
    "name": "Summer Cup",
    "tier": "A",
    "status": "COMPLETED",
    "description": "Short event description.",
    "countsForRanking": true,
    "rankingOrder": 3,
    "archivedAt": null,
    "deletedAt": null,
    "participants": [
      {
        "teamId": 1,
        "teamSlug": "red-eagles",
        "teamName": "Red Eagles",
        "teamArchivedAt": null,
        "divisionId": 1,
        "divisionName": "East",
        "isEligible": true
      }
    ],
    "awardCandidatePlayers": [
      {
        "playerId": 5,
        "playerSlug": "james-lee",
        "playerName": "James Lee",
        "number": 23,
        "position": "SF",
        "teamId": 1,
        "teamSlug": "red-eagles",
        "teamName": "Red Eagles"
      }
    ],
    "stageTags": [
      {
        "id": 1,
        "slug": "group-stage",
        "label": "Group Stage",
        "description": null,
        "sortOrder": 1
      }
    ],
    "resultTags": [
      {
        "id": 1,
        "slug": "champion",
        "label": "Champion",
        "isWinnerTag": true,
        "rankingPoints": 10,
        "sortOrder": 1
      }
    ],
    "teamResults": [
      {
        "id": 1,
        "teamId": 1,
        "teamSlug": "red-eagles",
        "teamName": "Red Eagles",
        "resultTagId": 1,
        "resultTagLabel": "Champion",
        "notes": null
      }
    ],
    "playerAwards": [
      {
        "id": 1,
        "awardType": "EVENT_MVP",
        "playerId": 5,
        "playerSlug": "james-lee",
        "playerName": "James Lee",
        "playerPosition": "SF",
        "playerIsActive": true,
        "teamId": 1,
        "teamSlug": "red-eagles",
        "teamName": "Red Eagles",
        "notes": null
      }
    ],
    "createdAt": "2026-06-26T00:00:00.000Z",
    "updatedAt": "2026-06-26T00:00:00.000Z"
  }
  ```
- **Player award response fields**:
  - `playerAwards[].playerPosition` is the related Player's current persisted `position` and uses the existing `PlayerPosition` enum.
  - The field is presentation data for Event detail consumers. It is not stored on `EventPlayerAward` and requires no schema migration.
  - Clients must not infer a player's position from award order or award type.
- **Errors**: `EVENT_NOT_FOUND`
- **说明**:
  - `awardCandidatePlayers` 只包含当前 Event 参与球队中的 active players。
  - outcomes 页使用该数组按 Team 筛选和选择奖项球员。
  - `playerAwards[].playerIsActive` 表示获奖球员当前是否 active；既有 inactive 获奖球员仍保留在 `playerAwards` 中，但不加入 `awardCandidatePlayers`。
  - `participants` 按 `teamName ASC`、`teamId ASC` 稳定排序。
  - `participants[].isEligible` 表示该 Team 当前是否仍符合新增 participant 资格；既有 unavailable participant 仍必须返回，以便编辑表单安全保留。
  - `awardCandidatePlayers` 按 `teamName ASC`、`number ASC`、`playerName ASC`、`playerId ASC` 稳定排序。
  - `stageTags` 按 `sortOrder ASC`、`id ASC` 稳定排序。
  - `resultTags` 按 `sortOrder ASC`、`id ASC` 稳定排序。
  - `teamResults` 按 `resultTag.sortOrder ASC`、`resultTag.rankingPoints DESC`、`teamName ASC`、`teamId ASC` 稳定排序。
  - `playerAwards` 先按固定奖项顺序 `EVENT_MVP`、`ALL_EVENT_FIRST_TEAM`、`ALL_EVENT_SECOND_TEAM` 排序；同一奖项内再按项目位置顺序 `PG`、`SG`、`G`、`SF`、`PF`、`F`、`C` 排序，同位置按 `teamName ASC`、`player.number ASC`、`playerName ASC`、`playerId ASC` 稳定排序。
  - 详情查询必须排除 `deletedAt != null` 的 Event；软删除 Event 按 `EVENT_NOT_FOUND` 处理。
  - 所有日期时间字段使用 ISO 8601 UTC 字符串。

### 5.3 POST /api/events

- **Method + Path**: `POST /api/events`
- **描述**: 创建 Event 及可选嵌套配置。创建时后端自动生成 `slug` 和 `rankingOrder`。
- **Request body**:
  ```json
  {
    "name": "Summer Cup",
    "tier": "A",
    "description": "Short event description.",
    "countsForRanking": true,
    "participantTeamIds": [1, 2],
    "stageTags": [
      {
        "label": "Group Stage",
        "description": null,
        "sortOrder": 1
      }
    ],
    "resultTags": [
      {
        "label": "Champion",
        "isWinnerTag": true,
        "rankingPoints": 10,
        "sortOrder": 1
      }
    ]
  }
  ```
- **Response (201)**: 结构同 `GET /api/events/:slug`
- **说明**:
  - `participantTeamIds`、`stageTags`、`resultTags` 均可省略，省略时创建空集合。
  - 本接口不接收 `teamResults` / `playerAwards`；结果和奖项统一通过 `PATCH /api/events/:slug/outcomes` 管理。
  - 创建请求不接收 `status`；后端固定创建为 `PREPARING`，请求包含 `status` 返回 `VALIDATION_ERROR`。
  - 全部写入以及 `rankingOrder` 分配必须在同一数据库事务中完成。
  - `rankingOrder` 唯一约束冲突时完整重试一次；重试后仍冲突则返回 `RANKING_ORDER_CONFLICT`。
- **Errors**: `VALIDATION_ERROR`, `TEAM_NOT_FOUND`, `TEAM_ARCHIVED`, `ACTIVE_TEAM_REQUIRES_DIVISION`, `RESULT_TAG_WINNER_CONFLICT`, `SLUG_CONFLICT`, `RANKING_ORDER_CONFLICT`

### 5.4 PATCH /api/events/:slug

- **Method + Path**: `PATCH /api/events/:slug`
- **描述**: 更新 Event 配置，不更新 EventTeamResult 或 EventPlayerAward。
- **Request body**:
  ```json
  {
    "name": "Summer Cup Updated",
    "tier": "S",
    "status": "ONGOING",
    "description": "Updated description.",
    "countsForRanking": true,
    "participantTeamIds": [1, 2, 3],
    "stageTags": [
      {
        "id": 1,
        "label": "Group Stage",
        "description": null,
        "sortOrder": 1
      },
      {
        "label": "Final",
        "description": null,
        "sortOrder": 2
      }
    ],
    "resultTags": [
      {
        "id": 1,
        "label": "Champion",
        "isWinnerTag": true,
        "rankingPoints": 10,
        "sortOrder": 1
      }
    ]
  }
  ```
- **处理规则**:
  - PATCH 缺省字段保持不变。
  - 请求体必须至少包含一个允许修改的字段；空对象返回 `VALIDATION_ERROR`。显式提交与当前值相同的 `status` 不构成状态转换，返回 `INVALID_EVENT_STATUS_TRANSITION`。
  - status 转换只允许 `PREPARING → ONGOING`、`ONGOING → COMPLETED`、`COMPLETED → ONGOING`；其他转换返回 `INVALID_EVENT_STATUS_TRANSITION`。
  - `PREPARING → ONGOING` 和 `ONGOING → COMPLETED` 都要求保存后的 Event 至少有 1 个 participant；否则返回 `EVENT_PARTICIPANTS_REQUIRED`。
  - 当前状态为 `COMPLETED` 时，唯一允许的配置请求是仅包含 `{ "status": "ONGOING" }` 的 reopen 请求；status 缺省、目标不是 `ONGOING` 或同时包含其他字段时返回 `EVENT_COMPLETED` 或 `INVALID_EVENT_STATUS_TRANSITION`。
  - 只有明确提交 `stageTags`、`resultTags` 或 `participantTeamIds` 时才对对应集合执行完整替换；字段省略时该集合保持不变，显式提交空数组表示尝试清空该集合。
  - 若提交 `stageTags`，数组中包含的已有 `id` 更新，无 `id` 的项创建；数据库中属于该 Event 但未出现在数组中的 StageTag 若未被 Match 引用则物理删除，已被引用则返回 `STAGE_TAG_IN_USE`。
  - 若提交 `resultTags`，数组中包含的已有 `id` 更新，无 `id` 的项创建；数据库中属于该 Event 但未出现在数组中的 ResultTag 若未被 EventTeamResult 引用则物理删除，已被引用则返回 `RESULT_TAG_IN_USE`。
  - 若提交 `participantTeamIds`，未出现在数组中的 participant 若没有 Match、EventTeamResult 或 EventPlayerAward 引用则删除；存在任一引用则返回 `EVENT_PARTICIPANT_IN_USE`。
  - `participantTeamIds` 中新加入的 Team 必须满足 active Team 资格；已存在但当前 unavailable 的 participant 可原样保留。已移除的 unavailable Team 不得重新添加。
  - 完整替换中只要存在一个不可删除项，整个请求失败并回滚；不得跳过冲突项或部分保存其他变更。
  - Event 基础字段与所有提交的嵌套配置必须在同一数据库事务中完成；任一步失败时全部回滚。
  - `ONGOING → COMPLETED` 时，每个最终 participant 都必须已有 TeamResult；否则拒绝并返回 `EVENT_RESULTS_INCOMPLETE`。
  - `slug`、`rankingOrder`、`teamResults`、`playerAwards` 不得出现在请求体中。
- **Response (200)**: 结构同 `GET /api/events/:slug`
- **Errors**: `EVENT_NOT_FOUND`, `EVENT_ARCHIVED`, `EVENT_COMPLETED`, `INVALID_EVENT_STATUS_TRANSITION`, `EVENT_PARTICIPANTS_REQUIRED`, `VALIDATION_ERROR`, `TEAM_NOT_FOUND`, `TEAM_ARCHIVED`, `ACTIVE_TEAM_REQUIRES_DIVISION`, `STAGE_TAG_NOT_FOUND`, `RESULT_TAG_NOT_FOUND`, `STAGE_TAG_IN_USE`, `RESULT_TAG_IN_USE`, `EVENT_PARTICIPANT_IN_USE`, `RESULT_TAG_WINNER_CONFLICT`, `EVENT_RESULTS_INCOMPLETE`

### 5.5 PATCH /api/events/:slug/outcomes

- **Method + Path**: `PATCH /api/events/:slug/outcomes`
- **描述**: 更新 Event 的最终球队结果和球员奖项。
- **Request body**:
  ```json
  {
    "teamResults": [
      {
        "teamId": 1,
        "resultTagId": 1,
        "notes": "Champion"
      }
    ],
    "playerAwards": [
      {
        "awardType": "EVENT_MVP",
        "playerId": 5,
        "teamId": 1,
        "notes": null
      }
    ]
  }
  ```
- **处理规则**:
  - `teamResults` 和 `playerAwards` 均采用完整替换语义。
  - 请求中缺省 `teamResults` 时不修改现有球队结果；缺省 `playerAwards` 时不修改现有奖项。
  - 显式提交 `teamResults: []` 表示清空所有现有 EventTeamResult；显式提交 `playerAwards: []` 表示清空所有现有 EventPlayerAward。
  - `PREPARING` / `ONGOING` Event 可以清空全部 TeamResult；`COMPLETED` Event 的 outcomes 不可修改，无论 payload 内容为何均返回 `EVENT_COMPLETED`。
  - `resultTagId` 必须属于当前 Event。
  - `teamId` 必须属于当前 Event participants。
  - 本接口不接收 `rank`；具体球队名次不属于 MVP outcome 模型。
  - `playerId` 必须属于 `teamId` 对应 Team。
  - 新增或变更奖项时 player 必须 active，否则返回 `PLAYER_INACTIVE`。对于既有 inactive player award，仅允许请求以相同 `awardType`、`playerId`、`teamId` 和 `notes` 原样保留，或通过完整替换明确移除。
  - First Team 与 Second Team 的球员集合必须互斥；MVP 可以与其中任一集合重叠。
  - teamResults 与 playerAwards 的替换必须在同一数据库事务中完成；任一步失败时全部回滚。
- **Response (200)**: 结构同 `GET /api/events/:slug`
- **Errors**: `EVENT_NOT_FOUND`, `EVENT_ARCHIVED`, `EVENT_COMPLETED`, `VALIDATION_ERROR`, `TEAM_NOT_IN_EVENT`, `RESULT_TAG_NOT_FOUND`, `PLAYER_NOT_FOUND`, `PLAYER_NOT_IN_EVENT`, `PLAYER_INACTIVE`, `AWARD_LIMIT_EXCEEDED`, `DUPLICATE_EVENT_RESULT`, `DUPLICATE_PLAYER_AWARD`, `AWARD_TEAM_CONFLICT`, `CHAMPION_RESULT_CONFLICT`

### 5.6 POST /api/events/:slug/archive

- **Method + Path**: `POST /api/events/:slug/archive`
- **描述**: 归档 Event，保留历史数据。
- **Request body**: 无
- **处理规则**:
  - 任何尚未归档且未软删除的 `PREPARING`、`ONGOING` 或 `COMPLETED` Event 都可归档；归档不要求 outcomes 完整，也不改变原 status。
  - 软删除 Event 按 `EVENT_NOT_FOUND` 处理；已归档 Event 返回 `EVENT_ALREADY_ARCHIVED`。
- **Response (200)**:
  ```json
  {
    "id": 1,
    "slug": "summer-cup",
    "archivedAt": "2026-06-26T00:00:00.000Z"
  }
  ```
- **Errors**: `EVENT_NOT_FOUND`, `EVENT_ALREADY_ARCHIVED`

## 6. 验证规则

### 6.1 通用请求验证

- 请求体只能包含本 PRD 声明的字段；未知字段返回 `400 VALIDATION_ERROR`。
- `slug` 和 `rankingOrder` 不得出现在任何 POST/PATCH 请求体中。
- 字符串字段先 trim；可清空字段的空字符串标准化为 `null`。
- 所有同阶段字段级 validation errors 必须收集后一次性返回。
- `details[].field` 必须使用可直接映射到前端表单的完整字段路径：基础字段使用 `name`、`status` 等字段名；数组整体使用 `participantTeamIds`、`stageTags`、`resultTags`；数组元素使用 `participantTeamIds[0]`；嵌套字段使用 `stageTags[0].label`、`resultTags[1].rankingPoints`、`teamResults[0].resultTagId`、`playerAwards[0].playerId`。
- 同一次请求中发现的多个字段错误必须全部加入 `details`，不得只返回第一个错误。
- 可定位到具体输入项的业务冲突也必须提供字段路径：重复 participant 指向后出现的 `participantTeamIds[n]`，额外 winner tag 指向 `resultTags[n].isWinnerTag`，重复 TeamResult 指向后出现的 `teamResults[n].teamId`，First Team/Second Team 互斥冲突指向冲突的 `playerAwards[n].playerId`。
- 无法合理归属单一输入字段的 Event 整体状态冲突可以返回空 `details`，由前端按页面级或区块级错误处理。

### 6.2 Event 字段

| 字段 | 规则 |
|------|------|
| `name` | 创建时必填；trim 后 1-100 字符 |
| `tier` | 创建时必填；枚举 `S / A / B / C` |
| `status` | POST 不允许提交，后端固定创建为 `PREPARING`；PATCH 仅允许 `PREPARING → ONGOING`、`ONGOING → COMPLETED`、`COMPLETED → ONGOING`；归档不通过 `status` 表示 |
| `description` | 可选；最大 2,000 字符；允许 `null` |
| `countsForRanking` | 可选 boolean；创建默认 `true` |

### 6.3 StageTag 字段

| 字段 | 规则 |
|------|------|
| `id` | 更新已有 StageTag 时可传；必须属于当前 Event |
| `label` | 必填；trim 后 1-80 字符 |
| `description` | 可选；最大 500 字符；允许 `null` |
| `sortOrder` | 可选非负整数；缺省时按数组顺序分配 |

同一 Event 内 StageTag label 生成的 slug 不得重复。
同一请求中不得重复提交同一个已有 StageTag `id`；重复项返回 `VALIDATION_ERROR` 并定位到后出现的 `stageTags[n].id`。`sortOrder` 允许重复，读取时使用 `id` 作为稳定次排序。

### 6.4 ResultTag 字段

| 字段 | 规则 |
|------|------|
| `id` | 更新已有 ResultTag 时可传；必须属于当前 Event |
| `label` | 必填；trim 后 1-80 字符 |
| `isWinnerTag` | 必填 boolean |
| `rankingPoints` | 必填整数，范围 `0-100000` |
| `sortOrder` | 可选非负整数；缺省时按数组顺序分配 |

同一 Event 最多一个 `isWinnerTag = true`。
同一请求中不得重复提交同一个已有 ResultTag `id`；重复项返回 `VALIDATION_ERROR` 并定位到后出现的 `resultTags[n].id`。`sortOrder` 允许重复，读取时使用 `id` 作为稳定次排序。

### 6.5 Participant 字段

- `participantTeamIds` 必须为整数数组。
- 数组中不得重复 Team ID。
- 每个 Team ID 必须存在。新加入的 Team 必须满足 active Team 定义：`archivedAt = null`、`divisionId != null`，并关联有效 Division；既有 unavailable participant 可原样保留。

### 6.5.1 完整替换与引用保护

- `stageTags`、`resultTags`、`participantTeamIds` 省略时保持现有集合不变；显式空数组表示尝试清空。
- 完整替换删除 StageTag、ResultTag 或 participant 前必须执行对应引用检查。
- 任何引用冲突都必须使同一事务内的全部配置修改回滚，不允许静默保留冲突项或部分应用请求。

### 6.6 TeamResult 字段

| 字段 | 规则 |
|------|------|
| `teamId` | 必填；必须属于当前 Event participants |
| `resultTagId` | 必填；必须属于当前 Event resultTags |
| `notes` | 可选；最大 1,000 字符；允许 `null` |

同一 `teamId` 在 `teamResults` 中不得重复。
同一 Event 中，最多一个 `teamResults` item 可以使用 `isWinnerTag = true` 的 ResultTag；非 winner ResultTag 可重复用于多个 Team。
MVP 不接收、不展示、不使用具体 Team rank；如 schema 中已有 `EventTeamResult.rank`，本功能保持未使用。
当 Event 为 `COMPLETED` 时，所有 participants 必须在保存后拥有 TeamResult；没有 TeamResult 表示未录入，不表示 0 分。
`teamResults` 省略表示不修改，显式空数组表示清空；该替换只允许用于 `PREPARING` / `ONGOING` Event。

### 6.7 PlayerAward 字段

| 字段 | 规则 |
|------|------|
| `awardType` | 必填；枚举 `EVENT_MVP / ALL_EVENT_FIRST_TEAM / ALL_EVENT_SECOND_TEAM` |
| `playerId` | 必填；必须存在且属于参与球队 |
| `teamId` | 必填；必须是该 player 当前所属 Team，且该 Team 参与当前 Event |
| `notes` | 可选；最大 1,000 字符；允许 `null` |

奖项数量限制：
- `EVENT_MVP`: 最多 1 人
- `ALL_EVENT_FIRST_TEAM`: 最多 5 人
- `ALL_EVENT_SECOND_TEAM`: 最多 5 人

同一 Event 中，同一 player 不得重复获得同一 `awardType`。
同一 Event 中，同一 player 不得同时出现在 `ALL_EVENT_FIRST_TEAM` 和 `ALL_EVENT_SECOND_TEAM`；`EVENT_MVP` 可与任一阵容奖项重叠。
`playerAwards` 省略表示不修改，显式空数组表示清空全部奖项。
active player 可新增奖项；inactive player 只能原样保留既有奖项或移除既有奖项，不能新增、重新添加或修改奖项内容。

## 7. 错误码

统一错误响应结构：

```json
{
  "statusCode": 422,
  "error": "ERROR_CODE",
  "message": "Human-readable description.",
  "details": []
}
```

| Code | HTTP | Condition |
|------|------|-----------|
| `VALIDATION_ERROR` | 400 | 请求体字段缺失、类型错误、未知字段、长度或范围非法 |
| `EVENT_NOT_FOUND` | 404 | URL slug 对应的 Event 不存在或已软删除 |
| `EVENT_ARCHIVED` | 422 | 尝试修改 `archivedAt != null` 的 Event |
| `EVENT_ALREADY_ARCHIVED` | 422 | 重复归档 Event |
| `EVENT_COMPLETED` | 409 | 尝试修改 `COMPLETED` Event 的配置或 outcomes；必须先通过独立请求 reopen 为 `ONGOING` |
| `INVALID_EVENT_STATUS_TRANSITION` | 409 | 请求的 Event status 转换不符合允许的状态机 |
| `EVENT_PARTICIPANTS_REQUIRED` | 409 | 尝试开始或完成没有 participant 的 Event |
| `TEAM_NOT_FOUND` | 404 | participant Team 不存在 |
| `TEAM_ARCHIVED` | 422 | 尝试将 archived Team 加入 Event |
| `ACTIVE_TEAM_REQUIRES_DIVISION` | 422 | participant Team 未归档但缺少有效 Division |
| `TEAM_NOT_IN_EVENT` | 422 | outcomes 中的 Team 不属于当前 Event participants |
| `PLAYER_NOT_FOUND` | 404 | playerId 不存在 |
| `PLAYER_NOT_IN_EVENT` | 422 | player 不属于当前 Event 的参与球队 |
| `PLAYER_INACTIVE` | 422 | 尝试为 inactive player 新增、重新添加或变更奖项 |
| `STAGE_TAG_NOT_FOUND` | 404 | stageTags[n].id 不属于当前 Event |
| `RESULT_TAG_NOT_FOUND` | 404 | resultTags[n].id 或 outcomes resultTagId 不属于当前 Event |
| `STAGE_TAG_IN_USE` | 409 | 尝试删除已被 Match 使用的 StageTag |
| `RESULT_TAG_IN_USE` | 409 | 尝试删除已被 EventTeamResult 使用的 ResultTag |
| `EVENT_PARTICIPANT_IN_USE` | 409 | 尝试移除已有 Match、result 或 award 引用的 participant Team |
| `RESULT_TAG_WINNER_CONFLICT` | 409 | 同一 Event 中存在多个 winner ResultTag |
| `CHAMPION_RESULT_CONFLICT` | 409 | 同一 Event 中多个 TeamResult 使用 winner ResultTag |
| `EVENT_RESULTS_INCOMPLETE` | 409 | 尝试执行 `ONGOING → COMPLETED`，但仍有 participant 没有 TeamResult |
| `AWARD_LIMIT_EXCEEDED` | 409 | 奖项人数超过 MVP/First Team/Second Team 限制 |
| `DUPLICATE_EVENT_RESULT` | 409 | 同一 Event 中同一 Team 出现重复结果 |
| `DUPLICATE_PLAYER_AWARD` | 409 | 同一 Event 中同一 player 重复获得同一 awardType |
| `AWARD_TEAM_CONFLICT` | 409 | 同一 player 同时入选 First Team 与 Second Team |
| `SLUG_CONFLICT` | 409 | slug 并发冲突重试后仍无法生成唯一 slug |
| `RANKING_ORDER_CONFLICT` | 409 | rankingOrder 并发唯一冲突在完整事务重试一次后仍未解决 |
