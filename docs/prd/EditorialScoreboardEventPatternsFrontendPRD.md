# Editorial Scoreboard Event Patterns Frontend PRD

> 阶段定义：本 PRD 属于 [Editorial Scoreboard 迁移 PRD 索引](./EditorialScoreboardMigrationIndex.md)
> 的 **M4 — Event Patterns**。

## 1. 目标

将现有 Event Overview、Event Detail、Event Create/Edit 和 Event Results &
Awards 迁移到已批准的 Editorial Scoreboard 视觉语言，并把 Tournament
Insignia、Insignia Rail Event Summary Card、Event Detail 内容层级与 Black
Metal Plaque 落到真实页面。迁移必须复用 M1 Shared Primitives 和 M2 Data
Display 的既有契约，保留当前路由、内容、请求、生命周期、响应式行为与
Player Awards 选取逻辑；本轮只改善 Event 功能的视觉层级、材质、状态反馈和
跨页面一致性。

## 2. 影响页面与范围

文档权威：

- `docs/DESIGN.md` 是 M4 Event Patterns 的视觉单一事实来源。
- `EventManagementFrontendPRD.md` 继续拥有 Event 页面能力、路由、内容、
  请求状态、生命周期、归档与 Player Awards 选取行为。
- `EventManagementBackendPRD.md` 继续拥有数据、API、校验与业务规则。
- M1 Shared Primitives 与 M2 Data Display PRD 继续拥有 Page Header、Action、
  Form、Feedback、Status、Tag、Table、Pagination 等共享组件契约；M4 不复制
  或分叉这些视觉系统。
- proposal preview 与 decision log 是设计历史和验证证据，不是实施 SOT。

包含（in scope）：

- Events Overview `/events`
  - 使用无 eyebrow 的 Functional Page Header 和现有 Create Event action。
  - 将 Event Tier 迁移为 Tournament Insignia：列表与详情共享结构，列表采用
    compact scale；Tier 字母与 subtitle 提供非颜色识别。
  - 将现有 Event Card 迁移为 Insignia Rail Event Summary Card：左侧 Insignia
    rail，右侧名称、description 与 Semantic Status，Completed 才显示开放式
    Trophy/Championship Gold Champion strip，参与队伍数位于安静 footer。
  - 保留整卡导航，由父级统一拥有 hover、focus-visible 与 pressed；Tier 只随
    父卡加强局部 trace，不独立交互，也不使用上浮或缩放。
  - loading 保留近似卡片几何；empty 与 error 继续使用开放式 page feedback。
- Event Detail `/events/:slug`
  - 保留 Detail Back、现有 action、archived alert、loading、error 和 not-found
    行为。
  - 使用较大 scale 的同一 Tournament Insignia，结合 Event 名称、status、
    description 与参与队伍数形成详情 identity field；Insignia 本身保持只读且
    无独立 hover/glow 动画。
  - Participants 使用全宽 ruled roster，以真实 16-Team Event 为基准；Stage
    Tags 与 Result Tags 在其后作为两个紧凑同级 section，不与高基数 Participants
    组成等高并列栏。
  - Final Team Results 继续复用 M2 Data Bay/Table 与 Championship Gold Winner
    row，不改变内容、排序或空状态。
  - Player Awards 迁移为一个完整的 Black Metal Plaque：标题位于 plaque 内，
    全宽 MVP field 优先，之后为 First Team 与可选 Second Team 的 engraved
    ruled grids；不创建嵌套 cards。
  - Awards 保留 API 顺序、Player name、Position、award-time Team、重复 MVP 的
    Gold marker、inactive 历史标记、Second Team 缺省和无 awards 的开放内容。
    所有 award cell 均只读且不进入 tab order。
