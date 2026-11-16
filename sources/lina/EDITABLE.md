# 编辑模式说明 · LINA CHEN Locker Folio（Step 6）

右上角「编辑 / 完成」开关进入技巧二风格的可编辑终稿。默认内容仍是虚拟人设 LINA CHEN，未改之前与 Step 3–5 一致。

## 如何进入 / 退出

1. 等 3D 柜体进入场景（或静态降级页）。
2. 点右上角 **编辑** → 进入编辑模式（按钮变为蓝色 **完成**）。作品浮层 / 子页打开时也可点（编辑器不会被 dialog inert 挡住）。
3. 再点 **完成** 退出。导航、柜门热点、浮层开合在编辑模式下仍可用（文字区域会拦截点击以免误开文件夹）。

编辑内容自动写入 `localStorage` 键 `lina-locker-edits-v1`，刷新页面会还原。

## 文字

- 可改：About 工牌字段、Skills 卡标题 / 描述 / 行、**Skills 二层详情**（要点 / 工具笔记 / 示例项目）、Work 文件夹中英文标签、Contact 信纸标签与演示说明、便签正文。
- Skills 卡组交互（二层详情内容不改）：
  - **堆叠**：点**前卡** → 开详情；点**后排露出的卡** → 只把它回滚到最前，不进详情；底部「换下一张」仍可顺序轮转。
  - **展开全部**：点任意卡开详情。
  - 编辑态前卡用「查看详情」按钮进入二层。
- 操作：编辑模式下点虚线框文字 → 直接输入；上方工具条可改 **字体 / 字号 / 颜色**；「还原样式」清掉该段样式覆盖。
- 持久化：与配色、图片同一编辑包。

## 图片

- **About 头像**：默认 SVG；编辑模式下点「换图」上传，可拖移 / 滚轮缩放；「还原」回 SVG。
- **柜体人物图（主场景）**：编辑态底部出现「柜体人物图」替换条，可换：
  - 门海报·五小人（`scene.posterwall`）
  - 小红帽贴纸（`scene.decal.redhood`）
  - 拍立得·合照 / 比耶 / 相机（`scene.polaroid.*`）
  - 女孩 / 双人 / 立牌照片贴纸（`scene.decal.*`）
  - 3D 命中不可靠时用列表上传；写入 `images` 后即时重载纹理（门贴花从 atlas 摘出改独立平面）。
- **Work · 摄影墙 / 视频封面 / 网站封面 / 杂志内页**：格子或封面可换图、拖移、缩放。
- **Work · 海报 3D 扇面**：编辑态下方出现「海报换图」列表，逐张上传后重载 WebGL 纹理（非卡面直接点选）。
- **其余柜门非人物贴花**：仍可用离线换 `public/assets`；人物相关已走在线替换条。

## 配色面板（必做）

编辑模式左下角 **配色面板**：

| 项 | 作用 |
| --- | --- |
| 柜门 | 门板正面 |
| 柜体 | 外壳 / 立柱 / 顶盖（派生顶盖亮色与底座） |
| 点缀 | 把手嵌条等 |
| 柜腔 | 内壁蓝 |
| 唱片机 | Skills 入口机身 |
| 作品箱 | 橙黄文件袋 |
| 打字机 | Contact 奶油机身 |

改色即时反映到 3D 材质；「↺」还原单项；「清空全部编辑」重置文字 / 图片 / 配色。

## 导出 / 导入

编辑模式下：

- **导出编辑包**：下载 `lina-locker-edits-YYYY-MM-DD.json`（version 1：colors / texts / images / links）。
- **导入编辑包**：选择此前导出的 JSON，覆盖当前编辑并写入 localStorage。

也可用开发者工具直接查看 / 备份 `localStorage['lina-locker-edits-v1']`。

## 构建与预览

```bash
cd /workspace/locker-lina-site
bun install
bun run build
bun run preview   # http://0.0.0.0:4178
```

## 外链

- **视频 / 网站作品**：编辑模式下可改「视频链接」「项目链接」；写入 `links`，随编辑包导出。非编辑态封面 / OPEN PROJECT 使用更新后的 URL。

## 尚未支持 / 限制

- 非人物类柜门贴花（文字条、花、猫等）在线替换未做条目；人物类已覆盖。
- 海报 3D：只能通过底部换图条替换，不能在旋转卡面上直接点选；大图 data URL 会让编辑包变大。
- 云端同步：编辑仅本机 localStorage + JSON 文件。
- momo 左下角出处角标保留，勿删。

## 相关文件

- `src/editor/*` — 编辑器 store / chrome / 文字图组件 / 配色面板 / `SceneReplaceStrip` / `sceneEditableImages`
- `src/scene/PhysicalProps.tsx` — 海报 / 拍立得读 editStore 换图
- `src/scene/OverrideDecal.tsx` + `HeroSceneCanvas.tsx` — 人物门贴花覆盖层
- `src/scene/LockerModel.tsx` — 柜体调色板 Context
- `src/components/overlays/*`、`src/components/work/*` — DOM / 作品可编辑层（含 Skills 二层、视频/网站/杂志/海报换图条）
