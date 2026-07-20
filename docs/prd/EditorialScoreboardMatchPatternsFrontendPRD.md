# Editorial Scoreboard Match Patterns Frontend PRD

> 阶段定义：本 PRD 属于 [Editorial Scoreboard 迁移 PRD 索引](./EditorialScoreboardMigrationIndex.md)
> 的 **M5 — Match Patterns**。

## 1. 目标

将现有 Matches Overview、Match Detail 与 Match Create/Edit 迁移到已批准的 Editorial
Scoreboard 视觉语言：列表使用 Scoreline Rail，详情使用 Arena Scoreline，技术统计使用
M2 Data Bays，创建与编辑使用紧凑的 Match Editor 数据录入组合和实时 Team score。
迁移必须复用 M1 Shared Primitives、M2 Data Display 与 M3 Team Artwork，保留当前
路由、字段、筛选、数据录入、比分计算、Void/Restore、只读边界和请求行为；本轮不新增
Match 功能或改变业务语义。

## 2. 影响页面与范围

文档权威：

- `docs/DESIGN.md` 是 Scoreline Rail、Arena Scoreline 与 Match Editor 的视觉 SOT。
- 本 PRD 只拥有 M5 的实施范围、接入边界和验收目标，不复制第二套 token 或视觉值。
- 本 PRD 补充而不取代 `MatchManagementFrontendPRD.md`；现有 feature PRD 继续拥有
  页面能力、字段含义、路由、查询、分页、数据录入、validation、Void/Restore 与
  unavailable 行为。
- `MatchManagementBackendPRD.md` 继续拥有数据、API、比分计算、排序、eligibility、
  validation 与错误规则。
- M1 Shared Primitives、M2 Data Display 与 M3 Team/Player Patterns PRD 继续拥有
  Page Header、Action、Form、Feedback、Status、Tag、Data Bay、Table、Pagination、
  Team Artwork 与 initials fallback 契约；M5 只组合和扩展已批准角色。
- proposal preview 与 decision log 是设计历史和验证证据，不是实施 SOT。

修改现有页面：

- Matches Overview `/matches`
  - 使用无 eyebrow 的 Functional Page Header 与现有 Create Match action。
  - 保留 Event、Team、Stage 三级筛选及当前联动：未选择 Event 时 Stage disabled；
    筛选器放入弱可见的 Filter region，不提升为显眼的通用 card。
  - 将现有 Match Card 迁移为 Scoreline Rail：顶部 metadata rail 显示 Event、可选的
    compact Stage Tag 与比赛时间；Stage 缺失时在列表中省略，不制造占位 badge。
  - 主体保持 HOME 左、中央比分、AWAY 右的对称结构，使用 M3 loaded Team Artwork 或
    Neutral Frame + initials fallback，并允许 restrained Team-color trace。
  - 仅较高比分 Team 显示 Trophy + `Winner`，且通过 Team name 与 score 的明暗层级共同
    强调；相同比分作为防御性显示状态，不显示 Winner，双方保持同级。
  - 完整 card 是唯一详情导航目标，统一拥有 hover、focus-visible 与 pressed；局部
    Team light 可增强，但不上浮、不缩放，不为内部 logo、比分或 badge 增加独立交互。
  - loading 使用接近 Scoreline Rail 的 shape-preserving skeleton；首次 error 使用可重试
    feedback。已有成功数据后的刷新 loading/error 保留当前 cards、筛选与 pagination，
    以非阻塞 feedback 表达刷新状态。
  - filtered empty 提供 Clear filters；pagination 保持安静的最终信息带和现有总项目数。
  - 不新增 scheduled、incomplete、voided、archived Event、ResultTag 或合成 Match
    status 内容。