- Event Create/Edit `/events/new`、`/events/:slug/edit`
  - 使用无 eyebrow Functional Page Header、现有 Save/Cancel/lifecycle actions
    和 Editorial Outline editor hierarchy；可见 secondary action 统一为
    `Cancel`，不使用 Detail Back/Return to Event 语义。
  - 保留 identity fields、16-Team participation selection、Stage Tag rows、
    Result Tag data-entry table、上下排序 controls、status 与 archive/lifecycle
    行为。
  - Participants 使用四/二/一列 ruled checkbox grid；Stage/Result editor
    复用已批准的 Medium/Small actions、Filled Checkbox、Number Input、paired
    Up/Down controls 与 destructive action 视觉。
  - 只迁移视觉壳层和共享 token，不改变 draft、validation、disabled、保存、
    归档、状态转换或 unavailable Team 处理。
- Event Results & Awards `/events/:slug/outcomes`
  - 使用与其他编辑页一致的无 eyebrow Page Header、Primary Save、可见
    `Cancel`、Editorial Outline work areas、feedback 与只读状态。
  - Team Results 继续显示全部参与队伍并复用紧凑 Data Entry Table、现有
    ResultTag prerequisite、notes、validation 与提交行为。
  - Player Awards 区域只接受已批准的共享表单、checkbox、count/status 与
    surface 视觉迁移；保留当前 Team filtering、候选呈现、选择数量、上限、
    互斥、inactive retained awards、validation 与提交逻辑。
  - Completed 与 Archived Event 继续隐藏 Save、禁用 outcome controls、保留
    历史内容并提供现有 Edit/View 路径。
- 共享状态与响应式验证
  - 验证 `S/A/B/C` Tier、`PREPARING/ONGOING/COMPLETED`、archived、长名称与
    description、列表有/无 Champion、缺少 description/tags/results/awards、
    inactive award history 和真实 16-Team 内容。
  - 验证 whole-card hover/focus-visible/pressed、keyboard-only、touch/no-hover
    与 Reduced Motion；display-only Insignia、Awards cells 不伪造交互。
  - 验证约 `560px`、`760px`、`980px` 的主要收敛状态：Event grid 两列到一列，
    最窄宽度 Tier rail 才堆叠；Participants 四列到二/一列；Awards roster
    五列到二/一列；页面不得产生整体横向溢出。
  - 新增或修改的共享颜色、字体、圆角和重复 shadow 必须进入
    `apps/frontend/src/styles/variables.css` 的语义 token，并与 Mantine theme
    保持一致；Event 专属材质不得升级为通用 Card token。

不包含（out of scope）：

- 新页面、新路由、新 API、Schema、数据迁移、业务逻辑或 Event 内容字段。
- Player Awards 选取功能重设计，包括 Award Assignment Matrix、staged flow、
  candidate-pool model、新筛选/限制/互斥反馈、键盘模型或 frontend state 重构。
- 改变 Event list 的 active-only 范围、archived direct-read 行为、生命周期、
  可编辑边界、ResultTag 排序、award eligibility 或提交 payload。
- 改变 Final Team Results、Participants、Tags 或 Awards 的业务排序。
- 把 Black Metal Plaque、Tournament Insignia 或 Event Tier 色彩推广为通用
  Card、Badge、Logo 或 status 组件。
- Match Overview、Match Detail、Match Create/Edit、Match Entry 或其他 M5
  Pattern。
- 回改已经验收的 M1 Shared Primitives、M2 Data Display 或 M3 Team/Player
  Pattern，除非 M4 暴露明确缺陷并先返回 PRD 审批。
- Sidebar/Main Content Shell 的结构重设计、亮色主题或通用背景方案变更。

## 3. 组件变更

### 3.1 Token、共享 Primitive 与文件边界

- `apps/frontend/src/styles/variables.css`
  - 保留 `S/A/B/C` 的现有语义映射，但把旧 `crest` 角色收敛为 Event
    Insignia 专属的 accent channel、rail、medallion edge、facet、ambient
    trace 与 compact/detail scale token。
  - 新增 Black Metal Plaque 专属的 near-black material、brushed grain、
    cut-corner frame、engraved rule、corner registration mark 与 MVP
    Gold/Mint directional trace token。
  - 复用现有 Championship Gold、Brand Mint、ultraviolet、neutral、text、
    divider、focus、surface 和 motion token；不以页面 class 硬编码颜色。
  - Event 专属 token 必须按用途命名，不得成为 generic Card、Badge 或 Panel
    默认值。
