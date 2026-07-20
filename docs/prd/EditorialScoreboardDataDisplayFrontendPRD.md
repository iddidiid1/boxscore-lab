# Editorial Scoreboard Data Display Frontend PRD

> 阶段定义：本 PRD 属于 [Editorial Scoreboard 迁移 PRD 索引](./EditorialScoreboardMigrationIndex.md)
> 的 **M2 — Data Display**。

## 1. 目标

实施 Editorial Scoreboard M2 Data Display，将项目中重复出现的数据表格、排序表头、
行状态、局部横向滚动、筛选组合、分页、统计摘要和只读 Team rating 收敛为一致的
共享视觉与小型可复用组件：表格使用 38px header / 46px body-row Dark Glass Data Bay，Filter Bar
使用弱边界 Dark Glass，Pagination 成为 owning data/list module 的最终 strip，
Team/Player Summary 使用 Ruled Grid，Team rating 使用五颗可部分填充的星及精确值。

本批次只迁移已批准的数据展示和现有交互状态表现；保留当前列、字段、内容顺序、
排序来源、分页逻辑、筛选逻辑、链接目标、编辑行为、API 调用与响应式信息架构。

## 2. 影响页面与范围

文档权威：

- `docs/DESIGN.md` 是 Data Bay、Filter Bar、Pagination、Ruled Grid、Stat Value、
  fractional Star Rating、Operational Neutral 和 Championship Gold 的视觉 SOT。
- 本 PRD 只拥有 M2 的实施范围、接入边界和验收目标，不复制第二套视觉值。
- 本 PRD 补充而不取代现有 Team、Player、Event、Match Frontend PRD。
- Team、Player、Event、Match Frontend PRD 继续拥有列内容、字段含义、排序与分页
  行为、筛选依赖、路由和业务交互。
- `EditorialScoreboardSharedPrimitivesFrontendPRD.md` 提供 M1 foundation、surface、
  action、form、feedback 和 motion primitive；M2 只能消费和扩展其批准角色。

包含：

- 共享 Data Bay：
  - edge-highlight Dark Glass 外层；
  - 38px quiet header / 46px body-row baseline；
  - quiet tonal header、水平 divider、无垂直 gridline；
  - shared data typography 与数字对齐；
  - local horizontal overflow 和 restrained scrollbar；
  - neutral full-row hover；
  - 只有真实可交互行/内容才获得 pointer、focus-visible 和 pressed；
  - sortable header 的 inactive、ascending、descending、hover 与 focus-visible；
  - 空数据和 loading 继续消费 M1 feedback，不改变表格 shell。
- 四个核心 Unified Data Table 场景：
  - Players Overview `/players` 的 Player Rankings；
  - Team Detail `/teams/:slug` 的 Roster；
  - Player Detail `/players/:slug` 的 Match History；
  - Match Detail `/matches/:id` 的两张 Team Box Score。
- 特殊表格行：
  - Match Create/Edit `/matches/new`、`/matches/:id/edit` 数据录入表的
    Operational Neutral Other row；
  - Match Detail 两张 Box Score 的只读 Operational Neutral Other row；
  - Event Detail `/events/:slug` Final Team Results 的 Championship Gold
    Winner row，始终配合 Trophy 和 outcome text，不只依赖颜色。
- Filter Bar：
  - Players Overview 的 Event、Team、Position filters；
  - Matches Overview `/matches` 的 Team、Event、Stage filters；
  - Player Detail 的 Event filter；
  - 共享 16px internal spacing、弱但可见的 Dark Glass grouping，同级字段不再分别
    card 化；现有 cascading/clear/query-string 行为保持不变。
- Pagination：
  - Players Overview；
  - Matches Overview；
  - Player Detail Match History；
  - 保留 `Showing x–y of z`；
  - Previous、Next、page number 的 default、hover、focus-visible、pressed、
    current/selected 和 boundary-disabled；
  - 在 Player Rankings 与 Match History 中成为同一 owning data module 的 final strip；
    在 Matches Overview 中保持属于 Match list module，不提前重做 M5 Match Card。
- Ruled Grid 与 Stat Value：
  - Team Detail 的 Team Summary（五项）；
  - Player Detail 的 Stat Summary（六项）；
  - label-first、等宽关系、内部 divider、无嵌套 mini-card；
  - 在 560/760/980px 边界按可读分组重排。