- Match Detail `/matches/:id`
  - 保留 Detail Back、现有 Edit/Void/Restore actions、confirmation、alerts、loading、
    error、not-found 与历史只读行为；actions 和完整状态 feedback 位于 hero 外。
  - 将现有 score header 迁移为只读 Arena Scoreline：metadata 显示 Event、Stage 与
    比赛时间；缺少 Stage 时明确显示 `—`。
  - hero 保持 HOME 左、中央比分、AWAY 右以及 M3 Team Artwork/fallback；胜者通过
    Team name 与 score 的明暗差异表达，不显示 Trophy 或独立 Winner 标识，以保持
    对称结构。
  - voided/historical 可在 hero metadata 中使用紧凑语义 echo，但不可取代页面级 alert、
    原因、时间与 actions。
  - 两个 Team box score 使用 M2 Data Bay 和既有 API 顺序；保留 local horizontal
    overflow、row hover、百分比不可用状态、Operational Neutral Other row 与强 Team
    Total 层级，不压缩成不可读列宽。
- Match Create `/matches/new` 与 Match Edit `/matches/:id/edit`
  - 使用无 eyebrow 的 Functional Page Header、现有 Create/Save primary action 与
    `Cancel` secondary action；不把 Cancel 替换为 Detail Back 或 Return 语义。
  - 保留 Match information editor、浏览器原生 `datetime-local`、Event/Stage/Team
    字段、create/edit 只读差异与所有当前联动。
  - 两个 Team roster stat-entry 区域组合为紧凑 Data Entry Bays，清晰显示 Team identity、
    Played checkbox、Player rows、实时 Team score 与 Operational Neutral Other row。
  - 保留未出场行 disabled/blank、重新勾选清空旧值、inactive 历史 Player、archived
    Team 限制、整数与 rating 输入、百分比只读计算和提交时空值补零规则。
  - validation failure 保留所有草稿并显示既有 field/row/form feedback；submitting
    disabled 防止当前页面重复提交。
  - Edit 遇到 voided Match 或 unavailable Event 时不渲染可提交表单，使用简洁
    unavailable state 与返回详情 action；不新增修复或绕过路径。

共同验收范围：

- HOME 胜、AWAY 胜与防御性 equal-score 渲染；equal-score 仍不得通过 create/edit
  submit。
- Stage 有值、列表缺失时省略、详情缺失时 `—`。
- loaded、dark、missing 与 failed Team logo；Neutral Frame + derived initials fallback；
  长 Team/Event/Stage 名称。
- normal、voided、restored、archived/deleted Event historical Match，以及 restore
  成功/失败反馈。
- eligible Events 正常、无可用 Event、Event/Team/Stage 联动、inactive historical
  Player 与 archived Team editor。
- initial loading、retained-data refresh loading/error、empty、filtered empty、
  not-found、submitting 与 validation error。
- desktop、约 `560px`、`760px` 与 `980px` 下的主要收敛状态：Scoreline Rail 在窄屏
  依次显示 HOME、AWAY，再以独立 ruled row 显示比分；Arena Scoreline 依次显示 HOME、
  AWAY 与 score；页面不产生整体横向溢出，dense stats table 只在本地滚动。
- keyboard-only、touch/no-hover、focus-visible、pressed 与 Reduced Motion；纯展示的
  Team Artwork、score、Winner marker 和 metadata 不制造额外 tab stops。
- 新增或修改的共享颜色、字体、圆角和重复 shadow 必须进入
  `apps/frontend/src/styles/variables.css` 的语义 token，并与 Mantine theme 保持一致；
  page CSS 只保留布局、断点和真正本地的 Match 呈现。
- 执行 style literal check、typecheck、production build 与代表性浏览器 smoke test。

不包含：

- 新页面、新路由、新 API、Schema、数据迁移、请求字段、统计计算或业务规则。
- 改变 list 的 active-only 范围、服务器筛选/分页/排序、Stage 联动或 Event eligibility。
- 改变 Match form payload、Player appeared、Other stats、比分计算、平局限制、
  Void/Restore、archived Team 或 unavailable Event 逻辑。