- `apps/frontend/src/styles/primitives.css`
  - 仅在现有 M1/M2 primitive 缺少已批准共享状态时做最小修正；不得在 M4 重写
    `app-action-button`、`app-surface--editor`、`app-edge-plate`、
    `app-data-bay`、form control、feedback 或 table contract。
  - 若 Mantine theme 已映射对应 shared role，则 token 与 theme 同步；纯 Event
    feature material 保持在 Event CSS，不创建第二套 Mantine theme。
- Event 页面 CSS 继续主要拥有布局、间距、responsive 与 pattern-local
  presentation；共享 control/action/status/table 的完整视觉不得复制进页面。

### 3.2 Tournament Insignia

修改 `EventTierBadge.tsx` 与 `EventTierBadge.css`，保留现有 public export，内部
从 filled crest 迁移为 Tournament Insignia：

- props 增加明确的 `size: "compact" | "detail"` 或等价 `data-size`；Tier 仍只
  接收 `EventTier`，不得接收任意颜色或 presentation config。
- `S/A/B/C` subtitle 保持 `ELITE/PREMIER/CHALLENGER/OPEN`；可见 letter 与
  subtitle 必须同时存在，accessible name 为完整 Tier 语义。
- 同一 DOM anatomy 包含 open rails、central faceted medallion、Tier letter 与
  subtitle；compact/detail 只改变 scale、spacing 和允许的 ambient 强度。
- Tier mapping：

| Tier | Accent semantic | 非颜色信号 |
|---|---|---|
| S | Championship Gold | `S` + `ELITE` |
| A | Ultraviolet | `A` + `PREMIER` |
| B | Brand Mint | `B` + `CHALLENGER` |
| C | Neutral gray | `C` + `OPEN` |

- Insignia 本身使用只读 `div`/Mantine `Box`，无 link/button role、`tabIndex`、
  cursor、focus、pressed、selected 或 click handler。
- compact Insignia 可通过父卡 `:hover`/`:focus-visible` 或父级 data state 增强
  局部 rail/trace；detail Insignia 不独立响应 hover。
- Reduced Motion 下移除非必要 transition；Tier 的静态 letter、subtitle、edge
  和颜色区分保持完整。

### 3.3 Semantic Event Status

修改并实际复用 `EventStatusBadge.tsx`：

- 使用 M1 `app-edge-plate`/Semantic Status 结构，显示 Preparing、Ongoing、
  Completed 可读文字。
- status 颜色只作辅助；组件不得从 status 推导 archived，archived 继续由页面
  Alert 表达。
- list/detail 内均为非交互状态，不拥有 hover、focus、pressed 或 click。
- 删除 `EventSummaryCard` 和 `EventDetailHero` 内重复的 status label mapping，
  避免形成三套状态组件。

### 3.4 Insignia Rail Event Summary Card

修改 `EventSummaryCard.tsx`、`EventsList.tsx`、`EventsPage.css`：

- root 保留一个真实 anchor 和现有 `/events/:slug` destination；accessible label
  稳定包含 Event name。
- 卡片结构固定为：
  1. compact Tournament Insignia left rail；
  2. primary heading field：Event name、Semantic Status、可选 description；
  3. Completed 且 `champion !== null` 时的 open Champion strip；
  4. quiet footer：参与队伍数与 destination cue。
- Champion strip 使用开放 rule、Trophy icon、`Champion` label 与 team name；
  不使用 nested card、独立 border box 或交互。Preparing/Ongoing 或无 Champion
  时完整省略，不能保留空槽。
- `description = null`/空白时省略 description node，不写 placeholder；其余结构
  稳定。
- card 统一拥有 hover、focus-visible 和 pressed；状态只改变 edge、surface、
  destination cue 与 compact Insignia 局部 trace，不上浮、不缩放、不触发全局
  glow。
- hover 仅在 fine pointer 环境启用；keyboard focus 获得等价可见反馈，pressed
  不改变几何。