- Read-only Fractional Star Rating：
  - Teams Overview Team Card；
  - Team Detail identity；
  - Team Create/Edit Identity Preview；
  - 五颗星支持部分填充，显示精确 `x / 10`；
  - `null/unavailable` 与数值 `0` 保持不同语义；
  - accessible name 使用 10 分制。
- 对上述真实场景提取最小共享 CSS/React primitive，移除被替代的重复 table、filter、
  pagination、summary 和 star visual declarations。
- 更新 `docs/UI_REDESIGN_READINESS_CHECKLIST.md` 中实际完成并验证的项目。
- 执行 style literal check、typecheck、production build，并验证 desktop、560/760/980px、
  keyboard focus、sort state、row hover、pagination boundaries、local overflow、
  Reduced Motion 和 touch/no-hover。

不包含：

- 修改任何 API、query contract、数据模型、统计计算、排序算法或分页算法。
- 增删、改名或重排现有数据列。
- 给原本不可排序的 Match History 或 Match Box Score 新增排序。
- 把 Player Rankings 的服务端排序改成前端排序，或把 Team roster 排序改成服务端排序。
- 给普通只读 table row 新增整行点击、选择或导航。
- Event ResultTag 编辑表、Event Outcomes 编辑表和 Team Player Management 编辑表的
  完整 Data Bay 化；它们继续属于 Editor 语法，只可消费不会改变其层级的共享基础值。
- Match Detail 新增 Team Total row，或改变 score/header 的既有内容。
- Event winner 的业务判定、ResultTag order 或 ranking points 变化。
- Match Other statistics 的字段、校验、保存或计算变化。
- M3 Team/Player product Pattern：Open Division Stacks、Score Ledger Team Card、
  Unified Field、Identity Proof、Leader Card、Number Masthead、Performance Profile、
  Honors Ledger。
- M4 Event product Pattern 或 M5 Match product Pattern。
- Event Player Awards 选取功能重设计。
- 页面 Header、Sidebar、业务 card、hero、tag/badge 或 Light mode。

## 3. 组件变更

### 3.1 实施原则与共享边界

M2 使用“共享 CSS contract + 小型重复行为组件 + 业务表格保留列定义”的结构。
禁止创建接收任意 columns/data/sort/pagination 的全能 Data Table abstraction。

- `apps/frontend/src/styles/variables.css` 继续是 semantic token 的 canonical entry；
  只在 Data Bay、special row、pagination、ruled grid 或 fractional star 存在真实共享
  角色缺口时新增 token。
- `apps/frontend/src/styles/primitives.css` 提供 Data Bay、table viewport、table row、
  sortable header、Filter Bar、Pagination、Ruled Grid 和 Star Rating 的共享视觉契约。
- page CSS 只保留列宽、局部 grid 布局、页面间距、业务色条和必要断点；被共享契约
  覆盖的 border、surface、typography、hover、focus、row height 和 pagination button
  声明应删除。
- 各业务组件继续拥有列、cell renderer、数据格式、排序 handler、link target
  和 empty copy，避免视觉迁移改变业务。
- 只有两个以上真实场景共享相同 DOM/行为时才提取 React component。

### 3.2 Data Bay CSS contract

共享样式提供以下显式 class/attribute contract；实际命名可在实施时按现有
`app-*` 约定微调，但语义和边界必须保持：

| Contract | 职责 |
|---|---|
| Data Bay shell | edge-highlight Dark Glass 外壳、panel radius、min-width containment |
| Data viewport | 局部 `overflow-x: auto`、稳定 scrollbar、禁止 whole-page overflow |
| Data table | 38px quiet header、46px body baseline、水平 divider、numeric typography |
| Sort control | 占满 header hit area、稳定 indicator slot、ARIA sort 对应视觉状态 |
| Row state | neutral hover；只有真实 row action 才允许 pointer/focus/pressed |
| Other variant | Operational Neutral fill、neutral leading rail、兼容 input focus/error |
| Winner variant | Championship Gold tint/trace，保留 Trophy 和 result text |
| Pagination strip | owning module 底部 structural divider、summary 与 controls 布局 |

Data Bay 不负责 section title、列定义、排序算法、row navigation 或 pagination state。
`highlightOnHover` 可保留或移除，但最终 hover 必须由共享 contract 单一控制。

### 3.3 四个 Unified Data Table 接入

