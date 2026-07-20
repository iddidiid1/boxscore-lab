# Editorial Scoreboard Data Display Backend PRD

> 阶段定义：本 PRD 属于 [Editorial Scoreboard 迁移 PRD 索引](./EditorialScoreboardMigrationIndex.md)
> 的 **M2 — Data Display**。

## 1. 目标

确认 Editorial Scoreboard M2 Data Display 是建立在现有 Team、Player、Event、
Match 数据与请求行为之上的前端视觉和组件迁移，不需要修改后端、Prisma Schema、
数据库、API 契约、统计计算、排序规则或分页规则；通过独立 Backend PRD 锁定边界，
防止 Data Bay、Filter Bar、Pagination、Summary、Star Rating 与特殊行的实施无意
扩展到数据和业务层。

## 2. 范围

文档权威：

- 本 PRD 只负责确认 M2 没有 Backend 实施范围。
- 本 PRD 补充而不取代现有 Team、Player、Event、Match Backend PRD。
- Team、Player、Event、Match Backend PRD 继续分别作为数据、业务规则、排序、
  分页、统计计算、验证和错误行为的 SOT。
- `docs/DESIGN.md` 只拥有 Data Display 的视觉意图，不改变 Backend contract。

包含：

- 保持现有表格、统计 summary、Team rating、filter option、pagination 和特殊行所需
  数据来源不变。
- 保持 Player Rankings 的服务端排序与分页行为不变。
- 保持 Match list 与 Player match history 的现有分页行为不变。
- 保持 Team roster 的现有前端排序数据来源不变。
- 保持 Event ResultTag winner 语义和 Match Other statistics 数据语义不变。
- 若现有 API 无法可靠区分某个批准状态，暂停该状态并重新进入需求确认，不在 M2
  隐式增加字段。

不包含：

- Prisma Schema、migration 或数据回填。
- 新增、删除或修改 API endpoint、payload、response shape、error code 或请求时机。
- 新增存储的 rank、average、total、percentage、star fill、winner 或 pagination 字段。
- 修改 Player Rankings 的服务端排序、rank 或分页算法。
- 将 Team roster 的客户端排序迁移到后端。
- 修改 Event ResultTag 排序、winner 规则或 ranking points。
- 修改 Match Other statistics 的计算、验证或保存规则。
- 为 Filter Bar、Data Bay、row hover、Reduced Motion 或 responsive layout 新增后端配置。

## 3. 业务规则

本批次不新增或修改业务规则。实施期间必须保持：

1. Player Rankings 继续以 `PlayerStatisticsBackendPRD.md` 定义的服务端筛选、排序、
   rank 和 pagination 为权威；前端不得重新计算全局 rank 或对单页结果二次排序。
2. Player Match History 继续使用 Player Statistics API 返回的 items 与 pagination；
   page 归一化、空集合和“最新请求生效”规则保持不变。
3. Matches Overview 继续使用 Match Management API 的服务端分页与筛选结果；
   Filter Bar 和 Pagination 只改变呈现，不改变请求触发或 query 含义。
4. Team Detail Roster 继续对现有 Team detail 响应进行前端排序，不增加服务端排序参数。
5. Team Summary、Player Stat Summary 和 Match Box Score 的数值、百分比与空值显示
   继续从既有响应派生；M2 不存储显示格式或新增聚合。
6. Team overall rating 继续使用既有十点制数据。五颗星只是只读映射，每颗代表两分，
   部分填充仅是视觉计算；不得反写、四舍五入或改变原值。
7. Event Final Team Results 继续以 Event API 已按
   `resultTag.sortOrder ASC`、`resultTag.rankingPoints DESC`、`teamName ASC`、
   `teamId ASC` 生成的稳定顺序为权威，并通过 `isWinnerTag` 判断 Winner；
   Championship Gold 只表达该既有语义。
8. Match Other statistics 继续使用既有 Other 数据、录入、校验和计分规则；
   Operational Neutral 只表达该行与 Player 行不同，不代表 warning、error 或 winner。
9. Hover、focus、pressed、selected、disabled、local overflow 与 Reduced Motion
   均为前端状态，不形成新的服务端状态。

若实现发现某个 approved visual state 无法由现有 props、query state 或 API response
可靠推导，该状态必须暂停并重新进入需求确认；不得在 M2 中猜测业务含义或修改后端。

## 4. Schema 变更

无。

- 不修改 Prisma schema。
- 不创建 migration 或执行数据回填。
- 不新增、删除、重命名字段、枚举、关系、索引或约束。
- 不存储 rank、average、total、percentage、star fill、winner、filter 或 pagination
  的视觉派生结果。

## 5. API 规范

无 API 变更。

- endpoint、HTTP method、path/query parameter、request body 和 response shape 不变。
- 字段可空性、序列化、HTTP status、error payload 和缓存行为不变。
- Player Rankings、Player Match History 与 Matches Overview 的请求时机、取消旧请求、
  page 归一化及 URL 同步保持对应 feature PRD 现状。
- Team Detail、Event Detail、Match Detail 与 Match Create/Edit 不新增仅用于
  Data Bay、Summary、Star Rating 或特殊行的请求。
- 不为 responsive、hover、Reduced Motion 或局部滚动新增配置 API。

## 6. 验证规则

无后端验证变更。

- 所有 DTO、query validation、field validation 与业务前置条件保持现状。
- Match Other row 内的 NumberInput 继续遵守 Match Management Backend PRD；
  M2 不改变允许空值、上下限、步进、必填性或错误收集方式。
- Team overall rating 继续遵守现有 `0–10` 验证和精度规则；fractional star 不参与验证。
- Event winner 继续来自 ResultTag 数据，不接受由前端视觉状态提交的 winner 值。
- Filter、sort 与 page 参数继续由各自 Backend PRD 验证；样式 class、ARIA state
  和视觉 modifier 不进入 payload。

## 7. 错误码

无错误码或错误结构变更。

- 保持所有现有 HTTP status、业务错误码和标准 error payload。
- M2 不吞掉、改写、合并或重新分类后端错误。
- Data Bay 的 loading、empty、error 和 retained-content 表现只消费既有请求状态。
- 若现有模块没有 retry handler，不得为了视觉完整性伪造 Retry API 行为。
