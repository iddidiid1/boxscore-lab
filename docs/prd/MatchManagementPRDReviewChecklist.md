# Match Management PRD Review Checklist

## 1. Review 目标

本清单用于在 Match Management 进入代码实现前，逐项确认 Backend PRD 与 Frontend PRD 之间的契约、与项目级规则的一致性，以及实现和验收所需的缺失规格。

关联文档：

- `docs/prd/MatchManagementBackendPRD.md`
- `docs/prd/MatchManagementFrontendPRD.md`
- `AGENTS.md`
- `CLAUDE.md`
- `docs/DELETION_RULES.md`
- `prisma/schema.prisma`

状态约定：

- `[ ]` 未讨论或未修订
- `[x]` 已作出决定并完成相关 PRD 修订
- 每项应记录“决定”和“修改位置”，避免只在对话中确认。

## 2. 总体结论

- 两份 PRD 的核心契约基本一致。
- 整体符合“保存原始记录、运行时计算派生统计、保护历史数据、保持 MVP 简单、沿用现有 UI 与设计 token”的项目方向。
- 当前仍存在会导致前后端实现分叉或历史数据语义不明确的问题，不建议在阻塞项确认前开始代码实现。

## 3. 实现前阻塞项

### 3.1 作废 Match 对全站统计查询的影响范围

- [x] 明确本次 Backend 实现是否需要审计并修改所有现有 Match 派生统计查询，使其统一包含 `Match.voidedAt = null`。
- [x] 若相关统计 API 尚未实现，在 Backend PRD 中明确：后续所有 Player、Team、Standings、Leaderboard 等 Match 派生查询必须排除作废 Match。
- [x] 消除“所有统计查询必须排除作废 Match”与“统计页面/API 实现属于 Out of Scope”之间的范围歧义。
- [x] 列出本次实际受影响的查询或模块；若不存在，也应明确记录。

决定：本次 Backend scope 包含对现有 Match 派生统计查询的数据一致性修正。至少修改 `apps/backend/src/modules/teams/teams.service.ts` 中的 `getTeamStats()` 与 `getPlayerStats()`，通过关联 Match 的 `voidedAt = null` 排除作废比赛；不新增或扩展 Standings、Leaderboard、Player Detail 等统计 API。

修改位置：`MatchManagementBackendPRD.md` §2.1 In Scope、§2.2 Out of Scope。

### 3.2 Archived Team 的历史 Match 编辑与恢复规则

- [x] 明确 Match 创建后，如果参赛 Team 被归档，该 Match 是否仍可编辑。
- [x] 明确包含 archived Team 的作废 Match 是否允许恢复。
- [x] 如果允许编辑，明确 `form-options` 如何返回当前 Match 使用的 archived Team 及其 roster 数据。
- [x] 明确 archived Team 场景下是否允许新增当前 active Player，还是只能保留、修改或移除已有统计。
- [x] 同步 Backend 的状态校验、错误码以及 Frontend 的只读/可编辑状态。

决定：采用有限编辑规则。创建时禁止 archived Team；历史 Match 可继续编辑，但 archived Team 一侧只能保留、修改或移除已有 Player stats，不得新增 Player，并直接使用 Match 详情构建已有统计行。archived Team 不单独阻止恢复，只要仍是 Event participant 且其他恢复条件满足即可。详情 Team 摘要增加 `archivedAt` 供前端显示状态和执行规则。

修改位置：`MatchManagementBackendPRD.md` §2.1、§3.6、§3.13、§5.1、§5.4、§6.3；`MatchManagementFrontendPRD.md` §2.1、§5.4、§6。

### 3.3 历史 `rating = null` 的迁移语义

- [x] 确认历史 `MatchPlayerStat.rating = null` 是否在业务上等价于评分 `0`。
- [x] 若不等价，决定采用以下哪种策略：保持 schema nullable 但新请求必填；为历史数据制定其他迁移规则；或引入明确的兼容展示规则。
- [x] 说明该决定对历史详情、球员平均评分和后续统计的影响。
- [x] 确保迁移不会在未确认的情况下把“未评分”改写为“零分”。

决定：当前项目尚无生产或真实历史 Match 数据，只有可丢弃的开发/playground 数据，因此接受将现有 `rating = null` 归一为 `0`，并把 schema 收紧为 `Float @default(0)`。新建和编辑请求继续要求 `rating` 为 `0–10` 的非空数值。本决定只适用于当前无真实历史数据的迁移阶段，不作为未来修改真实历史评分的通用政策。