保留现有 component 与数据流，只接入共享 Data Bay contract：

1. `PlayerRankingTable`
   - 保留 server sort callback、`aria-sort`、Player name button 和 podium value。
   - sortable columns 保持现有集合；inactive indicator 预留稳定宽度但不伪造方向。
   - 普通行不整体 clickable，只有 Player name button 可导航。
2. `RosterTable`
   - 保留 component-local sort state、position comparator 和 Player link。
   - 所有现有列仍可排序；普通行不整体 clickable。
   - empty roster 继续在 table ownership 内显示，不新增嵌套 card。
3. `PlayerMatchHistory`
   - 保留列、Match link、date formatting 和无排序行为。
   - Match History title 与 table 仍属于同一 owning module。
4. `MatchBoxScoreTable`
   - 两支 Team 各自拥有独立 Data Bay 和 local overflow。
   - 保留 Team title/color reference、现有列与只读数据。
   - 不新增 sort、Team Total row、row navigation 或 Winner marker。

### 3.4 Special row 接入

- `MatchStatsInputTable` 保持 Editor surface 和表单语法；它不变成完整的 read-only
  Data Bay，但 table geometry、header、divider、46px body baseline 与 local overflow
  可消费同一 shared table foundation。
- editable Other row 使用 Operational Neutral。行 hover 不能压过 NumberInput 的
  hover/focus/error；不适用 cell 保持 `—`，现有 enabled/disabled 与 score 计算不变。
- `MatchBoxScoreTable` 的只读 Other row使用同一 Operational Neutral 语义和 leading
  rail，但不显示可编辑 affordance。
- `EventResultsTable` 使用标准 Data Bay；Winner row 使用 Championship Gold，
  同时保留 Trophy、Team name 和 Result Tag label。非 Winner 行保持 neutral。
  Table 直接使用 Event API 的稳定 `teamResults` 顺序；移除当前仅按
  `rankingPoints` 的 local re-sort，以服从既有 Event Frontend/Backend PRD，
  不建立 M2 自己的排序规则。
- Other 与 Winner 必须使用不同 token/attribute，禁止通过页面选择器共享同一颜色。

### 3.5 Filter Bar

Players、Matches 与 Player Detail 三处 filter composition 使用共享
`app-filter-bar` 类或等价小型 layout primitive：

- 16px internal spacing，edge-highlight Dark Glass，边界弱于主要 Data Bay；
- 同级 Select 不再分别 card 化，仍消费 M1 的共享 Select primitive；
- field label、placeholder、clearable、disabled 与 dropdown 行为保持现状；
- 默认按现有横向顺序排列，空间不足时 wrap；`≤680px` 变为单列 full-width；
- 不增加 Active Filters chips、Apply button、Reset button 或新的提交步骤；
- Players cascading selection、Matches Event/Stage dependency 与 Player Detail URL state
  保持对应 feature 现状。

### 3.6 Pagination

将 `TurnPageControls` 从 Players page 私有位置迁移到
`apps/frontend/src/shared/components/data-display/`（或同等 shared 目录），保留现有
props 和计算语义；可在迁移中改为更通用的 component 名称，但所有调用方必须同时更新。

- `Showing {start}-{end} of {total}` 计算保持现状，空集合为 `Showing 0-0 of 0`。
- Mantine Pagination 继续负责页码、Previous/Next、ellipsis 与 disabled boundary。
- current page 使用真实 `data-active`/`aria-current` 作为 persistent selected state。
- summary 与 navigation 在宽屏左右分布，窄屏按阅读顺序堆叠。
- Players Ranking 和 Player Match History 的 Pagination 进入同一个 Data Bay/module
  最终 strip，不再作为独立 `.app-panel`。
- Matches Overview 的 Pagination 仍属于 Match list module；本批只统一 strip 与按钮，
  不改变 Match Card 或提前实施 M5。

### 3.7 Ruled Grid Summary

提取一个共享 `StatSummaryPanel`（名称可按项目约定调整），供 `TeamSummaryCard` 与
`PlayerStatSummary` 使用：

