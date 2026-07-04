# design-proposals/

存放 UI 重设计的**候选方案**，供预览和比较后决策。

这里的内容**不是项目的实际规范**，不影响任何已实施的代码。正式设计规范在 `docs/DESIGN.md`。

---

## 当前状态（2026-07-03）

项目 UI 已完成 token 化准备工作（见 `docs/UI_REDESIGN_READINESS_CHECKLIST.md`），但尚未进行视觉重设计。本目录用于在正式动工前对候选设计方案进行检视。

---

## 目录结构

每套方案放在独立子目录下，文件名统一为 `DESIGN.md`（规范）+ `preview.html`（预览）。

```
design-proposals/
  README.md
  verge-dark/
    DESIGN.md      ← 方案规范（暗色极）
    preview.html   ← 静态预览，浏览器直接打开
  verge-light/
    DESIGN.md      ← 方案规范（亮色极）
    preview.html   ← 静态预览，浏览器直接打开
```

### verge-dark/

Verge 2024 风格的**暗色模式**适配。主要特征：近黑画布 `#131313`、薄荷绿 `#3cffd0` 作为发光主色、大圆角（卡片 16px、按钮 24px pill）、Anton 展示字体。气质：**大气夜间模式 / 科技感**。

### verge-light/

Verge 2024 风格的**亮色模式**适配，更接近 The Verge 网站实际呈现。主要特征：白色画布 `#ffffff`、浅灰卡片 `#f5f5f5`、黑色文字、薄荷绿作为点缀色。三种按钮：薄荷底色 pill（主 CTA）、黑色底色 pill（次级操作）、黑底薄荷字 badge（状态标签）。气质：**编辑型运动杂志 / 干净现代**。

`preview.html` 包含与 verge-dark 相同的组件场景，token 对比表额外列出与 verge-dark 的差异。

---

## 工作流程

1. **看预览** — 在浏览器中打开 `preview.html`，检视各组件在新设计下的效果。
2. **做决定** — 对比当前实际运行的 app，决定哪些元素采用、哪些放弃或调整。
3. **新增方案** — 如需对比另一套方案，复制 `preview.html` 为 `preview-v2.html`，修改顶部 `:root` CSS 变量即可（结构无需改动，改动成本低）。
4. **方案确认后** — 将决定写入 `docs/DESIGN.md`，然后按 `docs/WORKFLOW.md` 走需求确认 → PRD → 实施流程。

---

## 与项目其他文档的关系

- `docs/DESIGN.md` — **当前实施中**的设计规范（暗色分析主题，蓝色主色，4px 圆角）
- `docs/UI_REDESIGN_READINESS_CHECKLIST.md` — token 化迁移进度，重设计前置工作
- `docs/WORKFLOW.md` — 功能开发流程，重设计确认后按此执行
