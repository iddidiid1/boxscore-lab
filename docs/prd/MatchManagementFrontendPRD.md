# Match Management Frontend PRD

## Status and authority

**Status:** Active feature contract.

This PRD remains authoritative for Match capabilities, data entry, routes,
validation, read-only/void/restore behavior, and API interaction. Active
visual treatment is owned by `docs/DESIGN.md`, while approved Editorial
Scoreboard migration PRDs own implementation scope. Historical references to
the existing card or sports-console appearance do not freeze obsolete visual
composition.

## 1. 目标

将现有 Match 相关页面从 mock/static 状态接入真实后端 API，在保留既有
功能结构与交互方向的前提下，完成比赛列表、详情、创建、编辑、作废与恢复
流程，并为 loading、empty、error、validation 和 voided 状态提供明确反馈；
视觉处理遵循当前 `docs/DESIGN.md`。

## 2. 影响页面

### 2.1 In Scope

- `MatchesPage`（`/matches`）：移除 mock Match 数据，接入真实列表 API；保留并接入 Event、Team、EventStageTag 筛选与分页；V0 始终不显示作废 Match 或 archived/deleted Event 下的 Match，也不提供查看这些历史 Match 的筛选或开关。
- `MatchDetailPage`（`/matches/:id`）：移除 mock 详情数据，展示最终比分、Event、EventStageTag、参赛球队、球员 box score 与 Team Other Stats；支持进入编辑、作废及恢复操作。
- `CreateMatchPage`（`/matches/new`）：使用真实 Event、participant Team、EventStageTag 和 active roster 数据完成比赛录入；提交最终比赛记录，并展示字段级和业务级验证错误。
- `EditMatchPage`（`/matches/:id/edit`）：加载真实 Match；允许修改比赛时间、EventStageTag 和统计数据；所属 Event 与参赛球队只读；保留历史 inactive Player 数据。
- EventStageTag 为可选项；Match 表单只允许为 `ONGOING` 或 `COMPLETED` Event 录入，已归档或已删除 Event 不允许编辑或恢复。
- 选定双方 Team 后，统计表格自动陈列各队完整 active roster，并为每名 Player 提供“出场”勾选项，同时显示一个始终存在的 `Other` 行。
- Player 默认未出场；未勾选时统计输入禁用并显示为空，提交时不包含该 Player。勾选出场后各统计格初始为空、不预填 `0`，允许留空；评分允许输入 `0–10` 且最多一位小数，同样允许留空。留空的格子仅在构建提交 payload 时补 `0`，编辑期不自动填 `0`。
- 编辑 Match 时，已有 `MatchPlayerStat` 的 Player 自动标记为已出场；未出场 Player 不要求提交统计记录。`Other` 行始终参与提交，编辑期各格可留空，留空在提交时按 `0` 处理。
- Match 创建后如参赛 Team 被归档，编辑页仍允许修正历史记录，但 archived Team 一侧只显示详情中已有的 Player stats，并只允许保留、修改或移除这些行，不允许从 roster 新增 Player；Team 必须显示明确的 “Archived” 状态。
- 作废 Match 不提供列表入口，但仍可通过 `/matches/:id` 直接访问；详情页明确显示作废状态且内容只读，并提供恢复操作。恢复后才允许进入编辑；恢复时保留原 Match 已引用的 inactive Player。
- archived Team 不单独阻止 Match 恢复；只要该 Team 仍是 Event participant 且其他恢复条件满足即可恢复。
- Match 表单中的最终比分由当前录入的 Player points 与 Team Other Stats points 即时计算并展示，不提供独立比分输入。
- 前端不展示或维护比赛各节、加时状态或加时次数；当最终比分相同时阻止提交并显示验证反馈。
- 为上述页面补齐 loading、empty、not-found、error、submitting、success、voided 和只读状态。
- 沿用现有 Mantine、共享组件与 `apps/frontend/src/styles/variables.css` 语义设计 token，不引入新组件库或整体重构页面布局。

### 2.2 Out of Scope

- 新增 Match 之外的页面。
- 比赛各节、逐回合、实时比分、比赛时钟或加时流程 UI。
- 自动赛程、对阵生成或赛事晋级 UI。
- Players 排行榜、Player 详情、Standings 或其他统计页面接入。
- Team roster、Event、Event participant 或 EventStageTag 管理界面调整。
- Match 硬删除入口。
- 认证、授权、自动化测试、CI 与部署。

## 3. 组件变更

### 3.1 Feature 层

- 新增 `features/matches/api/matches.ts`：封装列表、form-options、详情、创建、编辑、作废、恢复 API，并复用项目统一 `ApiClientError` 响应结构。
- 扩充 `features/matches/types.ts`：定义 Backend PRD §5 的 list item、detail、form options、payload、pagination 和 error 类型。
- 不新增第三方状态管理或表单库；页面继续使用 React state/effect 与现有 Mantine 组件。

