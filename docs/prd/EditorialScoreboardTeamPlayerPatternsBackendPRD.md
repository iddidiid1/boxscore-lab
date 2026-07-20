# Editorial Scoreboard Team Player Patterns Backend PRD

## 1. 目标

确认 Editorial Scoreboard M3 Team and Player Patterns 是建立在现有 Team 与 Player
数据、统计和请求行为之上的前端视觉与组件迁移，不需要修改后端、Prisma Schema、
数据库、API 契约或业务规则；通过独立 Backend PRD 锁定边界，防止 Team identity、
Score Ledger、Leader Card、Performance Profile 与 Honors Ledger 的实施无意扩展到
数据和业务层。

## 2. 范围

文档权威：

- 本 PRD 只负责确认 M3 没有 Backend 实施范围。
- 本 PRD 补充而不取代现有 Team 与 Player Backend PRD；后者继续作为实体、统计、
  筛选、排序、归档可见性、验证和错误行为的 SOT。
- `docs/DESIGN.md` 拥有 M3 Team/Player Pattern 的视觉意图，不改变 Backend contract。

包含：

- 保持 Teams Overview、Team Detail 与 Team Create/Edit 现有所需 Team 数据来源不变，
  包括 division、logo URL、primary color、overall rating、total points、description、
  archived state、五轴 profile、team summary 与 roster。
- 保持 Players Overview 与 Player Detail 现有所需 Player 数据来源不变，包括固定顺序
  leaders、number、position、current Team、inactive/team archived state、统计 summary、
  backend 提供的 `0–100` performance values、awards 与 match history。
- 保持 Team list 只返回 active Team、archived Team detail 仍可读取、Manage action
  对 archived Team 不可用等现行业务语义。
- 保持 Player Awards 使用 API 返回的 award type、Event、award-time Team 与可选 notes；
  不使用 Player 当前 Team 覆盖历史归属。
- loaded、missing、failed 或深色 logo 的对比与 initials fallback 只在前端呈现；
  不增加 logo 分析、衍生图片或 fallback 数据。
- fractional stars、segmented meter、Team identity surface、category glow、hover、
  responsive stacking 与 accessible copy 均为前端派生状态。
- 若批准的视觉状态无法由现有 props、query state 或 API response 可靠推导，暂停该状态
  并重新进入需求确认，不在 M3 隐式增加字段或猜测业务含义。

不包含：

- Prisma Schema、migration、数据回填、新实体、新字段或新存储值。
- 新增、删除或修改 API endpoint、payload、response shape、error code 或请求时机。
- 存储 logo 对比度、initials、identity surface、star fill、meter segment、glow、
  leader category color 或其他视觉派生结果。
- 修改 Team points、overall rating、五轴 profile、归档、roster 或 division 业务规则。
- 修改 Player leaderboard、统计、Performance Profile、Award 可见性或历史 Team 归属规则。
- Event Player Awards 选取流程重设计。
- M2 Data Display、M4 Event Patterns、M5 Match Patterns、Sidebar、Page Header 或
  Light mode 的后端工作。

## 3. 业务规则

本批次不新增或修改业务规则。实施期间必须保持：

1. Teams Overview 继续只消费 Team list API 返回的 active Team，并按既有 division
   分组和顺序展示；M3 不把 archived Team 加回列表。
2. Team Card 的 total points 与 overall rating 直接使用既有响应。Score Ledger 只重组
   信息层级，不重新计算 points，不四舍五入 rating，也不把两者互相派生。
3. Team Detail 对 active 与 archived Team 均保持可读取；archived notice 和 Manage
   action 可见性继续由 `archivedAt` 决定，视觉 surface 不形成新的归档状态。
4. Team profile radar 继续直接使用 defense、offense、consistency、cohesion、depth
   五项 rating。`profileRating = null` 继续表示没有 profile，不以零值或默认五边形替代。
5. Team Create/Edit 的 Identity Proof 只读取当前前端草稿。它不提交额外字段、不触发
   独立请求，也不改变 name、division、logo URL、primary color、overall rating 或
   profile rating 的保存和验证规则。
6. Logo artwork 仅把现有 `logoUrl` 当作图片源。图片加载失败与 URL 缺失在前端回退为
   derived initials；不向后端报告或持久化图片状态。
7. Initials 由展示名称的前两个非空词生成大写首字母；空 Team 草稿使用 `New Team`
   后得到 `NT`。该值是前端显示结果，不写入 Team。
