# Event Management Frontend PRD

## 1. 目标

将现有 Event 页面和组件从 mock/static 状态接入真实后端 API，使管理员可以在前端完成赛事列表查看、赛事详情查看、赛事创建、赛事编辑、赛事归档、最终球队结果录入和球员奖项录入。前端应复用当前 sports-console / analytics 风格和已有 Event 页面结构，把 Event 相关配置、结果和奖项集中在 Event 管理流程中，但用独立 outcomes 页面承载结果和奖项录入，避免 Event 编辑页过长。前端不得发送 `slug`、`rankingOrder` 或任何派生统计字段。Event 的赛事流程状态只使用 `PREPARING`、`ONGOING`、`COMPLETED`；归档状态只由 `archivedAt != null` 表示，前端不得提交 `ARCHIVED` 作为 `status`。

## 2. 影响页面

含 (in scope):
- Events 列表页 `/events`
  - 从 `GET /api/events` 读取真实 Event 列表。
  - 移除 `mockEvents` 作为主要数据源。
  - 仅展示未归档 Event；本 MVP 不提供 archived Event 列表、tab 或 filter。
  - 只展示 Event 名称、tier、status、参与球队数量、冠军和赛事简介 `description`。
  - 不展示完整 StageTag 列表。
  - 不展示完整 ResultTag 列表；除冠军外，其他结果标签只在 Event 详情页展示。
  - 提供进入 Event 创建页 `/events/new` 的入口，例如 `Create Event`。
  - 支持 loading / error / empty 状态。
- Event 详情页 `/events/:slug`
  - 从 `GET /api/events/:slug` 读取真实 Event 详情。
  - 展示基础信息、参与球队、阶段标签、结果标签、最终球队结果和球员奖项。
  - 最终球队结果使用现有结果表组件思路接入真实数据。
  - 球员奖项以紧凑摘要区展示，包含 Event MVP、All-event First Team、All-event Second Team；无数据时显示 empty state。
  - 提供进入 Event 编辑页的入口，例如 `Edit Event`。
  - 提供进入 outcomes 管理页的入口，例如 `Manage Results & Awards`。
  - `COMPLETED` Event 的 outcomes 入口改为只读查看语义；如需修正，必须先在 Edit Event 中将状态改回 `ONGOING`。
- `archivedAt != null` 的 Event 可通过直接详情 URL 查看但不可编辑；本 MVP 不从 `/events` 列表提供 archived Event 入口。
- archived Event 详情页隐藏编辑入口，将可修改的 `Manage Results & Awards` 替换为只读 `View Results & Awards` 入口，以便查看历史 outcomes。
- Event 创建页 `/events/new`
  - 使用受控表单创建 Event。
  - status 固定显示为 `PREPARING` 且不可编辑；创建 payload 不发送 `status`。
  - 支持基础信息、参与球队选择、阶段标签编辑、结果标签编辑；球队结果和球员奖项在创建时可为空。
  - 提交 `POST /api/events`，成功后跳转到 `/events/:slug`。
- Event 编辑页 `/events/:slug/edit`
  - 读取真实 Event 详情并预填表单。
  - 支持编辑基础信息、参与球队、阶段标签和结果标签。
  - StageTag 只在 Event 配置中创建和管理，后续由 Match Entry 使用。
  - ResultTag 在 Event 配置中创建和管理，后续由 outcomes 页面使用。
  - 提交 `PATCH /api/events/:slug`。
  - 支持归档 Event，调用 `POST /api/events/:slug/archive`。
  - 状态通过明确操作转换：PREPARING 提供 `Start Event`，ONGOING 提供 `Complete Event`，COMPLETED 提供带确认的 `Reopen Event`。
  - Start/Complete 只能基于后端已保存的配置与 outcomes 执行。若配置表单存在未保存修改，前端必须先原子保存配置并等待成功，再以仅包含 `status` 的独立 PATCH 执行转换；配置保存失败时不得继续转换状态。
- Event outcomes 管理页 `/events/:slug/outcomes`
  - 入口放在 Event 详情页。
  - 读取真实 Event 详情并展示当前参与球队、ResultTag、球队结果和球员奖项。
  - 只负责使用已存在的 ResultTag 记录 EventTeamResult。
  - 同页管理 EventPlayerAward。
  - 不创建或编辑 StageTag / ResultTag；需要修改标签时返回 Event 编辑页。
  - 提交 `PATCH /api/events/:slug/outcomes`。