- props 只包含现有 section title 与 `{ label, value }[]`；
- label-first DOM 顺序保持，value 使用 Data typography；
- 一层 Dark Glass Summary surface，cell 之间使用内部 divider；
- 不为每个 statistic 创建 mini-card；
- Team 五项：宽屏五列；中窄屏按 `3 + 2` 或 `2 + 2 + 1` 可读分组；
- Player 六项：宽屏六列；中窄屏按 `3 + 3`，最窄按 `2 + 2 + 2`；
- divider 必须随实际行列边界调整，不能在换行后留下错误的外侧边。

该组件只负责现有字符串值的呈现，不计算 average、percentage 或 fallback。

### 3.8 Read-only Fractional Star Rating

新增共享 `FractionalStarRating`，替换 `TeamCard`、`TeamProfileSummary` 和
`TeamEditorForm` 内三个重复的 `getStars`：

- 接受 `value: number | null | undefined`，将有限数值 clamp 到 `0–10`，但不改变源值；
- 固定渲染五个 star slot，每颗星的 fill ratio 为
  `clamp(value / 2 - starIndex, 0, 1)`；
- 使用同形底层/填充层和 clipped inline fill，不用字符四舍五入；
- 同时显示格式统一的精确 `x / 10`；整数不强制补 `.0`，现有半分保留一位；
- finite `0` 显示五颗空星及 `0 / 10`；
- `null`、`undefined` 或 non-finite 显示五颗 unavailable star 与 `— / 10`，
  不转成零；
- wrapper 的 accessible name 使用十点制；单颗 decorative star 对辅助技术隐藏。

Team Card 的整体 link、Team Detail identity 和 Team Editor preview 的布局不在 M2
重构；只替换 rating visual。Team Editor 的 NumberInput 与 editable Rating Slider
不受此只读组件影响。

### 3.9 预计修改文件

共享层：

- `apps/frontend/src/styles/variables.css`
- `apps/frontend/src/styles/primitives.css`
- `apps/frontend/src/shared/components/data-display/*`
- 对应 shared barrel export（若现有目录约定需要）

业务接入：

- `apps/frontend/src/pages/PlayersPage/components/PlayerRankingTable.tsx`
- `apps/frontend/src/pages/PlayersPage/components/PlayerRankingFilters.tsx`
- `apps/frontend/src/pages/PlayersPage/components/TurnPageControls.tsx`（迁移后移除或保留
  仅作过渡 re-export，不得形成双实现）
- `apps/frontend/src/pages/PlayersPage/PlayersPage.tsx`
- `apps/frontend/src/pages/PlayersPage/PlayersPage.css`
- `apps/frontend/src/pages/MatchesPage/components/matches/MatchFilters.tsx`
- `apps/frontend/src/pages/MatchesPage/MatchesPage.tsx`
- `apps/frontend/src/pages/MatchesPage/MatchesPage.css`
- `apps/frontend/src/pages/PlayerDetailPage/PlayerDetailPage.tsx`
- `apps/frontend/src/pages/PlayerDetailPage/components/PlayerMatchHistory.tsx`
- `apps/frontend/src/pages/PlayerDetailPage/components/PlayerStatSummary.tsx`
- `apps/frontend/src/pages/PlayerDetailPage/PlayerDetailPage.css`
- `apps/frontend/src/pages/TeamDetailPage/components/RosterTable.tsx`
- `apps/frontend/src/pages/TeamDetailPage/components/TeamSummaryCard.tsx`
- `apps/frontend/src/pages/TeamDetailPage/components/TeamProfileSummary.tsx`
- `apps/frontend/src/pages/TeamDetailPage/TeamDetailPage.css`
- `apps/frontend/src/pages/TeamsPage/components/TeamCard.tsx`
- `apps/frontend/src/pages/TeamsPage/TeamsPage.css`
- `apps/frontend/src/pages/ManageTeamPage/components/TeamEditorForm.tsx`
- `apps/frontend/src/pages/ManageTeamPage/ManageTeamPage.css`
- `apps/frontend/src/features/events/components/EventResultsTable.tsx`
- `apps/frontend/src/pages/EventDetailPage/EventDetailPage.css`
- `apps/frontend/src/pages/MatchDetailPage/components/MatchBoxScoreTable.tsx`
- `apps/frontend/src/pages/MatchDetailPage/MatchDetailPage.css`
- `apps/frontend/src/pages/CreateMatchPage/components/MatchStatsInputTable.tsx`
- `apps/frontend/src/pages/CreateMatchPage/CreateMatchPage.css`

实现时可减少未发生实际变化的文件，但不得借 M2 清理无关 page CSS 或实施
M3–M5 Pattern。

