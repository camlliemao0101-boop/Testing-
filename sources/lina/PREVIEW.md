# LINA CHEN — Locker Folio · Step 6 Editable Preview

Rebranded practice fork of [qzz0518/locker-folio](https://github.com/qzz0518/locker-folio) (MIT code). Visual concept / design credit: **momo** (小红书 Locker portfolio). **Step 6**：技巧二风格可编辑终稿（文字 / DOM 图 / 配色面板 / 导出）。

## How to run

```bash
cd /workspace/locker-lina-site
bun install
bun run build
bun run preview   # http://0.0.0.0:4178  (Vite preview, host: true)
# or for HMR during tweaks:
bun run dev       # http://0.0.0.0:5178
```

Live preview (this box): **http://127.0.0.1:4178/** (also bound on `0.0.0.0:4178`).

## Edit mode (Step 6)

- 右上角 **编辑 / 完成**
- 左下角 **配色面板**（柜门 / 柜体 / 点缀 / 柜腔 / 唱片机 / 作品箱 / 打字机）
- 导出 / 导入 JSON 编辑包；刷新后 localStorage 自动还原
- 详见 **`EDITABLE.md`**

## What’s in scope

- True Three.js / R3F locker hub（质量与 Step 3–5 一致）
- Branding: **LINA CHEN — PORTFOLIO '26**（未编辑前保持虚拟人设默认文案）
- Top nav: ABOUT / SKILLS / SELECTED WORK / CONTACT（无 DAYS）
- Corner credit to momo + upstream GitHub
- DOM 文字编辑 + 字体/字号/颜色工具条
- About 头像换图、摄影墙换图（拖移 / 缩放）
- 3D 柜体与关键道具 live 配色

## Still limited

- 柜门 Three.js decal 在线换贴图（未做；见 EDITABLE.md）
- 部分 Work 子视图（3D 海报扇、杂志等）未接 DOM 换图
- 无云端同步

See also: `FIX-BRANDING.md`, `STEP4-CHECKLIST.md`, `EDITABLE.md`.

## Persona snapshot (default until edited)

| Field | Value |
| --- | --- |
| Name | LINA CHEN |
| Birthday | 2004.06.18 |
| School | Virtual Art Lab |
| Major | Digital Media |
| Tagline | 用柜子收纳我的爱好与作品 |
| Skills | 01 视觉设计 · 02 数据洞察 · 03 AI 实践 |
| Contact email | hello@lina.demo |