### 3.2 列表与详情组件

- 修改 `MatchesPage`、`MatchFilters`、`MatchHistoryList`、`MatchRecordCard`：移除 mock 数据，使用服务端分页和筛选；卡片继续展示实时计算后由 API 返回的比分。
- 修改 `MatchDetailPage`、`MatchScoreHeader`、`MatchBoxScoreTable`：接入详情 API，显示 Event、可选 StageTag、最终比分、Player stats、Other stats、作废状态与操作。
- 详情表格只展示实际存在 `MatchPlayerStat` 的出场 Player；不显示完整 roster。Other 行始终展示。
- Match 详情中的 Player 行严格使用 API 返回顺序，不再使用当前共享 `comparePlayerPositions` 做客户端二次排序；Match 的 position 顺序由 Backend PRD §3.15 统一定义为 `PG → SG → SF → PF → C → G → F`。本功能不要求改变其他既有页面的排序行为。

### 3.3 表单组件

- 复用 `MatchFormPage` 作为 create/edit 容器；移除 `mockMatchForm` 和 Edit 页的 mock detail 转换。
- 修改 `MatchInfoForm`：创建时选择 Event、可选 StageTag、HOME/AWAY Team 和比赛时间；编辑时 Event 与 Team 只读，StageTag 和比赛时间可修改。
- 修改 `MatchStatsInputTable`：选队后列出完整 active roster、出场 checkbox 和 Other 行；未出场行禁用；PTS、REB、AST、FGM、FGA、3PM、3PA、MIN 均为 `0–10000` 的整数输入（`min=0`、`max=10000`、`step=1`）；RTG 为 `0–10`、一步 `0.1`。
- 修改 `MatchFormActions`：支持 submitting disabled 状态，创建/保存成功后进入详情页。
- 使用现有共享 action button、panel、form control、table 和 token；仅在重复样式确实存在时做增量共享提取。

### 3.4 路由

- 将现有创建判断与所有入口从 `/matches/create` 统一改为 `/matches/new`。
- 保留 `/matches/:id` 和 `/matches/:id/edit`，其中 `id` 为后端正整数 Match id。

## 4. API 调用

| Action | Method + Path | When |
|--------|---------------|------|
| 加载 Match 列表与 filter options | `GET /api/matches?page=&pageSize=&eventId=&teamId=&stageTagId=` | 进入列表、翻页或筛选变化时 |
| 加载表单 Event 列表 | `GET /api/matches/form-options` | 进入创建页时 |
| 加载所选 Event 配置 | `GET /api/matches/form-options?eventId=:id` | 创建页选择 Event 后；返回 participants、StageTags 和 active rosters |
| 加载 Match 详情 | `GET /api/matches/:id` | 详情页与编辑页初始化时；允许返回作废 Match |
| 加载编辑所需 active roster | `GET /api/matches/form-options?eventId=:id` | 编辑页取得详情后；与详情中的历史 inactive Player 合并 |
| 创建 Match | `POST /api/matches` | 创建表单提交 |
| 编辑 Match | `PATCH /api/matches/:id` | 编辑表单提交完整统计快照 |
| 作废 Match | `POST /api/matches/:id/void` | 详情页确认作废后 |
| 恢复 Match | `POST /api/matches/:id/restore` | 作废详情页点击恢复并确认后 |

所有 effect 使用 `AbortController` 避免卸载或筛选快速变化后的过期响应覆盖当前状态。筛选变化时页码重置为 `1`。

## 5. UI 规格

### 5.1 MatchesPage

- **Route**: `/matches`
- **Layout**: 保留现有 header、filters、history list 和分页结构。
- **筛选**: Event、Team、StageTag 使用后端 id 作为值。可见 Match 定义为未作废且所属 Event 未归档、未删除。未选择 Event 时 Team 使用全部可见 Match 的 Team 选项，StageTag disabled；选择 Event 后 Team 与 StageTag 使用该 Event 对应选项。Event 改变时清空不再有效的 Team 和 StageTag。Team/StageTag 不反向改变 Event 或其他选项。
- **分页**: 每页 `10`，使用 API `pagination.totalItems`；不再对当前页结果做客户端二次分页。
- **作废可见性**: 页面无“显示作废”开关；API 永久排除作废 Match。
- **States**:
  - loading：列表区域显示 skeleton/loading，不清空已选筛选；
  - empty：显示“没有符合条件的比赛”及清除筛选操作；
  - error：显示可重试的 inline error；
  - success：卡片按 `playedAt DESC, id DESC` 展示。