- Event API client
  - 新增 `fetchEvents()`、`fetchEvent(slug)`、`createEvent(data)`、`updateEvent(slug, data)`、`updateEventOutcomes(slug, data)`、`archiveEvent(slug)`。
- 参与球队选择
  - 使用现有 Team API 的 active team 数据作为候选项；active Team 必须未归档并具有有效 Division，不得允许选择 archived Team 或缺少有效 Division 的 Team。
  - `GET /api/teams` 返回 `divisions[].teams[]` 分组结构；EventForm 将其展开为内部 `TeamOption[]`，保留 `teamId`、`teamSlug`、`teamName`、`divisionId`、`divisionName`。
  - 编辑模式同时将 `GET /api/events/:slug` 的既有 participants 合并到 `TeamOption[]`。既有但已 archived 或缺少有效 Division 的 Team 显示 `Archived` / `Unavailable` 标记，可以保留或尝试移除，但不能作为新 participant 添加。
  - 选择器底层值使用 `teamId`，UI 可按 Division 分组展示；提交时只发送扁平的 `participantTeamIds: number[]`。
  - 保持 API 返回的 Division 和 Team 顺序，不额外按名称重排；不新增 Event 专用 Team candidates API。
- 最终球队结果录入
  - 对参与球队选择 result tag 和可选 notes。
  - 同一 Event 只能有一个参与球队选择 winner ResultTag 作为 champion；非 winner ResultTag 可以被多个球队选择。
  - 不同 Event 可采用不同赛制；前端通过该 Event 的 ResultTag 表达最终成绩分类，不设计全局固定名次。
  - outcome 展示排序使用 ResultTag 的 `sortOrder` 作为成绩分类顺序，不提供具体 Team rank 输入。
  - `PREPARING` / `ONGOING` Event 允许部分参与球队暂无结果；`COMPLETED` Event 必须让所有参与球队都有结果。
  - 没有 TeamResult 表示未录入，不表示 0 分；0 分成绩也应选择一个 0 分 ResultTag。
  - 结果数据保存在 EventTeamResult，不在前端计算或存储 team totalPoints。
- 球员奖项录入
  - 支持选择 Event MVP、All-event First Team、All-event Second Team。
  - 候选球员来自 Event 参与球队的 active roster。
  - outcomes 页提供 Team 筛选；默认显示全部参与球队的 active players，选择某个 Team 后只显示该 Team 的 active players。
  - First Team 与 Second Team 互斥：已入选其中一个阵容的球员在另一个阵容选择器中禁用；MVP 可以与任一阵容奖项重叠。
  - 奖项区域需要保持紧凑，避免把详情页或编辑页变成冗长的全局奖项管理页面。
- 错误处理
  - 映射后端统一 error shape。
  - `details[].field` 映射到表单字段。
  - 非字段错误显示为页面级或表单级错误。

不含 (out of scope):
- Match 创建页或 Match 表单接入 Event。
- Standings、leaderboards 或统计页面接入 Event 结果。
- Season 管理 UI。
- Event unarchive / restore UI。
- Event hard delete UI。
- 独立 Awards 页面或全局荣誉墙页面。
- 在 outcomes 页面创建或编辑 StageTag / ResultTag。
- 引入新的 UI component library。
- 对全站导航、Teams、Players、Matches 页面做无关 redesign。

## 3. 组件变更

### 3.1 API client

新增或补齐 `apps/frontend/src/features/events/api/events.ts`：
- `fetchEvents()`
- `fetchEvent(slug)`
- `createEvent(data)`
- `updateEvent(slug, data)`
- `updateEventOutcomes(slug, data)`
- `archiveEvent(slug)`

Event API/domain 类型中的 `status` 必须直接使用后端枚举值 `PREPARING | ONGOING | COMPLETED`。不得保留小写 status domain 类型，也不得由各页面零散调用 `toLowerCase()` / `toUpperCase()` 进行转换。

需要复用统一 API error shape：

```json
{
  "statusCode": 422,
  "error": "ERROR_CODE",
  "message": "Human-readable description.",
  "details": []
}
```

### 3.2 Event 列表组件