修改位置：`MatchManagementBackendPRD.md` §4.2。

### 3.4 Event 硬删除 cascade 与历史数据保护约束

- [x] 明确 `CLAUDE.md` 中“Historical match/award/stat records must never be destroyed”是否禁止任何 Event → Match cascade 删除。
- [x] 决定保留现有 `onDelete: Cascade`，并把约束解释为“普通应用流程禁止硬删除”；或改为数据库层 `Restrict`。
- [x] 若保留 cascade，在 Backend PRD 和 `DELETION_RULES.md` 中明确唯一允许触发硬删除的边界及风险。
- [x] 若改为 Restrict，评估 Event、EventParticipant、EventTeamResult、EventPlayerAward 和 Match 相关关系的一致性，先形成 schema 变更计划。

决定：以已批准并实现的 Event Management 设计为准。MVP Event API/UI 只提供 `archivedAt` 归档，不提供 hard delete、soft delete、unarchive 或 restore。保留 Event 对 Participant、Result、Award、Match 等 Event-owned records 的现有数据库 cascade；该 cascade 仅描述 MVP 之外受控数据库维护操作的引用行为，不是产品删除能力。正常应用流程不得销毁历史记录。

修改位置：`CLAUDE.md` Deletion Policy；`docs/DELETION_RULES.md` Guiding Principles、Event rule、Soft Deletion Fields。

## 4. 前后端接口契约完善项

### 4.1 Validation `details[].field` 路径格式

- [x] 定义嵌套字段路径格式，例如 `teams[0].playerStats[2].rating` 和 `teams[1].otherStats.points`。
- [x] 定义 Team 级、Player 行级和表单级错误无法定位到单字段时的表达方式。
- [x] 确保 Frontend 可以稳定地将 Backend 错误映射到对应 Team、Player 和输入框。

决定：`details` 元素统一为 `{ field, message }`。`field` 使用原始请求 payload 路径；Team、Player 行和 Other 行均支持行级路径，无法定位到具体输入项的整体错误使用 `form`。后端保持原始数组索引和稳定错误顺序，前端按提交时保存的索引上下文映射，未知路径回退到表单顶部。

修改位置：`MatchManagementBackendPRD.md` §7；`MatchManagementFrontendPRD.md` §5.3。

### 4.2 前后端数值范围一致

- [x] Frontend PRD 将整数统计明确限制为与 Backend 相同的 `0–10000`。
- [x] 明确输入控件、客户端校验和 Backend 校验均使用相同边界。

决定：所有 Player 和 Other 的整数统计统一限制为 `0–10000`；Frontend 输入控件使用 `min=0`、`max=10000`、`step=1` 并执行同边界客户端校验。`rating` 继续使用 `0–10`、最多一位小数。本期不为不同统计设计独立上限。

补充：Other Stats 只适用 PTS、REB、AST、FGM、FGA、3PM、3PA 七个必填整数；`minutes` 和 `rating` 始终不适用，不显示、不提交、不响应。

修改位置：`MatchManagementFrontendPRD.md` §3.3、§5.3；Backend 既有 §6.2 保持不变。

### 4.3 Restore 错误详情结构

- [x] 为 `MATCH_RESTORE_NOT_ALLOWED.details` 定义稳定结构或 reason code。
- [x] 覆盖 Event 不可用、Team 不再是 participant、StageTag 不再属于 Event 等原因。
- [x] 定义 Frontend 是逐条展示原因还是使用统一 message。

决定：不增加独立 reason code，复用统一 `{ field, message }`。Event 问题使用 `event`，participant 问题使用详情 HOME/AWAY 顺序对应的 `teams[n].teamId`，StageTag 问题使用 `stageTagId`；同一恢复请求收集全部障碍。Frontend 在 Restore feedback 区域逐条展示，不映射为详情输入框。archived Team 本身不构成恢复错误。

修改位置：`MatchManagementBackendPRD.md` §5.8、§7；`MatchManagementFrontendPRD.md` §5.2。

### 4.4 错误检查顺序与优先级

- [x] 明确结构错误、资源不存在、状态错误和业务关系错误的检查顺序。
- [x] 明确同一阶段存在多个资源错误时，是全量返回还是按固定优先级返回。
- [x] 保持 `VALIDATION_ERROR` 对同阶段字段错误全量收集。