- wide 为两列 list；约 `980px` 前收敛为一列；只在最窄 breakpoint 才把
  Insignia rail 堆叠到内容上方。
- `EventsPage` 移除 `Tournament archive` eyebrow，保留 Page title、
  description 和 Create Event action。
- loading 使用与 Event Card rail/content/footer 近似的 shape-preserving
  skeleton；empty/error 继续使用 M1 开放 page feedback，不包成 Event Card。

### 3.5 Event Detail Identity 与内容层级

修改 `EventDetailHero.tsx`、`EventDetailPage.tsx` 和
`EventDetailPage.css`：

- 保留 Detail Back 与页面 actions 在 identity field 外；Back 使用
  `app-detail-back-link`，Edit 使用 Primary action，Manage/View Results &
  Awards 使用 Related/context action。
- identity field 使用 detail Tournament Insignia、Event name、Semantic Status、
  可选 description 与参与队伍 Inline Fact。
- participant count 使用 M1 Inline Fact/label-first treatment，不再放入可见的
  独立全黑小容器。
- Event Detail hero 不重复显示 Champion。详情响应不包含 `champion` summary，
  用户通过 Final Team Results 的 Championship Gold Winner row 查阅胜者；前端
  不得从 ResultTag、最高分或表格顺序自行推导 hero Champion。
- 新建只读 `EventParticipantsRoster`（或同职责 feature component）：
  - full-width open/ruled section；
  - 使用 API 顺序显示每个 Team name；
  - unavailable participant 保留可读 `Unavailable` status，不能只靠颜色；
  - 16 Team 在宽屏为四列，随后二列、一列；
  - 无 participants 显示准确 open empty copy，不渲染空 grid。
- `EventStageTagsPanel` 与 `EventResultTagsPanel` 位于 Participants 之后的紧凑
  peer grid；它们不与 Participants 构成等高并列栏。
- Stage Tag 使用已批准的 Precise 4px Stage treatment；Result Tag 使用 Edge
  Plate/cut-corner gradient family。Winner ResultTag 增加 Trophy + Gold，
  普通 ResultTag 不冒充 Winner。
- Tags 无数据时保留 section heading 与准确 open empty copy，避免空 panel。
- `EventResultsTable` 继续使用 M2 `app-data-bay`、`app-table-wrap`、
  `app-data-table` 和 `app-data-row--winner`；只做 Event page spacing 对齐，
  不重写 Table primitive。
- Ongoing/Preparing 没有 Results/Awards 时显示现有真实空状态，不用 mock
  completed content；archived、loading、error、not-found 层级保持现有语义。

### 3.6 Black Metal Player Awards Plaque

修改 `EventPlayerAwardsPanel.tsx` 与 Event Detail CSS：

- 一个 `EventPlayerAwardsPanel` root 构成完整 Black Metal Plaque，是该 section
  唯一外层 material；移除 `app-panel` generic Card 与所有 MVP/roster nested
  card 外观。
- plaque header 内显示 `Player Awards`；brushed grain、cut corners、engraved
  rules 和 corner marks 使用 CSS/pseudo-elements，不能成为额外可读内容。
- MVP：
  - 位于 roster 之前的 full-width horizontal field；
  - Trophy + `Event MVP` 提供语义，Gold 仅用于 MVP，Brand Mint 只作结构 trace；
  - 显示 name、API Position、award-time Team 和 inactive historical marker；
  - 不用 nested card。
- First Team 与可选 Second Team：
  - 各自保留可读 group title；
  - 使用 engraved 五格 ruled grid，按 API 顺序渲染；
  - 每格显示 Player name、API Position、award-time Team；
  - MVP 若重复，显示 Trophy/Gold `MVP` marker；
  - Second Team 使用更中性的 rule/supporting text，但内容对比度仍合格；
  - 完全没有 Second Team 时省略该 group。
- 无 awards 时在同一 plaque 内显示 `No player awards recorded.` open content，
  不渲染空 MVP/roster。
- Player name/position/team/status 必须是真实 DOM text；cell 使用 `div`，无
  anchor、button、hover、focus、pressed、selected、pointer cursor 或导航。