修改现有 `EventsList` 及相关 card 组件：
- 不再读取 `mockEvents`。
- 接收后端 `events` 数据。
- 每个 Event card 只展示：名称、tier、status、参与球队数量、冠军、description 摘要。
- 不展示完整 StageTag / ResultTag 列表。
- 除冠军外，其他结果标签只在 Event 详情页展示。
- `EventStatusBadge` 及其他 status 组件接收大写枚举值，并仅在展示层通过集中 label 映射显示 `Preparing`、`Ongoing`、`Completed`。

### 3.3 Event 详情组件

修改 `EventDetailPage` 及其子组件：
- 从 URL slug 调用 `fetchEvent(slug)`。
- 展示 Event 基础信息、参与球队、StageTag、ResultTag、最终球队结果、球员奖项。
- 提供 `Edit Event` 入口到 `/events/:slug/edit`。
- 提供 `Manage Results & Awards` 入口到 `/events/:slug/outcomes`。
- `archivedAt != null` 的 Event 可查看；隐藏编辑入口，但保留只读 `View Results & Awards` 入口，不得显示可修改语义的 outcomes 操作。
- `COMPLETED` Event 仍可进入 outcomes 页查看历史结果，但不得直接修改；管理入口应使用只读文案或状态提示。

### 3.4 EventForm

修改现有 `EventForm`：
- 从内部 mock 状态改为受控或页面层可收集状态。
- 创建/编辑 Event 配置：基础信息、参与球队、StageTag、ResultTag。
- ResultTag 编辑器使用列表顺序表达 `sortOrder`，优先提供上移/下移操作；不要求用户直接手填 sortOrder 数字。
- 不负责 EventTeamResult 或 EventPlayerAward。
- 不发送 `slug`、`rankingOrder`、`teamResults`、`playerAwards`。
- 编辑模式必须保留 API 返回的既有 unavailable participants，避免因其不在 active Team 候选列表中而从完整替换 payload 误删。

### 3.5 EventOutcomesPage

新增 `/events/:slug/outcomes` 页面：
- 更新 `apps/frontend/src/app/App.tsx` 的手写 path matching，确保 `/events/:slug/outcomes` 渲染 EventOutcomesPage。
- 从 `fetchEvent(slug)` 读取当前 Event、participants、ResultTag、teamResults、playerAwards。
- 使用已存在 ResultTag 录入每个参与球队的最终结果。
- 管理 Event MVP、All-event First Team、All-event Second Team。
- 不创建或编辑 StageTag / ResultTag。
- 如果需要修改 ResultTag，提供返回 `/events/:slug/edit` 的入口。

### 3.6 EventOutcomesForm

新增 outcomes 表单组件：
- Team results section：按参与球队列出，选择 result tag 和 notes。
- Awards section：选择 MVP、First Team、Second Team。
- First Team 与 Second Team 的球员选择互斥；在另一阵容中禁用已选球员，但不得因球员已被选为 MVP 而禁用。
- 候选球员来自 `GET /api/events/:slug` 返回的 `awardCandidatePlayers`，仅包含参与球队的 active players。
- 前端将既有 `playerAwards` 合并到 Awards 控件的展示数据中。既有但已 inactive 的获奖球员显示 `Inactive` 标记，可原样保留或移除，但不得被新选入其他奖项；移除后也不能在 inactive 状态下重新添加。
- 提供 Team 筛选；默认显示全部参与球队的 active players，选择某个 Team 后只显示该 Team 的 active players。
- Team 筛选只影响新增候选项的可见性，不隐藏、取消或删除已选奖项；完整替换 payload 始终包含所有 Team 的当前奖项状态。
- 表单提交调用 `updateEventOutcomes(slug, data)`。
- `teamResults` / `playerAwards` 作为各自区块的完整当前状态提交；显式空数组表示用户清空该区块，字段省略表示不修改该区块。
- Event 详情尚未成功加载时禁止保存，不能把未加载数据误当成空数组提交。
- 后端字段错误映射到对应 row/field。

## 4. API 调用

