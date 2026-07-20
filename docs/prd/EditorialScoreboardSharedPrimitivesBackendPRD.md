# Editorial Scoreboard Shared Primitives Backend PRD

## 1. 目标

确认 Editorial Scoreboard M1 Foundation and Shared Primitives 是纯前端视觉系统迁移，不需要后端、Prisma Schema、数据库、API 契约、业务规则或错误响应发生任何变化；通过独立 Backend PRD 明确该边界，防止视觉实现过程中无意扩大到数据或业务层。

## 2. 范围

文档权威：

- 本 PRD 只负责确认 M1 没有 Backend 实施范围。
- 既有 Team、Player、Event、Match Backend PRD 继续分别作为其业务规则、
  API、验证与错误行为的 SOT。
- 本 PRD 不覆盖或重述既有 Backend feature contract。

包含：

- 记录本批次不需要后端实施。
- 保持所有现有 API endpoint、请求 payload、响应结构、错误码和请求时机不变。
- 保持所有 Team、Player、Event、Match、统计计算、归档、作废与恢复规则不变。
- 若前端迁移发现现有数据不足以支持某个新状态，停止该状态的实现并另行进入需求确认流程。

不包含：

- Prisma Schema 或数据库迁移。
- 新增、删除或修改 API endpoint。
- 修改验证、错误响应、序列化或业务逻辑。
- 新增存储字段、聚合字段或计算统计。
- 为视觉效果新增后端配置或持久化状态。
- Event Player Awards 选取逻辑重设计。

## 3. 业务规则

本批次不新增或修改业务规则。实施期间必须保持：

- Team、Player、Event、Match 的创建、编辑、归档、作废、恢复和状态推进规则不变。
- ResultTag、Match Stage Tag、Player Awards、参与队伍和技术统计的既有数据语义不变。
- 排名、总计、平均值、榜单和其他派生统计继续由已保存的原始记录计算，不新增持久化聚合。
- 前端的 `loading`、`disabled`、`selected`、`checking`、`error` 和 Reduced Motion
  仅是现有状态的视觉表达，不形成新的服务端业务状态。
- API Health 的 `Online`、`Checking`、`Offline` 继续由现有健康检查请求生命周期得出，
  不在数据库中保存，也不改变健康检查频率或判定规则。

若某个已批准视觉状态无法由现有前端状态或 API 响应可靠推导，不得通过猜测、
新增后端字段或改变业务规则补齐；该项应从 M1 暂停并作为独立需求重新进入 Phase 1。

## 4. Schema 变更

无。

- 不修改 Prisma schema。
- 不创建数据库 migration。
- 不新增、删除、重命名字段、枚举、索引或关系。
- 不进行数据回填。

## 5. API 规范

无 API 变更。

- endpoint、HTTP method、path parameter、query parameter 和 request body 不变。
- response status、payload shape、字段可空性和序列化方式不变。
- 请求触发时机、缓存/刷新行为和 API Health polling 行为不变。
- 不为颜色、surface、motion、组件 variant 或用户视觉偏好新增 API。

## 6. 验证规则

无后端验证变更。

- 所有 DTO、schema、业务前置条件和授权规则保持现状。
- 前端新增的可访问属性、CSS class 和视觉状态不参与服务端验证。
- 表单错误只改变呈现方式，不改变错误何时产生或哪些输入被接受。

## 7. 错误码

无错误码或错误结构变更。

- 保持所有现有 HTTP status、业务错误码和错误 payload。
- M1 不吞掉、改写或重新分类后端错误。
- 视觉迁移后的 Alert、field validation、Error/Retry 和 Confirmation Dialog
  只消费既有错误；刷新失败时是否保留已有成功内容也必须沿用当前数据流。
- 若既有组件没有可恢复操作，不得仅为满足视觉稿而伪造 `Retry` 行为。