## 4. API 调用

无 API 调用或 contract 变更。

| 场景 | 现有来源 | M2 约定 |
|---|---|---|
| Player Rankings | Player Statistics list API | 保持 query、server sort、page normalization 与 latest-request-wins |
| Player Detail | Player Statistics detail API | 保持 Event filter、Match History pagination、URL replace 与 retained state |
| Matches Overview | Match Management list API | 保持 Team/Event/Stage filter 与 server pagination |
| Team Detail | Team detail API | 保持现有数据加载；Roster sort 仍在前端 |
| Event Detail | Event detail API | 保持 API 稳定 Result 顺序与 Winner 推导，不二次重排 |
| Match Detail | Match detail API | 保持两队 Player/Other stats response |
| Match Create/Edit | Match form options/detail/mutation | 保持 Player/Other input、validation、score 与 submit flow |

- Filter Bar 不采用额外 Apply request；现有 onChange 行为不变。
- Pagination 不预取、不改变 page size，也不新增 client-side slice。
- Fractional Star Rating 与 Ruled Grid 只消费 props，不发请求。
- loading、empty、error 与 refresh failure 继续遵守各 feature PRD 和 M1 feedback。

## 5. UI 规格

### 5.1 Data Bay anatomy

- 外层使用 M1 `app-surface--data` 的 edge-highlight Dark Glass 材料；section title
  位于 owning module 内，不创建第二层 card。
- table header 使用 muted Data typography、稳定高度与 quiet tonal surface。
- table header baseline 为 38px，body row baseline 为 46px；内容换行或可访问文本需要更高时允许自然增长，
  不裁切文字来强制高度。
- 只显示水平 divider，不显示垂直 gridline。
- 数值列使用 tabular-nums，并按现有列 alignment 一致呈现；M2 不改数值精度。
- horizontal overflow 必须由最近的 Data viewport 承担；页面 body 不应出现横向滚动。
- scrollbar 使用克制 neutral treatment，不能遮挡最后一行或 Pagination。

### 5.2 Table interaction states

| 状态 | 验收要求 |
|---|---|
| Default row | neutral surface、清楚 divider、无 clickable 暗示 |
| Hover row | restrained full-row neutral fill，不位移、不发光 |
| Interactive content | link/button 自身有 pointer、hover、focus-visible、pressed |
| Sort inactive | label 与稳定空 indicator slot；`aria-sort="none"` |
| Sort hover | header control edge/text 增强，不改变列宽 |
| Sort focus-visible | M1 Brand ring 完整可见，不被 table viewport 裁切 |
| Sort active | ascending/descending indicator + `aria-sort`，不能只靠颜色 |
| Empty/loading | 保留 owning module 几何；消费 M1 feedback，不建立新 shell |

普通 row 不设 `tabIndex`、`role=button` 或 click handler。Player Rankings 的 Player
name button、Roster 的 Player link、Match History 的 Match link 保持唯一交互目标。

### 5.3 Other 与 Winner

- Operational Neutral Other row 使用 neutral alternate surface 和结构性 leading rail；
  label `Other` 始终可见，不用颜色作为唯一信号。
- editable Other row 的 disabled、focus、validation 由 cell 内 M1 form primitive 表达；
  row background 不覆盖 error message/ring。
- Semantic Bridge Championship Gold Winner row 使用 restrained directional tint/trace；
  Trophy 与 Result Tag outcome text始终保留。
- Other 与 Winner 的 directional gradient 由完整 `tr` 拥有，cell 在 Default/Hover
  保持透明；不得让渐变在每一列重新开始。
- Winner hover 仍能识别为 Winner；Other hover 仍能识别为 Other。
- 两种特殊行在 forced/reduced motion、touch/no-hover 下均不依赖动画或 hover。

### 5.4 Filter Bar

- Filter group 在主要内容与 Data Bay 之间形成一层弱可见 grouping。
- Select label 与当前值保持可读，dropdown 不被 container overflow 裁切。
- 680px 以上按现有业务顺序 wrap；680px 以下每个 field 占满可用宽度。
- disabled Stage filter 必须同时有 disabled visual 与原生/Mantine disabled semantics。
- focus-visible 必须落在 field control，而不是整条 Filter Bar。

### 5.5 Pagination