| Action | Method + Path | When |
|--------|--------------|------|
| 读取 Event 列表 | `GET /api/events` | `/events` 页面加载 |
| 读取 Event 详情 | `GET /api/events/:slug` | 详情页、编辑页、outcomes 页加载 |
| 创建 Event | `POST /api/events` | 创建页提交 |
| 更新 Event 配置 | `PATCH /api/events/:slug` | 编辑页提交 |
| 更新结果和奖项 | `PATCH /api/events/:slug/outcomes` | outcomes 页提交 |
| 归档 Event | `POST /api/events/:slug/archive` | 编辑页确认归档 |
| 读取 Team 候选项 | `GET /api/teams` | 创建页、编辑页选择参与球队 |

## 5. UI 规格

### 5.1 EventsPage `/events`

- **Layout**: 复用现有 events 页面布局和 sports-console 风格。
- **Primary action**: 页面顶部提供 `Create Event`，跳转 `/events/new`。
- **Card fields**:
  - `name`
  - `tier`
  - `status`
  - participating team count
  - champion summary
  - `description` 摘要
- **Do not show**:
  - 完整 StageTag 列表
  - 完整 ResultTag 列表
  - 非冠军结果标签
  - 球员奖项
- **States**:
  - Loading: compact skeleton rows/cards
  - Empty: 提示暂无 Event，并提供创建入口
  - Error: 页面级错误和 retry

### 5.2 EventDetailPage `/events/:slug`

- **Layout**: 详情页展示完整 Event 信息，但保持高密度分区。
- **Sections**:
  - Header: name、tier、status、description、participant count、champion
  - Participants
  - Stage tags
  - Result tags
  - Team results
  - Player awards
- **Actions**:
  - `Edit Event` 跳转 `/events/:slug/edit`
  - `Manage Results & Awards` 跳转 `/events/:slug/outcomes`
- **Archived behavior**:
  - 当 `archivedAt != null` 时显示 archived banner
  - 隐藏编辑入口，将 outcomes 入口显示为只读 `View Results & Awards`
  - 历史内容仍可查看
- **States**:
  - Loading
  - `EVENT_NOT_FOUND`: not-found 状态，提供返回 `/events`
  - Error: 页面级错误和 retry

#### Player Awards presentation

- Event Detail 按 `docs/PLAYER_AWARDS_COMPONENT_DESIGN.md` 渲染 Player Awards；该文档是组件级视觉 SOT。
- MVP、First Team 和可选 Second Team 都展示 API 返回的 `playerPosition`。
- Position 只用于展示；前端不得根据数组顺序、award type 或阵容格位置推导球员位置。
- First Team 与 Second Team 直接使用后端稳定顺序；位置顺序为 `PG`、`SG`、`G`、`SF`、`PF`、`F`、`C`，前端不再次排序。
- Jelly Mint 是组件的主要结构强调色；金色仅用于 Trophy 图标和紧凑 `MVP` 标记。

### 5.3 EventFormPage `/events/new` 与 `/events/:slug/edit`

- **Create mode**:
  - 默认 `tier = B`
  - 默认 `countsForRanking = true`
  - status 固定为 `PREPARING`，只读显示 `Preparing`，不提供 status 输入控件
  - 创建 payload 不发送 `status`
  - 可配置基础信息、参与球队、StageTag、ResultTag
  - 创建成功跳转 `/events/:slug`
- **Edit mode**:
  - 加载 Event 详情并预填
  - 可编辑基础信息、参与球队、StageTag、ResultTag
  - PREPARING 状态提供 `Start Event`，只允许转换为 `ONGOING`；没有 participant 时禁用并引导先添加球队
  - ONGOING 状态提供 `Complete Event`，至少有 1 个 participant 且结果完整时才允许转换为 `COMPLETED`；不提供回退到 PREPARING
  - Start/Complete 发起前若配置表单有未保存修改，先调用配置 PATCH 并等待成功，再发送仅包含目标 `status` 的 PATCH；任一请求失败时停止后续操作并保留表单状态
  - COMPLETED 状态下配置表单只读，提供带确认提示的 `Reopen Event`，只允许转换为 `ONGOING`；不提供回退到 PREPARING
  - reopen 请求只发送 `{ "status": "ONGOING" }`，不得夹带其他配置；成功后重新加载 Event，恢复配置和 outcomes 编辑
  - 不编辑结果和奖项
  - 保存成功跳转 `/events/:slug`
  - 直接访问 archived Event 的 edit URL 时仍加载并展示 Event 信息和 archived banner，但整个表单只读，隐藏保存与归档操作，并提供返回详情页入口
