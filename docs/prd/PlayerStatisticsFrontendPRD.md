# Player Statistics Frontend PRD

## 1. 目标

将现有 Player 排行榜与详情 mock 页面接入真实后端数据，使用户能够查看 active Player 的动态排行榜、筛选统计与领先者，并通过 Player 详情查看 Overall 或指定 Event 的表现、比赛历史、荣誉和可解释的 Performance Bars，同时保持现有 sports-console 视觉与交互布局。

## 2. 影响页面

### 2.1 In Scope

- 修改 `/players` Player 列表页，移除 mock 数据并接入真实 Player 排行榜 API。
- 保留并接通现有 Event、Team 和 Position 筛选、统计列排序、分页及统计领先者卡片。
- 列表仅展示 active 且至少拥有一场符合统计范围比赛的 Player，不展示零出场 Player 或 inactive Player。
- 排行榜展示 Points、Rebounds、Assists、Field Goal Percentage、Three Point Percentage 和 Rating 等后端动态计算结果。
- 修改 `/players/:slug` Player 详情页，使用不可变 Player slug 加载真实资料与统计。
- Player 详情支持 Overall 与指定 Event 筛选，并展示汇总统计、比赛历史和 Event Awards。
- inactive Player 不出现在排行榜，但其历史详情页仍可通过直接地址访问并明确显示 inactive 状态。
- 保留现有 Performance Bars 视觉设计，展示后端按当前统计范围领先者比例动态计算的值。
- 为两个页面补全 loading、empty、not-found、error 和正常数据状态。
- 复用现有 semantic tokens、Mantine theme、共享组件和页面布局；不进行无关视觉重设计。

### 2.2 Out of Scope

- 新增 Player 创建、编辑、停用、恢复或转会页面；Player 管理仍通过 Team create/manage 页面完成。
- 在 Player 页面提供任何写操作。
- 展示 `PREPARING` Event、voided Match、已归档 Event 或已删除 Event 对应的统计与比赛历史。
- 新增独立 Standings 或 Statistics 页面。
- 引入新的组件库、认证流程、实时数据、跨赛季比较或新的 Season UI。
- 修改 Teams、Events 或 Matches 页面现有布局与交互，除非 Phase 2 明确识别出 Player 导航所需的最小连接调整。

## 3. 组件变更

- `PlayersPage`：移除 mock 派生逻辑，管理服务端 query、加载、错误、空状态与分页。
- `PlayerRankingFilters`：使用 API `filterOptions`，Event 使用数值 id，并实现 Event → Team → Position 单向级联。Event 变化后重置不再有效的 Team 与 Position；Team 变化后重置不再有效的 Position；任何筛选变化均重置到第 1 页。
- `StatisticLeaderCards`：直接展示 API 固定返回的四项 leaders。每张卡始终保留；当某项 `player` 与 `team` 为 `null` 时显示 `0.0` 和可访问文本 `No eligible players`，不得伪造 Player 或 Team。
- `PlayerRankingTable`：使用服务端 rank、排序和分页，不在客户端二次排序；百分比 `null` 显示 `—`。
- `PlayerDetailPage`：按 slug 加载详情，管理 Event 筛选和比赛历史分页，移除全部 mock 数据。
- `PlayerProfileHeader`：增加 Player inactive 与 Team archived 状态显示。
- `PlayerStatSummary`：展示后端统计对象，不自行重新计算。
- `PlayerPerformanceBars`：保留现有布局，消费 API 按领先者比例返回的 `0–100` 值，不在前端重复计算。
- `PlayerMatchHistory`：接入真实 Match、Event、Opponent 与当场统计；使用 API 每场返回的比赛时 Team，不以 profile 中的当前 Team 覆盖，并使用 Match id 链接 `/matches/:id`。历史列表展示 Match/Opponent、Date、Event、Points、Rebounds、Assists、FG%、3PT%、Minutes 与 Rating；Stage 可保留为 Match/Event 辅助信息，但不是必需列。
- 新增或扩展共享 API client/types，统一处理 `{ statusCode, error, message, details }`。