- **Interactions**: “Create Match”进入 `/matches/new`；点击卡片进入 `/matches/:id`。

### 5.2 MatchDetailPage

- **Route**: `/matches/:id`
- **Layout**: 保留返回链接、score header 和双 Team box-score；显示 Event、StageTag（无则为 `—`）、playedAt。
- **Stats**: 展示出场 Player 和 Other 行；FG%/3P% 使用 API 计算值，`null` 显示 `—`；rating 固定一位小数。
- **正常 Match 操作**: 显示 Edit 和 Void。Void 使用 Mantine confirmation modal，确认成功后停留详情并切换为作废状态。
- **作废 Match 状态**: 即使列表无入口，直接 URL 仍可访问；显示醒目的 “Voided” status indicator、作废时间和 Restore 操作；隐藏 Edit/Void，所有内容只读。
- **不可见 Event 历史 Match**: Event 当前已 archived 或 deleted 时，Match 虽可通过直接 URL 查看，但详情作为历史只读视图，显示 Event 不可用原因并隐藏 Edit、Void、Restore；不得仅依据 `voidedAt` 将其当作可操作的正常 Match。
- **Restore**: 使用确认 modal；成功后刷新详情并恢复 Edit/Void。恢复失败保留当前页面，在 Restore confirmation/feedback 区域逐条展示后端 `message` 与全部 `details`。详情页不把 `event`、`teams[n].teamId` 或 `stageTagId` 错误映射为可编辑输入框。
- **States**: loading skeleton、404 not-found、通用 error + retry、void/restore submitting disabled、成功反馈。

### 5.3 CreateMatchPage / MatchFormPage

- **Route**: `/matches/new`
- **加载顺序**: 首先加载 eligible Events；选择 Event 后加载其 StageTags、participant Teams 和 active rosters，并清空先前 Event 的 Team/Stage/统计选择。
- **Fields**:
  - Event：必选，仅列 ONGOING/COMPLETED 且未归档/删除 Event；
  - Match date/time：必填，通过浏览器本地时区的 date-time 控件输入，不允许选择晚于当前时间的值；提交时使用标准 `Date` 转换为 UTC ISO 8601，不硬编码时区或固定 offset；
  - StageTag：可选，仅列所选 Event tags；
  - Home/Away Team：必选且不可相同，仅列 Event 中未归档 participant Teams；选队后自动显示完整 active roster。
- **Roster table**:
  - 每名 Player 默认“未出场”；统计单元格 disabled 且显示为空；
  - 勾选“出场”后启用 PTS、REB、AST、FGM、FGA、3PM、3PA、MIN、RTG，各格初始为空、不预填 `0`；
  - 取消“出场”时从待提交 `playerStats` 中移除；再次勾选重新以全空初始化，避免隐藏旧值误提交；
  - 每队至少勾选一名 Player；
  - Other 行始终启用并完整提交 PTS、REB、AST、FGM、FGA、3PM、3PA 七个必填整数；MIN、RTG 对 Other 始终不适用，不显示也不提交；Other 行不显示出场 checkbox；
  - PTS、REB、AST、FGM、FGA、3PM、3PA、MIN 只允许 `0–10000` 的整数，输入控件使用 `min=0`、`max=10000`、`step=1`；RTG 允许 `0–10` 且最多一位小数；
  - FG%、3P% 和 Team score 即时计算，仅展示不提交。
- **Validation**: 提交前执行与 Backend PRD §6 相同的可本地判断规则，包括 made/attempted 关系和比分不可相同；前端验证用于即时反馈，后端仍为权威。
- **Submit**: 仅提交勾选 Player 与 Other；submitting 时禁用重复提交。成功进入 `/matches/:id`；失败保留所有输入并将 `details[].field` 映射到字段/行，无法映射的错误显示在表单顶部。
  - submitting disabled 只防止当前页面的普通重复点击；MVP 不执行跨请求重复 Match 检测。误录记录由用户在详情页 Void。
  - 错误路径严格使用 Backend PRD §7：顶层字段直接映射；`teams[n]` 映射 Team 区域；`teams[n].playerStats[m]` 映射原始请求索引对应的 Player 行；`teams[n].otherStats` 映射 Other 行；`form` 显示在表单顶部。
  - 前端提交时必须保留 payload 数组索引与错误映射上下文，不能依赖 Player 名称或 slug 定位错误。未知或无法识别的 `field` 作为表单顶部错误显示，不得丢弃。
- **States**: form-options loading/error/retry、Event 无可用项、Event 无可用 participants、Team 无 active roster、submitting、success。

### 5.4 EditMatchPage