- **Archive**:
  - 编辑页提供归档入口
  - 使用 inline confirmation
  - PREPARING、ONGOING 和 COMPLETED Event 都可归档；对 ONGOING 或 outcomes 不完整的 Event，确认文案明确说明归档会保留当前不完整状态
  - 成功后跳转 `/events`
- **Validation feedback**:
  - 本地做基础必填/类型提示
  - 后端 `details[].field` 映射到对应输入
  - 删除已有 StageTag、ResultTag 或 participant 前可以提供轻量确认；前端不得假定配置未被引用，后端引用检查是最终依据
  - `STAGE_TAG_IN_USE`、`RESULT_TAG_IN_USE` 或 `EVENT_PARTICIPANT_IN_USE` 时保留全部表单输入，并提示本次配置保存未应用任何变更

### 5.4 EventOutcomesPage `/events/:slug/outcomes`

- **Route**: `/events/:slug/outcomes`
- **Entry**: 从 Event 详情页进入。
- **Routing implementation**: 需要在 `App.tsx` 中新增 `/events/:slug/outcomes` matcher；本项目当前不是完整 React Router route table。
- **Layout**:
  - 顶部使用项目标准 workspace eyebrow、page title 和 summary 结构，标题为 `Results & Awards`，Event name 放在 summary 中。
  - 可编辑状态使用标准 `Save Changes` primary action 与 `Cancel` secondary action；`Cancel` 返回 Event 详情页。
  - 保存使用表单 submit 语义。成功后必须显示明确的保存成功反馈，失败时保留当前输入并显示错误。
  - Results section 使用紧凑表格
  - Awards section 使用按奖项类型分组的选择控件
- **Team results controls**:
  - Team name: read-only
  - Result tag select: options 来自当前 Event 的 ResultTag
  - Winner result tag 最多只能分配给一个 Team；Semifinalist、Quarterfinalist、Participant 等非 winner result tag 可重复分配给多个 Team
  - Notes: optional textarea/input
- **Awards controls**:
  - Team filter: 可选择全部参与球队或单个参与球队。
  - Event MVP: 单选 player
  - All-event First Team: 最多 5 个 player
  - All-event Second Team: 最多 5 个 player
  - Player options 来自 `awardCandidatePlayers`，只包含 active players
  - 既有 `playerAwards` 中的 inactive player 作为带 `Inactive` 标记的保留项展示，不进入正常候选项；其奖项只能原样保留或移除
  - First Team 与 Second Team 互斥选择；MVP 可与 First Team 或 Second Team 重叠
  - 奖项计数 badge 使用主强调色背景和 on-accent 黑色文字，必须满足可读性要求。
- **Rules**:
  - 不创建或编辑 ResultTag；需要变更标签时引导去 Edit Event。
  - 不显示 StageTag 编辑控件。
  - Team results 展示排序按 `resultTag.sortOrder ASC`、`resultTag.rankingPoints DESC`、`teamName ASC` 稳定排序；未录入结果的 participant 放在最后并显示未录入状态。
  - `EVENT_RESULTS_INCOMPLETE` 发生在 Event 编辑页尝试将最终状态设为 `COMPLETED` 时，显示为状态/结果完整性错误并引导返回 outcomes 页补全结果。
  - 保存调用 `PATCH /api/events/:slug/outcomes`。
  - `PREPARING` / `ONGOING` Event 可以修改或清空 outcomes。
  - `COMPLETED` Event 以只读方式展示 outcomes，禁用保存，并提示必须先在 Edit Event 中 reopen 为 `ONGOING` 才能修正。
- **States**:
  - Loading
  - Empty participants: 提示需先在 Edit Event 中添加参与球队，禁用 Results 和 Awards 控件，并提供返回编辑页入口
  - Empty result tags: 提示需先在 Edit Event 中创建 ResultTag，仅禁用 Results 区块；Awards 区块在有候选球员时仍可使用
  - Empty award candidates: 提示参与球队当前没有 active players，禁止新增奖项；若存在既有 inactive player awards，Awards 区块仍可用于原样保留或移除这些历史项。Team results 仍可编辑
  - Legacy/inconsistent completed Event with missing results: 只读显示缺失警告；必须先 reopen 为 `ONGOING`，补全结果后才能重新完成
  - `status = COMPLETED`: results 和 awards 只读，提供进入 Edit Event 的入口以执行 reopen
  - `archivedAt != null`: 以只读方式展示已有 team results 和 player awards，禁止保存，并提供返回详情页入口
  - Error: 页面级错误和 retry
  - 各区块独立降级：某一区块缺少数据时，不阻止其他仍满足条件的区块操作