## 4. API 调用

| Action | Method + Path | When |
|---|---|---|
| 加载/筛选/排序/翻页排行榜 | `GET /api/players` | 首次进入及 query 状态变化 |
| 加载 Player 详情与历史 | `GET /api/players/:slug` | 进入详情、Event 变化或历史翻页 |

## 5. UI 规格

### 5.1 PlayersPage

- **Route**：`/players`。
- 保留现有 header、filters、leader cards、ranking table 与分页布局。
- 默认 Overall、全部 Team、全部 Position、`points desc`、第 1 页。
- Event、Team、Position、排序或方向变化时请求服务端并回到第 1 页；分页变化仅更新 page。
- Event options 始终使用 API 返回的全部可见 `ONGOING`/`COMPLETED` Event，不因 Team 或 Position 缩小。指定 Event 后，Team options 只显示该 Event 的未归档 participants；Overall 时只显示至少有一名排行榜合格 Player 的未归档 Team。Position options 只显示当前 Event 与 Team 范围内至少有一名排行榜合格 Player 的位置。
- 上游筛选变化后，若当前 Team 不在新的 Team options 中，则重置为 All Teams；若当前 Position 不在新的 Position options 中，则重置为 All Positions。重置必须同步替换 URL query，且不得保留不可见的失效选项。
- URL query 同步 `eventId`、`teamId`、`position`、`sortBy`、`sortDirection`、`page`，刷新与前进/后退可恢复状态；默认值可省略。
- 首次解析 URL 时只接受上述受管理字段和值；未知字段或无效值按 §6.16 修正。`pageSize` 不作为用户可配置的 URL 状态，前端始终按页面配置发送默认值 `10`。
- API pagination 中 `page` 是后端归一化后的有效页码。若与 URL 请求页码不同，前端使用 history replace 更新 URL，不新增浏览历史且不重复请求相同数据。`totalItems = 0` 时按 `page = 1`、`totalPages = 1` 渲染空状态。
- 排名使用 API `rank`；点击 Player 进入 `/players/:slug`。
- leaders 使用当前 Event、Team、Position 筛选后的完整候选集。指定 Event 后只展示该 Event 范围内、再满足当前 Team 与 Position 条件的四项 leader；不受当前页、排行榜排序字段或排序方向影响。
- loading 使用现有骨架/占位模式；首次加载失败显示整页 error + retry；已有数据后的请求失败保留当前内容并显示非阻塞错误。
- 请求状态遵循“最新请求生效”：筛选、排序或分页触发新请求时取消尚未完成的旧请求；即使底层取消未及时生效，也只有与当前 query 状态匹配的最新请求可以更新数据、pagination、filterOptions、loading 或 error，较早请求的成功或失败结果必须忽略。
- 首次且尚无可展示数据时使用 skeleton/占位；已有成功数据后的后续请求保留当前内容并显示非阻塞 loading 状态，筛选控件保持可操作。后续请求失败时保留已有内容和用户最后选择的 URL/query 状态，并显示可重试的非阻塞错误。
- 无候选 Player 时排行榜显示 empty state；四张 leader cards 仍固定显示数值 `0.0`，并以 `No eligible players` 明确表示不存在真实领先者，不显示伪造的 Player 或 Team。
- 宽表在窄屏横向滚动；排序按钮具备可辨识 label 与当前方向状态。

### 5.2 PlayerDetailPage