- 独立 final-score 输入、存储比分、比赛节次、加时、实时比分、赛程或比赛时钟。
- 在 Match card 中新增 Event Result Tags、Match status、awards 或其他未提供内容。
- Team Artwork 上传、裁切、重新着色、服务端 contrast 分析或新 identity contract。
- M1–M4 已验收 Pattern 的重新设计；若实施暴露明确缺陷，先返回 PRD 审批。
- M6 Global Sweep、Sidebar/Main Content Shell、Light mode 或未批准的 proposal/lab。

## 3. 组件变更

### 3.1 Token、共享 Primitive 与边界

- `apps/frontend/src/styles/variables.css`
  - 仅在现有语义角色不足时增加 Match scoreline surface、metadata rule、score hierarchy、
    restrained Team trace 与局部 hover light 的共享 token。
  - 复用 M1 Dark Glass、Editorial Outline、focus、pressed、feedback、motion，
    M2 Data Bay/row state/pagination 与 M3 Team Identity/Artwork token。
  - Team color 继续通过受限 CSS custom property 或局部 style 传入，只用于 trace；
    不重着色 supplied logo，不把任意 Team color 用作正文或 focus ring。
  - 不创建 `mint`、`glass-2`、具体 Match 名称色值或 proposal-only token；page CSS
    不硬编码颜色、字体、圆角或重复 shadow。
- `apps/frontend/src/shared/components/team-identity/TeamArtwork.tsx`
  - 直接复用现有 loaded artwork、failed-image recovery、Neutral Frame、initials 与
    `compact`/`detail` scale。
  - 不在 Match 页面复制 initials 算法或另建嵌套 logo card。
- 共享 M1/M2 组件与 class contract 保持现有职责。只有两个以上真实 Match 消费者需要
  完全相同 DOM/行为时，才提取最小 Match-local primitive；不建立通用 Sports Card
  abstraction。

### 3.2 Matches Overview

- `MatchesPageHeader.tsx`
  - 移除 `Match records` eyebrow；保留现有 title、description 与 Create Match action。
- `MatchFilters.tsx`
  - 保留 Event/Team/Stage Select 与联动，只消费 M2 weak Filter Bar 结构和 M1 Select
    状态；不增加额外可见 card。
- `MatchRecordCard.tsx`
  - 重组为 metadata rail + HOME/score/AWAY Scoreline Rail。
  - 使用 `TeamArtwork`、HOME/AWAY role label、Team name、score、Team-color trace；
    仅真实胜者显示 Trophy + `Winner`。
  - 整卡维持单一详情导航语义。实现可使用与当前 app router 兼容的 link/card target，
    但不得产生嵌套 button/link、重复 tab stop 或内部 click target。
  - equal score 显式进入无 Winner、双方同级的 defensive presentation。
- `MatchHistoryList.tsx`
  - 保留当前响应式 list/grid ownership，仅为 Scoreline Rail 提供间距和列收敛。
- `MatchesPage.tsx`
  - 保留 server filters、page reset、AbortController、retry 与 pagination。
  - 区分首次 loading 和已有成功数据后的 refresh：首次显示 card-shaped skeleton；
    refresh 保留 cards 与 pagination，并显示非阻塞 loading/error feedback。
  - filtered empty 的 Clear filters 同时清除 Event、Team、Stage 并回到第一页；无筛选
    empty 保持开放反馈。
- `MatchesPage.css`
  - 删除旧普通 panel、color bar 与上浮 hover 规则；只保留 Scoreline Rail 布局、
    metadata/score hierarchy、局部 Team trace、断点和 list grid。

### 3.3 Match Detail

- `MatchScoreHeader.tsx`
  - 重组为 Arena Scoreline：Event/Stage/time metadata rail 与 HOME/score/AWAY
    对称 field。
  - 缺少 Stage 时渲染 `—`；不渲染 Trophy 或 Winner label。
  - 通过数值比较设置 winning/losing/equal presentation；不得改变 role 顺序。