### 5.5 Visual Requirements

- 复用现有 Mantine + CSS 结构，不新增 UI component library。
- 保持深色 analytics / sports-console 风格。
- 表格和表单保持紧凑，避免大面积营销式 hero。
- 移动端需要避免按钮文字溢出、表格挤压和 section 重叠。
- outcomes 页面可以使用 tabs 或分区，但不要创建全局 Awards 页面。

## 6. 与 Backend PRD 的接口约定

- `GET /api/events/:slug` 返回使用既有 `PlayerPosition` 值的 `playerAwards[].playerPosition`。
- Event Detail 直接消费该字段显示奖项球员位置，不持久化或推导 award-specific position。
- 前端不得发送 `slug`、`rankingOrder`。
- 前端 Event API/domain 类型、状态比较和请求 payload 统一使用 `PREPARING | ONGOING | COMPLETED`；展示文本通过集中 label 映射生成，不维护小写 domain 类型。
- Event slug 由后端创建时生成且不可变；前端编辑 Event name 后仍使用原 slug 跳转和调用 API。
- 前端不得发送派生统计字段，例如 `totalPoints`、standings rank、player averages。
- Event 列表页使用 `GET /api/events` 返回的 champion summary，不在前端重新推导完整结果。
- 尚无 champion 时后端稳定返回 `champion: null`，前端显示未产生冠军的空状态，不将字段缺失视为另一套契约。
- Event 详情页、编辑页和 outcomes 页都使用 `GET /api/events/:slug` 作为单个 Event 的权威数据源。
- Event 详情中的 participants、award candidates、tags、team results 和 player awards 使用 Backend PRD 定义的稳定顺序；前端不得使用相互冲突的默认排序覆盖后端顺序。
- `GET /api/teams` 返回按 Division 分组的数据；参与球队候选项只使用未归档且具有有效 Division 的 Team，后端仍负责最终资格校验。
- EventForm 必须将 `divisions[].teams[]` 展开为保留 Team 与 Division 标识的 `TeamOption[]`；选择状态使用 `teamId`，请求 payload 只发送 `participantTeamIds`。前端可按 Division 分组渲染，但不得改变 API 内既有分组和球队顺序。
- `participants[].isEligible`、`teamArchivedAt` 和 Division 信息用于合并及标记既有 unavailable participant。该 Team 可原样保留；移除时仍由后端检查历史引用；前端不得允许将已移除的 unavailable Team 重新选入。
- outcomes 页使用 `awardCandidatePlayers` 展示和筛选待选球员；前端不额外请求独立 Player CRUD 接口。
- `awardCandidatePlayers` 只提供 active 新增候选项；前端必须同时读取 `playerAwards[].playerIsActive`，将既有 inactive 获奖球员合并为保留项，避免 reopen 后保存时误删历史奖项。
- 奖项候选中 active player 与后端定义一致：`Player.isActive = true` 且 Player 当前 Team 为当前 Event 的既有 participant；该 Team 后续归档或失去有效 Division 不会单独排除其 active players。
- `PATCH /api/events/:slug` 只提交 Event 配置字段：
  - `name`
  - `tier`
  - `status`，仅用于 Backend PRD 定义的合法状态转换
  - `description`
  - `countsForRanking`
  - `participantTeamIds`
  - `stageTags`
  - `resultTags`