- responsive grid 为五列；中等宽度重排为二列，最窄为一列。重排不得打乱
  First/Second 分组和 API 顺序；最后一行不足五格不得补 fake cells。

### 3.7 Event Create/Edit

修改 `EventForm.tsx`、`EventForm.css` 和 `EventFormPage.tsx`，保留所有 state、
handlers、payload 与 modal：

- Page Header 移除 `Tournament setup` eyebrow，保留 title、description、
  Primary Create/Save 与 visible `Cancel`。Cancel 继续触发 unsaved confirm，
  不改为 Detail Back 或 `Return to Event`。
- Event Identity、Participating Teams、Match Stage Tags、Result Tags、Event
  Status 继续使用 M1 Editorial Outline `app-surface--editor`。
- identity fields 的 Select/TextInput/Textarea/Checkbox 直接复用全局 Mantine
  control states，不在 Event CSS 复制完整 input treatment。
- Participants 使用真实 checkbox 的 ruled grid，不使用 participant pill/chip：
  - 宽屏四列、中等二列、窄屏一列；
  - checked、focus-visible、disabled 与 label 都保留；
  - 已选 unavailable participant 可保留或移除；未选 unavailable Team 不可添加；
  - `No active teams are available.` 行为不变。
- Stage Tag rows 使用两个输入、Medium Add Stage 和 Small destructive Remove；
  窄屏允许字段换行但保持 action 与对应 row 关系。
- Result Tags 使用横向可滚动 M2 Data Entry Table：
  - Label、Filled Checkbox Winner、Number Input Points；
  - paired Up/Down order controls 在第一/最后边界 disabled；
  - Small destructive Remove；
  - visual order 必须等于 state `sortOrder`。
- lifecycle Start/Complete/Reopen 与 Archive actions 保持当前条件和 confirm；
  Completed/archived editor 的 read-only 和 action visibility 不变。
- 清理当前只由 barrel export、未被页面使用的旧
  `EventParticipantsSelector`/participant-chip path；不得让 ruled checkbox grid
  与旧 pill selector 并存为两个 Event participant 编辑器。

### 3.8 Event Results & Awards

修改 `EventOutcomesPage.tsx` 与 `EventOutcomesPage.css`，不得重构现有 awards
workflow：

- 移除 `Event workspace` eyebrow；Header 保留 title、Event-specific description、
  Primary Save Outcomes 与 visible `Cancel`。
- Team Results 使用 Editorial Outline owning surface 与 M2 compact Data Entry
  Table；16 个 participants 全部保留。Team、Result Select、Notes 的数据映射、
  prerequisite Alert、readOnly 与 payload 不变。
- `Edit Result Tags` 保持 inline link，不升级为页面级 button。
- Player Awards 继续按 `AWARDS` 的 MVP/First/Second 三段、Team filter 与当前
  checkbox candidate list 呈现；本轮只迁移 spacing、rule、control、count 和
  status visuals。
- award count 使用 neutral Edge Plate；达到 limit 时可以使用 Mint + check 的
  completed signal，但 count 文本 `current/limit` 始终可见，不能只靠颜色。
- First/Second Team 的当前互斥 disabled、每类 limit、MVP 独立选择、inactive
  retained award removal 和 filtered candidates 行为不得改变。
- 不引入 matrix、drag/drop、search、staged flow、candidate card、新 keyboard
  model 或本地 validation state machine。
- `event.resultTags.length === 0` 只阻止 Team Results 录入，不得阻止仍然合法的
  Awards 操作；无 participants、无 candidates 与 retained inactive awards 的
  现有独立退化逻辑必须保留。
- Completed/archived 保留 historical values、隐藏 Save、禁用修改控件并显示
  现有 Edit/View guidance。

### 3.9 清理与文档同步

- 删除旧 filled Tier crest、nested Champion card、footer text status、
  participant meta black container、generic award cards 和重复 Event control
  styling。
- 删除仅服务于已淘汰 participant chips 的 CSS/export；在删除前用引用搜索确认
  无真实 consumer。