- `MatchTeamSummary.tsx`
  - 移除本地 initials/logo 实现，复用 `TeamArtwork` 的 `detail` scale。
  - 保留 HOME/AWAY label 与 Team name；winner 只控制 name strength，不增加语义状态。
- `MatchBoxScoreTable.tsx`
  - 保留 API Player 顺序与列定义，继续使用 `app-data-bay`、`app-table-wrap` 和
    `app-data-table`。
  - Operational Neutral Other row 保持非 winner/non-warning 语义；在 table 末端显示
    API 提供的 Team score 作为强 Team Total row，不在前端重新排列 Player。
  - `null` percentage 显示 `—`，rating 保持一位小数；local overflow 不裁切 focus。
- `MatchDetailPage.tsx`
  - 保留 Back、Edit/Void/Restore、confirmation、alerts 与 reload logic；操作保持 hero
    外部并继续由 Match/Event 状态控制。
  - 将 `MatchDetailTeam.score` 传入对应 box-score table；不新增 API 或计算来源。
- `MatchDetailPage.css`
  - 将旧 `app-panel` hero 和本地 logo treatment 收敛为 Arena Scoreline、共享 artwork、
    Data Bay 与断点布局；保留 dense table 的本地 column width。

### 3.4 Match Create / Edit

- `MatchFormPage.tsx`
  - 移除 `Match workspace` eyebrow；保留 title、description、dirty-state、load/save、
    Event change、live score、payload、navigation 与 unavailable 判断。
  - initial loading/error、no eligible Events、validation、submitting 与 unavailable
    使用 M1 feedback；不清空失败提交后的草稿。
- `MatchInfoForm.tsx`
  - 保留 Editorial Outline owning surface、现有字段与 responsive grid。
  - `datetime-local` 继续使用浏览器原生控件；不包裹或替换成自制 date picker。
- `MatchStatsInputTable.tsx`
  - 将每队 owning surface 迁移为紧凑 Data Entry Bay，header 组合 Team name、
    archived echo 与实时 `Score`。
  - 保留 Played Filled Checkbox、Player/inactive label、dense Number Input、
    calculated fields 与 Operational Neutral Other row。
  - 未出场 row 的 disabled/blank、toggle 清理、Other applicability 和所有输入范围不变。
- `MatchFormActions.tsx`
  - 保留 Create/Save primary action、可见 `Cancel` 与 submitting/disabled；
    只消费已批准的 M1 button family。
- `CreateMatchPage.css`
  - 只负责 editor layout、Data Entry Bay composition、table width/local overflow 与断点；
    删除已被共享 token/primitive 接管的视觉重复。
- `EditMatchPage.tsx`
  - 路由 wrapper 不变；不新增 edit-only 数据或视觉分支。

## 4. API 调用

M5 不改变现有请求：

| 页面 / 动作 | Method + Path | M5 使用方式 |
|---|---|---|
| Matches Overview | `GET /api/matches?page=&pageSize=&eventId=&teamId=&stageTagId=` | 同一响应渲染 filters、Scoreline Rails 与 pagination |
| Create initial options | `GET /api/matches/form-options` | 加载 eligible Events |
| Create selected Event | `GET /api/matches/form-options?eventId=:id` | 加载 Stage Tags、participants 与 active rosters |
| Detail / Edit initial | `GET /api/matches/:id` | 渲染 Arena Scoreline、box scores、state 与 edit snapshot |
| Edit active rosters | `GET /api/matches/form-options?eventId=:id` | 与历史 inactive Player 合并 |
| Create submit | `POST /api/matches` | 提交现有完整 HOME/AWAY stats snapshot |
| Edit submit | `PATCH /api/matches/:id` | 提交现有完整 stats snapshot |
| Void | `POST /api/matches/:id/void` | confirmation 后调用 |
| Restore | `POST /api/matches/:id/restore` | confirmation 后调用并展示全部失败 details |