决定：采用固定阶段：请求结构 → URL Match 存在性 → Match 状态/不可变字段 → 关联资源存在性 → 业务状态/归属 → Match 整体规则。`VALIDATION_ERROR` 收集同阶段全部字段错误；不同顶层 error code 按文档固定优先级返回首个。Restore 在 Match 存在且已作废后例外地收集全部恢复障碍。数据库内部错误统一转为不泄露实现细节的 500。

修改位置：`MatchManagementBackendPRD.md` §7。

### 4.5 PATCH 完整快照的并发语义

- [x] 明确 MVP 是否采用 last-write-wins。
- [x] 如果采用，在 PRD 中明确本期不引入 version/ETag/optimistic locking。
- [x] 如果不接受覆盖风险，另行设计并发控制，不在实现阶段临时决定。

决定：个人 MVP 采用 last-write-wins。PATCH 不发送或检查 `updatedAt`、version、ETag，不实现 optimistic locking；后完成的合法完整快照覆盖先前结果。每个 PATCH 仍使用单个 transaction 保证原子性。

修改位置：`MatchManagementBackendPRD.md` §5.6；`MatchManagementFrontendPRD.md` §5.4。

### 4.6 Match 列表 filter options 语义

- [x] 明确 `filterOptions.events`、`teams`、`stageTags` 是否受当前 event/team/stage 筛选影响。
- [x] 明确选择 Event 后 Team 选项是否仅保留该 Event 下存在 Match 的 Team。
- [x] 保证后端响应和前端联动行为一致。

决定：采用 Event 单向联动。Events 始终来自全部可见 Match；未选 Event 时 Teams 为全局已出现 Team、StageTags 为空；选择 Event 后 Teams/StageTags 只来自该 Event 的可见 Match。可见 Match 必须未作废且所属 Event 未归档、未删除。Team/StageTag 不反向缩小其他选项，Event 改变时 Frontend 清除失效 Team 与 StageTag。archived/deleted Event 下的 Match 仍可按 ID 直接查看，但不出现在列表且不可编辑或恢复。

修改位置：`MatchManagementBackendPRD.md` §5.2；`MatchManagementFrontendPRD.md` §5.1。

### 4.7 Player position 排序顺序

- [x] 明确 position 使用固定篮球顺序（例如 `PG, SG, SF, PF, C`）还是 Prisma enum/字符串顺序。
- [x] 明确未知或未来 position 的兜底顺序。

决定：核实现有 schema/types 共支持七种 position。Match 统一使用显式顺序 `PG → SG → SF → PF → C → G → F`，随后按球衣号码、姓名、Player id 升序。未知未来取值排在七种已知 position 之后。Backend 负责排序，Match Frontend 使用 API 顺序，不用现有共享 comparator 二次排序；本功能不改变其他页面现有排序。

修改位置：`MatchManagementBackendPRD.md` §3.15；`MatchManagementFrontendPRD.md` §3.2。

### 4.8 `playedAt` 时间规则

- [x] 明确是否允许未来时间。
- [x] 明确本地 datetime 输入转 ISO 8601 时对时区和夏令时的处理。
- [x] 明确列表与详情的展示时区。

决定：`playedAt` 表示已经发生的比赛，不得晚于服务端请求接收时间；API 只接受明确带时区的 ISO 8601 并统一返回 UTC。Frontend 使用浏览器本地 date-time 输入和展示，提交时转 UTC，编辑时执行 UTC→本地→UTC 无漂移往返；夏令时使用浏览器规则，不硬编码时区或 offset。

补充：编辑页保留加载时原始 ISO；时间字段未修改时原样提交，只有用户实际修改后才从本地控件生成新 UTC 值，避免控件精度丢失秒或毫秒。

修改位置：`MatchManagementBackendPRD.md` §3.15、§6.1；`MatchManagementFrontendPRD.md` §5.3、§5.4、§5.5。

### 4.9 重复 Match 规则

- [x] 明确是否允许相同 Event、HOME/AWAY Team 和 `playedAt` 的重复 Match。
- [x] 若禁止，定义判重条件、并发保障和错误码。
- [x] 若允许，在 PRD 中明确不进行重复 Match 检测。

决定：MVP 允许重复 Match，不做自动判重，不增加唯一约束、fingerprint 或 idempotency key。Frontend 在单次 submitting 期间禁用重复点击；误录或重试产生的重复记录通过 Void 作废。