- `POST /api/events` 不发送 `status`，后端固定创建为 `PREPARING`。
- 前端只暴露 `PREPARING → ONGOING`、`ONGOING → COMPLETED`、`COMPLETED → ONGOING` 三种转换；不提供任何回到 `PREPARING` 的操作。
- `ONGOING → COMPLETED` 时后端基于 participants 和 TeamResults 执行完整性检查；`EVENT_RESULTS_INCOMPLETE` 引导用户先补全 outcomes。
- `PREPARING → ONGOING` 和 `ONGOING → COMPLETED` 都至少需要 1 个 participant；无 participant 时前端禁用对应操作，`EVENT_PARTICIPANTS_REQUIRED` 作为后端最终校验。
- COMPLETED Event 的配置和 outcomes 均只读；reopen 必须由用户确认，且请求只能包含 `{ "status": "ONGOING" }`，前端不得自动回退状态或夹带其他字段。
- `stageTags`、`resultTags`、`participantTeamIds` 只有在请求中出现时才执行完整替换；省略表示不修改，显式空数组表示尝试清空。若任一删除项存在历史引用，后端拒绝整个请求，前端不得将其他变更视为已保存。
- StageTag / ResultTag 的 slug 由后端创建时生成且不可变；前端编辑 label 后不应假设 slug 会变化。
- `PATCH /api/events/:slug/outcomes` 只提交：
  - `teamResults`
  - `playerAwards`
- outcomes 中字段省略表示不修改对应集合，显式 `teamResults: []` 或 `playerAwards: []` 表示清空对应集合。页面数据未成功加载前必须禁用保存，避免将未加载状态误提交为空集合。
- 前端字段错误映射沿用后端 `details[].field`：
  - `name`
  - `participantTeamIds[0]`
  - `stageTags[0].label`
  - `resultTags[0].rankingPoints`
  - `teamResults[0].resultTagId`
  - `playerAwards[0].playerId`
- 前端必须支持同时展示同一次响应中的多个 `details`，并将完整数组路径映射到对应 row 和 input；不得只显示第一条字段错误。
- `details` 为空或无法映射到具体输入的错误显示为页面级或对应配置、结果、奖项区块级错误。
- 当 Event 详情返回 `archivedAt != null` 或后端返回 `EVENT_ARCHIVED` 时，编辑页和 outcomes 页显示只读/不可编辑状态。
- archived Event 的 edit/outcomes 直接 URL 必须保留历史内容展示：edit 页隐藏保存与归档操作，outcomes 页隐藏保存操作，两者都显示 archived banner 并提供返回详情页入口。
- participants、ResultTag 或 award candidates 为空时按区块独立处理：无 participants 时 Results/Awards 均不可用；无 ResultTag 时只禁用 Results；无 award candidates 时禁止新增 award，但既有 inactive awards 仍可原样保留或移除。
- `EVENT_RESULTS_INCOMPLETE` 显示为 outcomes/results 区块级错误，提示用户已完成赛事必须为所有参与球队录入最终 ResultTag。
- `EVENT_COMPLETED` 显示为 outcomes 页面级只读提示，引导用户先在 Edit Event 中将状态改回 `ONGOING`；前端不得自动回退状态。
- `INVALID_EVENT_STATUS_TRANSITION` 显示在 Event 状态操作区，重新加载 Event 当前状态并提示该转换不被允许。
- `EVENT_PARTICIPANTS_REQUIRED` 显示在状态操作区，提示用户先在 Event 配置中添加至少一个 participant。
- `RESULT_TAG_IN_USE`、`STAGE_TAG_IN_USE`、`EVENT_PARTICIPANT_IN_USE` 显示为配置区块级错误，提示用户该配置已有历史引用。
- `RESULT_TAG_WINNER_CONFLICT` 和 `CHAMPION_RESULT_CONFLICT` 映射到 ResultTag/Results 区块及对应 winner 字段，提示每个 Event 只能有一个 winner tag 和一个 champion team。
- `AWARD_LIMIT_EXCEEDED`、`DUPLICATE_PLAYER_AWARD` 和 `DUPLICATE_EVENT_RESULT` 必须映射到对应 Awards/Results row；存在 `details[].field` 时优先按完整数组路径定位。
- `AWARD_TEAM_CONFLICT` 映射到 Awards 区块及对应 player 字段，提示同一球员不能同时入选 First Team 与 Second Team；MVP 不受此互斥限制。
- `PLAYER_INACTIVE` 映射到对应 award row，提示 inactive player 的既有奖项只能原样保留或移除，不能新增、重新添加或修改。
- Event 配置或 outcomes 保存均按后端事务原子提交；请求失败时前端保留当前表单输入，不得将部分内容视为已保存。
- `mockEvents` 退出主要数据流；若实施期间临时保留用于局部开发，其 status 值也必须同步改为大写枚举，避免形成第二套契约。