- 不删除 proposal preview；它们保留为设计历史，但实施不得从 preview 复制
  hard-coded palette 或独立 token system。
- 更新 `docs/UI_REDESIGN_READINESS_CHECKLIST.md` 中实际完成并验证的 M4 项目。
- 若实现需要改变本 PRD、`docs/DESIGN.md` 或 Event feature PRD 的已批准行为，
  停止对应修改并回到审批。

## 4. API 调用

本批次不新增或修改 API helper、type 或请求时序：

| 页面 / 动作 | 现有调用 | M4 保持约定 |
|---|---|---|
| `/events` load/retry | `fetchEvents(signal)` | 保持 abort、retry、active list 与 response mapping |
| `/events/:slug` load/retry | `fetchEvent(slug, signal)` | 同一响应驱动 identity、participants、tags、results、awards |
| `/events/new` load | `fetchTeams()` | Team options 与现有 division flattening 不变 |
| Create submit | `createEvent(payload)` | payload、submitting、error、成功导航不变 |
| Edit load | `fetchTeams()` + `fetchEvent()` | 并行加载与 retained unavailable participant 合并不变 |
| Edit save/status | `updateEvent(slug, payload)` | lifecycle、confirm 与响应更新不变 |
| Archive | `archiveEvent(slug)` | confirm、error 与成功回 `/events` 不变 |
| Outcomes load | `fetchEvent(slug, signal)` | results/awards 初始化和 candidate source 不变 |
| Outcomes save | `updateEventOutcomes(slug, payload)` | dirty、saving、error、成功导航不变 |

请求状态约束：

- Overview、Detail、Form、Outcomes 的 loading/error/retry/not-found contract
  不得因 skeleton 或 surface 调整而分叉。
- Event Card 不补请求 Detail；Insignia subtitle 和 status label 是稳定的前端
  display mapping，不是新业务数据。
- Event Card Champion、participants、tags、results 和 awards 仅消费各自现有
  response。
- Black Metal Plaque 不排序、不去重、不补齐 awards；只按 type 分组并保留每组
  API 相对顺序。
- 不新增 image/font/material fetch；plaque grain 与 insignia facets 由 CSS 完成。
- 不修改 `EventConfigurationPayload`、`EventOutcomesPayload`、`EventDetail` 或
  `EventListItem`。如果 TypeScript 暴露数据缺口，应返回需求确认而不是扩展 type
  掩盖 Backend contract。

## 5. UI 规格

### 5.1 Events Overview

- **Route**：`/events`。
- **Layout**：无 eyebrow Page Header；Create Event action；两列到一列的 Event
  Card grid。
- **Card**：compact Insignia rail + primary heading/status/description + 可选
  Champion strip + quiet footer。
- **Content states**：
  - Preparing/Ongoing：无 Champion strip；
  - Completed + Champion：显示 Trophy/Gold strip；
  - Completed + null Champion：不伪造 Champion；
  - null description：省略该 node；
  - empty list：开放式 first-use feedback。
- **Interaction**：整卡 anchor 拥有 hover/focus/pressed；内部内容均非交互。
- **Responsive**：约 `980px` 前从两列变一列；仅最窄宽度堆叠 Tier rail；长名称、
  长 Champion Team 与 description 不改变 Card grid geometry。

### 5.2 Event Detail

- **Route**：`/events/:slug`。
- **Layout order**：archived Alert（若有）→ Back/actions → Event identity →
  full-width Participants → Stage/Result peer sections → Final Team Results →
  Player Awards Plaque。
- **Identity**：detail Insignia、`h1` Event name、Semantic Status、description
  与 participant Inline Fact；不重复显示 Champion。
- **Participants**：真实 16 Team 四/二/一列 ruled roster；unavailable 和 empty
  有文字语义。
- **Tags**：两个紧凑同级 section；winner ResultTag 使用 Trophy + Gold。
- **Results**：M2 Data Bay；Winner row 语义与现有 API mapping 不变。Final
  Team Results 是 Event Detail 中查阅 Champion 的唯一位置。