请求状态：

- 所有现有 effect 继续使用 `AbortController`，避免筛选快速变化或卸载后的过期响应覆盖。
- filter 变化继续重置 page 为 `1`；Event 变化继续清理失效 Team/Stage。
- Matches Overview 首次请求无数据可保留时使用 shape skeleton；后续请求保留上一次成功的
  cards、totalItems 与 pagination，成功后原子替换，失败时保留并提供 Retry。
- Create/Edit 保存失败保留全部 draft；成功继续进入对应 Match Detail。
- Edit 未修改 `playedAt` 时继续发送原始 ISO；仅实际修改后由原生本地值生成新 UTC ISO。
- 不新增 prefetch、polling、detail fan-out、logo 请求代理或跨请求重复 Match 检测。

## 5. UI 规格

### 5.1 Matches Overview

- **Route**：`/matches`。
- **Page Header**：`Matches` title、现有 description、Primary `Create Match`；无 eyebrow。
- **Filter region**：Event、Team、Stage 横向排列并在窄屏换行；背景和 edge 仅用于结构
  分组。未选 Event 时 Stage disabled，disabled 不只靠颜色表达。
- **Scoreline Rail metadata**：
  - Event 为第一识别项；
  - Stage 有值时使用 compact Match Stage treatment，无值则完全省略；
  - playedAt 使用浏览器本地时区和现有 locale 格式；
  - 长文本截断但保留可访问文本。
- **Scoreline Rail body**：
  - desktop 为 HOME identity / score / AWAY identity；
  - 两侧均显示 role、artwork、Team name 与受限 Team-color trace；
  - 中央 score 使用 tabular numerals，分隔符保持安静；
  - 胜者显示 Trophy + `Winner`，winning name/score 为强层级，losing pair 降一级；
  - equal 时无 Trophy/`Winner`，双方 name/score 同级。
- **Interaction**：整卡单一导航；hover/focus-visible 增强 edge 和相应 Team local light，
  pressed 收紧反馈；不 translate、不 scale、不 pulse。Reduced Motion 停止非必要过渡。
- **States**：
  - initial loading：不少于一项、保持 metadata/body 几何的 skeleton；
  - refresh loading：保留当前 cards，使用非阻塞进度反馈；
  - refresh error：保留当前 cards/filter/pagination，显示 Retry；
  - empty：开放式 `No matches found`；
  - filtered empty：同时提供 Clear filters；
  - success：按 API 顺序显示；
  - pagination：继续显示当前项目范围/总项目数、Previous/Next 与页码。
- **Responsive**：
  - 宽布局按现有可用空间使用两列，超宽行为不作为新 contract；
  - `≤760px` 使用单列；每张 card 按 HOME、AWAY、独立 ruled score row 排列；
  - artwork、名称、Winner 与 score 不得重叠，页面不得产生整体横向滚动。

### 5.2 Match Detail

- **Route**：`/matches/:id`。
- **Page framing**：Detail Back 左侧；Edit/Void 或 Restore 位于 hero 外右侧并可在窄屏
  reflow。voided/historical alerts 继续在 hero 外完整显示。
- **Arena metadata**：Event、Stage、playedAt；Stage 缺失显示 `—`。可选 compact
  Voided/Historical echo 只能复述页面已有状态。
- **Arena field**：
  - desktop 为 HOME identity / central score / AWAY identity；
  - Team Artwork 使用 detail scale；长 Team name 允许受控换行；
  - winning name/score 保持 full strength，losing pair 降一级；
  - equal 时两侧完全同级；
  - 不显示 Trophy、Winner、冠军条、Match status 推断或可点击 Team identity。