8. Player leaders 继续使用 Player Statistics API 固定返回的 points、rebounds、
   assists、rating 四项及既有顺序。`player = null`、`team = null` 表示无合格 Player，
   不代表存在数值为零的虚拟 leader。
9. Player detail 的 number、position、current Team、`isActive` 与 Team `archivedAt`
   均直接使用 API 响应；inactive Player 与 archived Team 是可同时存在的独立状态。
10. Performance Profile 继续直接使用 API 返回的 `0–100` 整数。十段与部分末段只是
    前端可视映射；不得从当前页面统计、分页结果或 CSS 宽度反推、修正或保存该值。
11. Player Awards 继续按 API 顺序显示。Event 和 Team 必须分别来自
    `awards[].event` 与 `awards[].team`；后者是颁奖时 Team，不得替换为 Player 当前
    Team。空 notes 只省略显示，不改变数据。
12. Award type 的图标映射只覆盖现有 `EVENT_MVP`、`ALL_EVENT_FIRST_TEAM` 与
    `ALL_EVENT_SECOND_TEAM`。若 API 出现未知类型，保留可读文字并使用 neutral
    presentation，不丢弃记录、不猜测新的 award 业务语义。
13. hover、focus-visible、pressed、image failure、glow、partial segment、
    fractional star、responsive stacking 与 Reduced Motion 都是前端状态，不形成新的
    服务端状态或请求参数。

若实现发现某个 approved visual state 无法由现有响应可靠推导，必须暂停该状态并重新
进入需求确认；不得在 M3 中修改后端以迎合视觉结构。

## 4. Schema 变更

无。

### 4.1 新增 / 修改字段

无。

- 不修改 Prisma schema。
- 不新增、删除、重命名字段、枚举、关系、索引或约束。
- 不存储 initials、logo load state、contrast result、star fill、meter segments、
  leader category treatment 或 award icon。
- 不新增或存储平均值、总计、leader-relative percentage 等聚合或视觉派生字段。

### 4.2 迁移说明

无 migration、数据回填或数据丢失风险；本批次不运行 `pnpm db:migrate`。

## 5. API 规范

无 API 变更。

- Team 与 Player 的 endpoint、HTTP method、path/query parameter、request body、
  response shape、字段可空性和序列化保持不变。
- Team list/detail/create/update/archive/restore 与 Player list/detail 请求时机、
  URL/query 同步、取消旧请求、分页和 error handling 保持对应 feature PRD 现状。
- Team editor preview 不新增 preview endpoint，也不因草稿变化增加请求。
- Logo missing/failed/dark state 不新增检测或上传 endpoint。
- Player leader category、meter segment、award icon 与 visual status 不进入 response。
- 不为 hover、Reduced Motion、breakpoint 或 visual preference 增加配置 API。

M3 继续消费：

- Team list response 的 division group 与 Team `slug`、`name`、`logoUrl`、
  `primaryColor`、`overallRating`、`totalPoints`。
- Team detail response 的 identity、`archivedAt`、`profileRating`、team stats 与
  roster。
- Player list response 的固定四项 `leaders`。
- Player detail response 的 identity/status、`performanceBars`、`awards`、
  statistics、filters 与 match history。

## 6. 验证规则

无后端验证变更。

1. Team Create/Edit 的所有 DTO、必填、范围、格式、重复检查和错误收集规则保持现状；
   Identity Proof 不参与验证，也不产生额外 error detail。
2. `overallRating` 与五轴 profile rating 继续遵守既有范围和精度规则；fractional
   star 与 radar 均不反写格式化结果。
3. `logoUrl`、`primaryColor`、division 和 Player 字段继续由现有 Backend PRD 验证；
   浏览器图片加载失败不等同于后端 validation error。
4. Player list/detail 的 query、event scope、page 与 pageSize 继续按
   Player Statistics Backend PRD 验证；M3 不增加视觉 query。
5. Award type、Event 与 award-time Team 的有效性继续由现有 Event/Player 业务规则
   保证；前端图标映射不参与保存验证。
6. CSS class、ARIA label、image error state、segment fill 与 category variant
   不进入任何 payload。

## 7. 错误码

无错误码或标准错误结构变更。

- 保持所有 Team 与 Player endpoint 的现有 HTTP status、业务错误码、message 和
  `details`。
- 404、validation、network 与 server error 的前端呈现可以迁移视觉，但不得吞掉、
  改写、合并或重新分类后端错误。
- 图片加载失败是局部前端 fallback，不产生 API error、toast 或重试请求。
- 若现有页面没有独立图片重试行为，不为视觉完整性伪造新的 Retry API 行为。