- **Route**：`/players/:slug`。
- 保留 back link、profile hero、Performance Bars、Event filter、stat summary 与 match history。
- 默认 Overall；Event options 来自该 Player 的合格出场 Event。Event 变化时比赛历史回到第 1 页并重新请求。
- 详情页的 Event 切换和 Match History 翻页同样遵循“最新请求生效”；旧请求不得覆盖当前 Event、page、stats、Awards、Performance Bars 或 Match History。首次加载与已有数据后的 loading/error 展示规则与排行榜一致。
- URL query 同步可选 `eventId` 和比赛历史 `page`。
- 详情 URL 只管理 `eventId` 与比赛历史 `page`；其他 query 字段按 §6.16 移除。
- Match History 使用与排行榜相同的分页归一化规则；响应 page 与 URL 不一致时使用 history replace 修正 URL，不重新计算或猜测最后一页。
- profile 显示姓名、号码、Position 与当前 Team；inactive Player 和当前 Team archived 使用语义状态标识，不仅依赖颜色。
- stats 展示 PTS、REB、AST、FG%、3PT%、MIN、Rating 与 games played。零场时 games played 与普通平均值显示数值 `0`/`0.0`，FG% 与 3PT% 的 `null` 显示 `—`；不得把普通零值显示为缺失，也不得把不可计算的百分比显示为 `0.0%`。
- Awards 展示 award type、Event、颁奖时 Team 和 notes；必须使用 API `awards[].team`，不得替换为 Player 当前 Team；无 Award 时不伪造内容。
- Match history 按 API 顺序展示以下信息：Match/Opponent、Date、Event、Points、Rebounds、Assists、FG%、3PT%、MIN 与 Rating。Match/Opponent 使用 `id` 和 `opponent`，Date 使用 `playedAt`，Event 使用 `event`；比赛时 Team 使用 API `matches.items[].team`，不得替换为 Player 当前 Team。`opponent = null` 时显示 `—`，但仍保留该 Match 行及 `/matches/:id` 链接，不显示字符串 `null`。点击记录进入 `/matches/:id`。
- 详情 404 显示 Player not found；网络/500 显示 error + retry；存在 Player 但筛选范围无出场时仍展示 profile、零场统计与空历史。
- 当 API 返回 `scope.available = false` 时保留 Player profile 和其他可见 Event options，显示 `Statistics are unavailable for this event.`；统计区使用标准零场展示且 Match History 为空，不得自动改为或伪装成该 Player 的 Overall 数据。Awards 独立使用 API 返回值：未归档、未删除的 `PREPARING` Event 可以有 Award，已归档或已删除 Event 的 Awards 为空。
- API 日期为 UTC ISO，按浏览器本地时区显示。

### 5.3 Performance Bars

- 保留 Points、Rebounds、Assists 三条 `0–100` 表现条。
- 直接展示 Backend PRD §3.16 返回的领先者比例整数，不在前端根据当前页面数据重新计算。
- 比较范围随详情页的 Overall/Event 筛选同步变化。
- inactive Player 或 archived Team 下的 Player 仍可显示 bars，但不参与领先者基准群体。
- 无排行榜合格比较群体或对应最高值为 `0` 时显示空进度值 `0`，并保留实际统计值供用户理解。
- 通过可访问文本说明该 bar 表示“相对于当前统计范围领先者的表现”，不能只以长度表达含义。

### 5.4 响应式与样式

- 继续使用 `variables.css` semantic tokens、Mantine theme 与现有共享样式。
- 不硬编码新颜色、字体、圆角或重复阴影。
- 保持桌面信息密度；窄屏筛选器堆叠、表格横向滚动、详情区纵向排列。
- loading、empty、inactive、archived、error 状态必须具有文本或可访问标签。
- 页面不得直接渲染字符串 `null`、`undefined`、`NaN` 或空白占位。API 数值字段的 `null` 保留为数据层语义，展示时统一使用 `—`；身份或状态对象为空时使用语境明确的文本，例如 leader 的 `player = null` 显示 `No eligible players`。可选 notes 为空时省略 notes 区域，不显示 `—`。

## 6. 与 Backend PRD 的接口约定