- **Box scores**：
  - HOME 与 AWAY 各一个完整 Data Bay；
  - 列保持 POS、Player、PTS、REB、AST、FGM、FGA、FG%、3PM、3PA、3P%、MIN、
    RATING；
  - Player row hover 使用 M2 规则，inactive 文案保持；
  - Other row 使用 Operational Neutral，MIN/RATING 为 `—`；
  - Team Total row 使用强总计层级和 API score；
  - dense table 在 Data Bay 内横向滚动，不压缩输入/数据到不可读。
- **States**：
  - loading 使用 hero + 双 Data Bay shape；
  - 404 使用 not-found，通用 error 可 Retry；
  - void/restore submitting 禁用对应 action；
  - voided 显示时间、只读内容与 Restore；
  - unavailable Event 显示历史只读原因并隐藏 Edit/Void/Restore；
  - action error 保留已加载详情并展示完整 message/details。
- **Responsive**：
  - `≤980px` Arena 按 HOME、AWAY、score 堆叠；
  - `≤560px` metadata/actions 纵向排列，artwork 使用紧凑 detail scale；
  - Data Bays 始终保持本地 overflow，不产生页面级横向滚动。

### 5.3 Match Create / Edit

- **Routes**：`/matches/new`、`/matches/:id/edit`。
- **Page Header**：title、description、Create/Save 与可见 `Cancel`；无 eyebrow。
- **Information editor**：
  - Create 可选 Event、Stage、HOME/AWAY Team 与 native date/time；
  - Edit 的 Event 和 Team 只读，Stage 与 playedAt 可编辑；
  - 字段、helper、disabled、focus 与 validation 使用 M1 form contract。
- **Team Data Entry Bays**：
  - HOME bay 在前、AWAY bay 在后；不因比分交换；
  - header 显示 Team name、可选 Archived echo 与实时 score；
  - Played 使用 Filled Checkbox；未选中行的输入 disabled 且显示空值；
  - PTS/REB/AST/FGM/FGA/3PM/3PA/MIN 使用整数 Number Input，RTG 允许一位小数；
  - Other row 始终可编辑适用的七个整数，不显示 Played，MIN/RTG 为 `—`；
  - FG%/3P% 与 score 为只读派生显示，不进入 payload；
  - table 采用 compact density 与本地横向滚动。
- **Validation/submission**：
  - save availability 与现有必填、每队至少一名 appeared Player、不同 Team 和非平分
    条件一致；
  - validation failure 保留全部输入并定位 field/Team/Player/Other/form；
  - submitting 锁定 Save，不隐藏 Cancel 或清空内容；
  - success 进入详情。
- **Unavailable**：
  - Edit 发现 Match voided 或 Event unavailable 时，不短暂显示可提交表单；
  - 使用简洁 M1 unavailable feedback、原因和返回详情 action；
  - 不提供 Restore、Event 修复或 Team 替换操作。
- **Responsive**：
  - `≤760px` Page Header actions 和 information fields 纵向排列；
  - stats bays 纵向排列，table local overflow；页面级 action 和 feedback 保持可见；
  - Number Input、Checkbox 与 action hit area 保持已批准 compact 尺寸，不因窄屏缩小。

### 5.4 验收矩阵