- **Awards**：一个 Black Metal Plaque；MVP → First Team → optional Second Team；
  inactive、MVP repeat、empty 均明确。
- **Lifecycle states**：
  - active Preparing/Ongoing：保持可用 actions 与真实空结果；
  - Completed：outcomes 入口为 View，Edit 仍按 feature PRD行为；
  - archived：Alert、隐藏 Edit、View Results & Awards；
  - loading/error/not-found：保持 Detail page hierarchy 和 retry。
- **Responsive**：identity 在窄屏 Insignia-first；Participants 四/二/一列；
  Tag peers 必要时堆叠；Awards 五/二/一列；Data Bay 自身横向滚动，页面无整体
  横向溢出。

### 5.3 Event Create/Edit

- **Routes**：`/events/new`、`/events/:slug/edit`。
- **Header**：Create/Edit title、description、Primary submit、`Cancel`；
  无 eyebrow。
- **Work areas**：Event Identity、Participating Teams、Stage Tags、Result Tags、
  Event Status 使用 Editorial Outline。
- **Create states**：空 name/description/participants/tags，Tier B，
  countsForRanking checked，status Preparing。
- **Edit states**：Preparing/Ongoing 可编辑；Completed/archived 按现有规则
  read-only；unavailable retained participant 可读且不丢失。
- **Actions**：Save/Create、Cancel + unsaved confirm、Add/Remove、paired
  Up/Down、Start/Complete/Reopen、Archive + confirm 均保持当前行为与 shared
  size hierarchy。
- **Validation**：field/server errors 贴近原 workflow；visual preview 或
  Insignia 不进入本页新增范围。
- **Responsive**：header/actions、participant grid、Stage rows 与 lifecycle
  actions 在窄屏按 DOM 顺序堆叠；Result table 使用局部 horizontal scroll。

### 5.4 Event Results & Awards

- **Route**：`/events/:slug/outcomes`。
- **Header**：Results & Awards、Event-specific description、Save Outcomes、
  `Cancel`；无 eyebrow。
- **Team Results**：16 Team compact Data Entry Table；participants/resultTags
  prerequisite、Result Select、Notes、Edit Result Tags link 保持现有逻辑。
- **Player Awards**：当前三段 checkbox workflow、Team filter、count、limit、
  mutual exclusion、inactive retained awards 与 empty behavior 不变。
- **Read-only**：Completed/archived 隐藏 Save、禁用 outcome controls、保留
  historical content 与现有 Edit Event guidance。
- **Independent degradation**：无 Result Tags 不得遮蔽 Awards；无 active
  candidates 但有 retained inactive awards 时仍显示历史选择。
- **Responsive**：表格局部滚动；checkbox groups 可自然换行；Header actions
  窄屏全宽但保持 Save 在 Cancel 前。

### 5.5 Interaction、Motion 与可访问性

- 所有真实 anchor/button/control 复用 shared focus-visible；Insignia、Champion、
  Participants roster cells、Tag display、Awards plaque cells 不进入 tab order。
- Card hover 只在 `@media (hover: hover) and (pointer: fine)` 中增强；touch
  device 不依赖 sticky hover 才能识别 Tier、status 或 destination。
- `prefers-reduced-motion: reduce` 下取消非必要 transition；不移除静态
  focus、selected、disabled、Winner、Tier 或 category 区分。
- 状态不得只依赖颜色：Tier 有 letter/subtitle，status 有 text，Champion/MVP
  有 Trophy + label，unavailable/inactive 有文字，award count 有数值。
- Page title 保持唯一 `h1`；Section title 维持合理 heading order。
- 装饰 rails/facets/grain/corner marks 使用 `aria-hidden` 或 CSS
  pseudo-elements；screen reader 不重复朗读。
- 可点击 Event Card accessible name 包含 Event name；内部 status/Champion
  仍可作为普通可读内容，但不能制造嵌套交互。
- 文字与控制对比度应在 Default/Hover/Focus/Disabled/Read-only 和所有 Tier
  accent 下保持可读；Gold、Mint、ultraviolet 不能承载正文。

### 5.6 验证矩阵

实施完成后至少验证：