1. 前端不计算权威平均值、命中率、rank、leaders 或 Performance Bars；只格式化 API 数值。
2. Overall 通过省略 `eventId` 表示，不发送 `season-total` 等 mock sentinel。
3. 所有 id query 使用 number；Player 路由使用不可变 slug。
4. 排行榜使用服务端分页和排序，不对当前页数据再次排名或生成 leaders。
5. 百分比 `null` 与数值 `0` 必须区分；前者显示 `—`，后者显示 `0.0%`。
6. inactive Player 不会从列表 API 返回，但详情 API 仍可返回；前端不得把 inactive 当作 404。
7. Event/Team filter options 与当前可见统计资格一致；前端不补充 archived/deleted/PREPARING 项。
8. API error 按统一结构处理：`PLAYER_NOT_FOUND` 显示 not-found；query validation 提示并回退到有效默认 query；网络/500 提供 retry。
9. Match history 使用 API 给出的对手与统计，不从其他前端列表拼接。
10. Performance Bars 严格使用 Backend PRD §3.16 的结果；前端不得以当前分页数据寻找领先者或重新归一化。
11. Leader cards 始终消费 Backend 固定顺序返回的 `points`、`rebounds`、`assists`、`rating` 四项。候选集为空时保留四张卡，并根据 `player = null`、`team = null` 显示无合格 Player 状态；不得把该状态误解为存在一名统计值为零的领先者。
12. 筛选 options 严格使用 Backend PRD §3.12 的 Event → Team → Position 单向级联结果。下游条件不反向改变上游 options；上游变化导致下游选择失效时，前端自动重置失效项并同步 URL。
13. 排行榜及 profile 的 Team 表示 Player 当前 Team；比赛历史 Team 表示比赛时 Team；Award Team 表示颁奖时 Team。前端必须直接使用各响应位置的 Team 对象，不得根据 Player 当前 Team 重新拼接或覆盖历史归属。
14. 详情页必须根据 `scope.available` 区分“可见 Event 中零出场”和“Event 当前不可用于统计”。两种情况都不得显示原始 `null`；前者使用正常 empty state，后者额外显示 unavailable 状态说明。`scope.available` 只描述统计可用性，不控制 Awards；Awards 始终直接展示 API 按独立可见性规则返回的集合。
15. 排行榜和 Match History 均以 API pagination 为权威。空集合显示第 1 页且 `totalPages = 1`；请求页码越界时接受后端修正后的 page，并使用 history replace 同步 URL，避免额外历史记录或重复请求循环。
16. URL query 恢复必须只修正无效部分并保留其他有效状态：
    - 未知 query 字段直接移除；前端管理的 query 中不保留 `pageSize`，始终向 API 发送页面固定值 `10`。
    - 无效或不存在的 `eventId`（包括 API `EVENT_NOT_FOUND`）移除 Event，并同时重置 Team、Position 与 page。
    - 无效或不存在的 `teamId`（包括 API `TEAM_NOT_FOUND`）移除 Team，并同时重置 Position 与 page。
    - 无效 `position` 只移除 Position 并重置 page。
    - 无效 `sortBy` 或 `sortDirection` 将排序整体恢复为默认 `points desc`，并重置 page。
    - 无效 `page` 恢复为第 1 页；详情页使用相同规则。后端归一化的合法越界 page 继续按第 15 条处理。
    - 所有默认值按既有规则从 URL 省略。修正 URL 必须使用 history replace，不新增浏览历史。
    - 自动修正后最多重试一次请求。若修正后的请求仍返回 validation/not-found 错误，停止自动重试并显示 error + retry，避免请求循环。
    - 若 API `VALIDATION_ERROR.details` 同时包含多个 query 字段，前端一次性修正所有可识别字段后再进行唯一一次自动重试；不得逐字段连续重试。
17. 所有由 URL/query 状态驱动的读取请求必须实现“最新请求生效”：
    - 发起新请求时取消同一页面尚未完成的旧请求；取消仅用于节省工作，不得作为正确性的唯一保障。
    - 每个响应在提交 UI 状态前必须确认它仍对应当前最新 query；过期响应及其 error/finally 状态更新全部忽略。
    - URL 与筛选控件始终表达用户最后一次操作，不得被较早完成的请求回滚。
    - 首次无数据加载使用阻塞式 skeleton/占位；已有数据刷新使用非阻塞 loading 并保留内容与可操作筛选；刷新失败保留旧数据并显示 retry。