- summary 使用 muted tabular Data text并保留准确范围。
- visible pagination controls 复用 M1 compact Button family；不得因 page count 增大
  而使用过大的 Medium button geometry。
- default、hover、focus-visible、pressed、current 和 disabled 均必须区分；
  current 同时由 `aria-current`/Mantine语义表达。
- Previous/Next 在边界 disabled，不移除导致布局跳动。
- 窄屏 summary 在 navigation 之前；controls 可换行但保持阅读顺序与触控可用性。

### 5.6 Ruled Grid

- section title、grid 与 Data Bay surface 是一个 Summary module。
- 每个 cell 先读 label，再读 value；DOM 与视觉顺序一致。
- label 使用 muted UI/Data role，value 使用 strong Data role和 tabular-nums。
- zero、`—` 与正常数值保持同等布局，不因内容长度产生 mini-card。
- 560/760/980px 检查 Team 五项与 Player 六项的行列边界和 divider。

### 5.7 Fractional Star Rating

- fill 精度至少能稳定表达现有 `0.5/10` 步进，即单颗星的 25% 增量。
- filled、partial、empty 与 unavailable 在近黑背景上清晰，但不引入 glow 或 pulse。
- exact value 始终与 stars 在同一可读 group 中；空间不足可整体 wrap，不能丢弃数字。
- Team Card compact 用法允许缩小可见星尺寸，但共享 anatomy 与 accessible name 不变。
- component 为只读，不响应 hover、click、keyboard，也不显示可编辑 cursor。

### 5.8 Responsive、motion 与可访问性

- 重点验证 desktop 及 `≤980px`、`≤760px`、`≤560px`；Filter Bar 额外验证 680px。
- Data Bay 在窄屏优先 local horizontal scroll，不压缩或隐藏现有列。
- hover media query 应避免在不支持 hover 的触控设备留下永久 hover affordance。
- `prefers-reduced-motion: reduce` 下移除非必要 transition；sort、selected、winner、
  other、partial fill 的最终状态立即呈现且信息不减少。
- 所有 sort button、pagination control、links 保持正确原生语义与可访问名称。
- row hover、Winner、Other、partial star 与 current page 均不得只靠颜色表达。

### 5.9 验收与验证

实施完成后至少执行：

1. frontend style literal check；
2. frontend typecheck；
3. frontend production build；
4. 四个 Data Table 场景的列、数值、链接、sort 与 local overflow 对照；
5. Match Create/Edit 与 Match Detail 的 Other row 状态巡检；
6. Event Final Results 的 Winner/非 Winner/无结果状态巡检；
7. 三个 Filter Bar 的 default、clear、disabled、cascading 与 680px reflow；
8. 三处 Pagination 的 first/middle/last/empty/单页与窄屏状态；
9. Team 五项、Player 六项 Ruled Grid 在 560/760/980px 的 divider 巡检；
10. Team rating 的 null、0、partial、整数、10 与 accessible name；
11. keyboard focus、touch/no-hover、Reduced Motion 和 whole-page overflow 巡检；
12. 对比 network/query/URL，确认 API、page size、sort/filter/pagination 行为未变化；
13. 更新 `docs/UI_REDESIGN_READINESS_CHECKLIST.md`，只勾选实际通过项目。

## 6. 与 Backend PRD 的接口约定

- 本 PRD 与 `EditorialScoreboardDataDisplayBackendPRD.md` 共同确认 M2 是
  frontend-only migration。
- Player Rankings 与 Player Match History 以 Player Statistics API 的 items、
  sort metadata 和 pagination 为权威；前端不重新计算全局 rank。
- Matches Overview 以 Match Management API pagination 为权威。
- Team Roster 排序只作用于已加载的现有 roster 数据，不产生新的 Backend contract。
- Fractional Star Rating 直接映射既有十点制 overall rating；star fill 不提交后端。
- Winner 来自既有 ResultTag `isWinnerTag`；Other 来自既有 Match other stats。
- Event Final Results 顺序来自 Event API；M2 前端不按 points 或视觉状态重新排序。
- `null` rating 只有在现有 response/prop 已能表达 unavailable 时才显示 unavailable；
  不得通过额外 API 或业务猜测制造该状态。
- 若实施发现现有 contract 无法支持批准状态，必须暂停该项并重新进入 Phase 1，
  不得在 M2 内隐式修改 Schema、API、validation 或业务规则。