1. frontend typecheck、现有 tests、production build、style literal check。
2. `/events`：四种 Tier、三种 lifecycle、Completed 有/无 Champion、null/长
   description、长 Event/Team 名、0/16 teams、loading/error/retry/empty、
   card hover/focus/pressed、touch、Reduced Motion、560/760/980px。
3. `/events/:slug`：Preparing/Ongoing/Completed/archived、16 participants、
   unavailable participant、0/多 Stage/Result Tags、Winner Tag、0/多 Results、
   loading/error/not-found。
4. Black Metal Plaque：MVP only、First Team、Second Team absent/present、MVP
   repeated in roster、inactive Player、long names/Team、empty、5/2/1 columns。
5. `/events/new`：默认 draft、16 Team checkbox grid、无 active Team、Stage/Result
   add/remove、winner toggle、0/max points、order boundaries、dirty Cancel、save
   error/success。
6. `/events/:slug/edit`：Preparing/Ongoing/Completed/archived、retained unavailable
   participant、Start/Complete/Reopen、archive confirm、server validation。
7. `/events/:slug/outcomes`：16 Team Results、无 participants、无 Result Tags、
   Team filter、0/limit award counts、First/Second mutual exclusion、inactive
   retained award、save failure/success、Completed/archived read-only。
8. keyboard-only：Back/actions/card/forms/order buttons/checkboxes/table controls
   focus 顺序正常；所有 display-only Event patterns 不伪造 focus。
9. 浏览器 console 无 React key、ARIA、CSS 或 state warning；页面无 whole-page
   horizontal overflow。

## 6. 与 Backend PRD 的接口约定

1. M4 不要求 Backend、Schema、migration、API、validation 或 error code 变更。
2. `EventListItem.tier` 直接驱动前端固定 Tournament Insignia mapping；Backend
   不返回视觉 token 或 subtitle。
3. `EventListItem.status` 驱动 Semantic Status；`champion` 非空才显示 Champion
   strip。Frontend 不自行推导 Champion。
4. Event Card 只使用 list response 的 `slug`、`name`、`tier`、`status`、
   `description`、`participatingTeamCount`、`champion`，不补 detail 请求。
5. Event Detail identity 使用 `EventDetail` 现有字段；该 contract 不含
   `champion` summary，hero 不显示或自行推导 Champion。archived 只由
   `archivedAt !== null` 决定，不能从 status 或样式猜测。
6. Participants 按 `participants` 顺序显示；`isEligible` 只控制现有 unavailable
   语义，不能从 `teamArchivedAt` 重写 eligibility。
7. Stage/Result Tags 按 API 顺序显示；Result Winner 只由 `isWinnerTag` 决定。
8. Final Results 使用现有 `teamResults` 与 `resultTags` mapping；显示 rank 是当前
   API 顺序的 presentation，不新增或提交 per-team rank。
9. Player Awards 只按 `awardType` 分组并保留每组 API 相对顺序；不重新计算
   First/Second roster。
10. Award identity 使用 `playerName`、`playerPosition`、`playerIsActive` 以及
    award-time `teamName`；不得用 candidate 或当前 Player/Team 数据覆盖历史。
11. MVP repeat marker 只比较现有 `playerId`；它是 presentation，不创建、删除或
    合并 award。
12. Event Form 继续提交现有 `EventConfigurationPayload`；Participant ruled grid、
    Insignia design 和 editor surfaces 不进入 payload。
13. Outcomes 继续提交现有 `EventOutcomesPayload`；count、filter、disabled、
    completed signal 与 plaque design 不进入 payload。
14. ResultTag prerequisite 与 Awards 可用性保持独立；Frontend 不因缺少
    Result Tags 删除或阻止合法 Player Awards payload。
15. loading/error/not-found/read-only 均使用现有请求结果与 error shape，不添加
    mock Event、fake Champion、placeholder participant 或 fabricated award。
16. 若实现发现现有 contract 无法满足已批准内容，应停止对应部分并返回 Phase 1/
    Phase 2 审批，不得在 page code 中新增 sentinel 或隐式业务规则。