| 场景 | 必须验证 |
|---|---|
| HOME / AWAY win | role 顺序稳定；list 仅真实胜者显示 Trophy + Winner；detail 无 Winner marker |
| Equal score response | list/detail 双方同级；无 Winner；create/edit 仍阻止提交 |
| Missing Stage | list 省略；detail 显示 `—`；form `stageTagId = null` |
| Team artwork | loaded/dark logo 清晰；missing/failed 使用 Neutral Frame + initials；不裁切或重着色 |
| Long content | Team/Event/Stage 不覆盖 score/actions；必要时截断或换行 |
| Void / Restore | list 不显示 voided；detail 只读/恢复、confirmation、成功与完整失败 details 正确 |
| Historical Event | direct detail 可读；Edit/Void/Restore 隐藏；edit URL 显示 unavailable |
| Archived Team edit | 已有历史行保留；不得新增该侧 Player；Archived echo 可辨识 |
| Data entry | Played、blank/disabled、Other、live score、percentage、validation 与 payload 不变 |
| Request feedback | initial skeleton、retained refresh、empty、filtered empty、error/retry、not-found、submitting |
| Dense overflow | detail 与 editor tables 只在 bay 内滚动；focus 不被裁切；页面无横向溢出 |
| Input modes | keyboard focus-visible、touch/no-hover、pressed、disabled 与 Reduced Motion |
| Viewports | wide、约 `980px`、`760px`、`560px` 的规定 stacking 与信息顺序 |

实现验证至少执行：

- 项目既有 style literal / token check；
- frontend typecheck；
- frontend production build；
- 使用真实应用路由完成 Overview、Detail、Create/Edit 的代表性浏览器 smoke；
- 对上述矩阵保留可复核的截图或检查记录，并更新
  `docs/UI_REDESIGN_READINESS_CHECKLIST.md` 中实际完成的 M5 项目。

## 6. 与 Backend PRD 的接口约定

1. Frontend 严格消费 `MatchManagementBackendPRD.md` §5 的字段，不发送 score、
   percentage、winner、voidedAt、artwork state 或其他派生/只读字段。
2. list card 只使用 `MatchListItem`：
   - Event、Stage、playedAt 进入 metadata；
   - `homeTeam`/`awayTeam` 决定 role、identity、color、logo 与 score；
   - Winner 只由两个 score 数值比较；equal 不推断 winner。
3. detail 的 HOME/AWAY 使用 `teams[].role` 定位，不依赖数组偶然顺序、Team 名称或
   score；视觉上始终 HOME 在前、AWAY 在后。
4. `MatchDetailTeam.score` 同时作为 Arena score 与对应 Team Total；Player rows 和
   Other row 继续使用 detail response，不从 DOM 或格式化字符串重算。
5. `stageTag = null` 只映射为列表省略与详情 `—`；Create/Edit 未选择时继续提交
   `stageTagId: null`。
6. Create/Edit payload 的 `teams` 继续是 HOME/AWAY 两项完整快照。未 appeared Player
   不进入 `playerStats`；appeared Player 与 Other 的空 draft 仅在构建 payload 时补 `0`。
7. Team score preview = appeared Player points 总和 + Other points，仅用于即时反馈；
   保存后的 list/detail 以 API 重新计算的 score 为准。
8. Edit 将 active roster 与 detail 历史 Player 合并；inactive Player 不丢弃，archived
   Team 一侧不合并或新增 roster Player。
9. `voidedAt !== null` 仍是 Match 自身 voided 标识；detail/action availability 还必须
   结合 Event `status`、`archivedAt` 与 `deletedAt`，不得由 hero 样式反推。
10. API error 继续按 `{ statusCode, error, message, details }` 处理：
    - `VALIDATION_ERROR` 与 `422` 业务错误保留表单内容并映射 field/row/form；
    - `MATCH_NOT_FOUND` 显示 not-found；
    - `MATCH_VOIDED` 使 edit 返回 detail 并刷新；
    - `MATCH_ALREADY_VOIDED`、`MATCH_NOT_VOIDED` 视为外部状态变化并刷新 detail；
    - `MATCH_RESTORE_NOT_ALLOWED` 保留 detail 并逐条显示全部恢复障碍；
    - network/500 使用可 Retry 的通用 feedback。
11. M5 不依赖 Event Result Tags、award candidates、Player current Team 或其他 feature
    response 补充 Match 呈现。
12. 若现有 contract 与批准视觉无法同时满足，停止对应 Pattern 并返回 PRD 审批；
    不以 mock、hard-coded status、额外请求或宽松 validation 绕过。