- **Route**: `/matches/:id/edit`
- 先加载详情，再加载该 Event form-options；Event 和 HOME/AWAY Team 显示为只读，不允许换队或换 role。
- active roster 全部列出；详情中已有统计的 inactive Player 也追加到原 Team 表格，标记 “Inactive”，并默认勾选出场。
- 若某一参赛 Team 已归档，则该 Team 不依赖 form-options roster，只使用 Match 详情中的已有 Player stats 构建表格；显示 “Archived” 状态，不提供新增 Player 行。另一侧未归档 Team 仍使用 active roster 与历史统计合并规则。
- 已有 `MatchPlayerStat` 初始化为勾选及其已保存值；当前 active roster 中无统计者初始化为未出场；Other 使用已保存值。
- 允许勾选新的 active Player、修改或取消已有 Player；inactive Player 只能对既有行保留、修改或取消，不能新增其他 inactive Player。
- 作废 Match 或 Event 当前不可编辑时，不渲染可提交表单，显示原因及返回详情操作；直接访问 edit URL 也必须遵守。
- PATCH 成功进入详情；validation、submitting、error 行为与创建页一致。
- MVP 接受 last-write-wins；Frontend 不发送 `updatedAt`、version 或 ETag，也不显示并发冲突提示。成功后以 PATCH 返回或重新加载的最新详情为准。
- 编辑加载时将 API UTC `playedAt` 转换为浏览器本地 date-time 控件值，同时保留原始 ISO 值。用户未修改时间字段时 PATCH 原样发送原始 ISO；只有字段实际改变时才从本地控件值生成新 UTC 时间，避免控件精度造成秒或毫秒漂移。

### 5.5 响应式与可访问性

- 保留现有桌面双栏与窄屏堆叠行为；宽统计表使用横向滚动，不压缩到不可编辑宽度。
- checkbox、输入框、操作按钮和 modal 均提供可辨识 label；disabled 状态不能只靠颜色表达。
- 作废、inactive、错误状态使用现有语义 status tokens；不得在页面 CSS 硬编码新的状态颜色、字体、圆角或重复阴影。
- 列表和详情将 API UTC 日期时间按浏览器本地时区展示；夏令时使用浏览器内置时区规则，不硬编码 `Australia/Sydney` 或其他固定 offset。

## 6. 与 Backend PRD 的接口约定

1. 前端严格使用 Backend PRD §5 字段名，不发送 `slug`、比分、百分比、`voidedAt` 或其他派生/只读字段。
2. Create payload 的 `teams` 始终是 HOME/AWAY 两项完整快照；Patch 发送既有 teamId/role 和完整统计快照，后端验证其不可变。
3. 未勾选 Player 不出现在 `playerStats`；勾选 Player 的各项统计（含 `rating`）在提交时把留空补为 `0`，因此 `playerStats` 始终为数值，不得发送 `null`。Other stats 必须完整发送 PTS、REB、AST、FGM、FGA、3PM、3PA 七个整数（留空同样补 `0`），不含 `minutes` 或 `rating`。
   - `playerStats` 和 `otherStats` 均不发送独立 `teamId`；其 Team 归属由外层 `teams[n].teamId` 唯一确定。
4. 前端 Team score = Player points 总和 + Other points，仅作即时预览；保存后的列表和详情以 API 重新计算结果为准。
5. `stageTagId` 未选择时发送 `null`；`playedAt` 发送带时区 ISO 8601 字符串；所有实体 id 发送 number。
6. Edit 将 form-options 的 active roster 与详情中已有 Player stats 合并；不得因 Player inactive 丢弃历史统计行。
   - Match 详情的 Team 摘要使用 `archivedAt` 判断 archived 状态；archived Team 一侧不合并或新增 roster Player，只保留详情中已有统计行。
7. `voidedAt !== null` 是 Match 自身作废状态的唯一标识；列表不请求、不展示作废 Match。详情页是否只读还必须结合 Event 的 `archivedAt`、`deletedAt` 和允许状态判断：不可用 Event 下的历史 Match 只读且不显示 Match 操作。
8. API error 统一按 `{ statusCode, error, message, details }` 处理：
   - `400 VALIDATION_ERROR` 和 `422` 业务错误保留输入并显示字段/表单错误；
   - `404 MATCH_NOT_FOUND` 显示 not-found；
   - `MATCH_VOIDED` 将编辑页导回详情并刷新状态；
   - `MATCH_ALREADY_VOIDED`、`MATCH_NOT_VOIDED` 视为状态已变化，刷新详情；
   - 网络/500 错误显示通用可重试反馈。
9. 页面不依赖 Event 的 `awardCandidatePlayers` 作为 Match roster；Match 表单使用专用 `/api/matches/form-options` 契约。