修改位置：`MatchManagementBackendPRD.md` §3.16；`MatchManagementFrontendPRD.md` §5.3。

### 4.10 数据关系完整性

- [x] 明确 `MatchPlayerStat.teamId` 和 `MatchTeamOtherStat.teamId` 必须对应同一 Match 的 `MatchTeam`。
- [x] 决定只通过 transaction 内应用校验保证，还是增加数据库复合关系/约束。
- [x] 明确每队恰好一条 Other Stats、恰好 HOME/AWAY 两项的数据库与应用层保障边界。

决定：MVP 不增加 Stat → MatchTeam 复合外键。Player/Other Stat 不接受独立 `teamId`，后端从外层 Team 注入并验证该 Team 是 Match 的 HOME/AWAY、Player 属于对应 Team。恰好两队、每队一个 Other Stats 和全部明细通过应用校验、单 transaction 及现有唯一约束共同保证。

修改位置：`MatchManagementBackendPRD.md` §3.10、§6.3；`MatchManagementFrontendPRD.md` §6。

## 5. 验收与测试清单

本节遵循 `docs/WORKFLOW.md` Phase 5，并沿用已实现 Event Management PRD 的标准：PRD 中完整的业务规则、API、验证和 UI 状态构成 golden path 与 edge-case 依据；实现完成后在运行中的应用执行手工 smoke test，不要求单元测试或 CI。发现问题时修复并重新测试，最终提交测试报告供用户 approval。

以下 checkbox 是 Phase 5 的未来执行记录。未勾选表示尚未实施/测试，不表示当前 PRD 设计仍有未决问题。

### 5.1 Backend 验收

- [ ] 合法 Match 创建成功，四类记录在同一 transaction 内写入。
- [ ] 任一关联明细写入失败时 transaction 全部回滚。
- [ ] 创建和编辑均拒绝 tied score。
- [ ] 验证所有整数范围、rating、made/attempted 关系及重复 Player。
- [ ] 未知字段和同阶段字段错误被完整收集。
- [ ] Event、Team、StageTag、Player 的存在性、归属和状态错误返回约定错误码。
- [ ] 编辑不能更换 Event、Team 或 HOME/AWAY role。
- [ ] inactive Player 只能在其已存在于原 Match 时保留、修改或移除。
- [ ] 作废保留全部明细，且列表与所有派生统计排除该 Match。
- [ ] 恢复重新执行已确认的 Event、Team 和 StageTag 规则。
- [ ] 历史 Match 详情仍可读取 inactive Player。

### 5.2 Frontend 验收

- [ ] 列表使用服务端筛选、排序和分页，不进行客户端二次分页。
- [ ] 创建页正确加载 eligible Event、participants、StageTags 和 active roster。
- [ ] 未勾选 Player 不进入 payload；再次勾选时以全 `0` 初始化。
- [ ] 前端即时比分与 Backend 保存后计算比分一致。
- [ ] 编辑页合并 active roster 与历史 inactive Player，不丢失历史行。
- [ ] `details[].field` 可以映射到对应 Team、Player 和字段。
- [ ] 作废详情只读且只能恢复；恢复成功后重新开放编辑和作废操作。
- [ ] loading、empty、not-found、error、submitting 和 success 状态完整。
- [ ] 本地 datetime 与 API UTC 时间往返一致，包括澳大利亚夏令时场景。
- [ ] 窄屏统计表可横向滚动，输入、checkbox、modal 和操作按钮具有可辨识 label。
- [ ] 页面样式复用现有 semantic tokens、Mantine theme 和共享组件。

### 5.3 回归验收

- [ ] Team、Player、Event 和 EventStageTag 现有管理流程不被改变。
- [ ] 现有 Event ResultTag、排名积分和 rankingOrder 逻辑不受影响。
- [ ] 不新增持久化比分、百分比、平均值、总计或排行榜字段。
- [ ] 不引入认证、自动赛程、比赛分节、实时计时或加时模型。

## 6. 最终批准条件

- [x] 第 3 节所有阻塞项均已确认并写入两份 PRD 或项目级规则文档。
- [x] 第 4 节接口契约完善项均已修订，或明确记录为不影响实现的已接受行为。
- [x] 第 5 节形成可执行测试清单。
- [x] Backend PRD 与 Frontend PRD 的字段、状态、错误码和页面行为一致。
- [ ] 用户批准修订后的 Backend PRD 与 Frontend PRD，随后才进入代码实现。
