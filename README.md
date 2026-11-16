# Testing-

三个独立网页作品的发布仓库。每个作品都是静态站点，互不依赖，打开即用。

Pages 开启后的地址（项目站点，基础路径 `/Testing-/`，仓库名末尾确实带连字符）：

| 作品 | 目录 | 地址 |
|------|------|------|
| 作品索引（首页） | `index.html` | `https://camlliemao0101-boop.github.io/Testing-/` |
| Camille · 手帐 | `camille/` | `https://camlliemao0101-boop.github.io/Testing-/camille/` |
| LINA · 3D 储物柜 | `lina/` | `https://camlliemao0101-boop.github.io/Testing-/lina/` |
| 生活电子日历 · 功能 Demo | `calendar/` | `https://camlliemao0101-boop.github.io/Testing-/calendar/` |

## 仓库结构

```
index.html            作品索引首页（只做导航，不改三个作品的视觉）
.nojekyll             关掉 Jekyll，避免它处理站点文件
camille/index.html    Camille 手帐，单文件 HTML，图片以 data URI 内嵌
calendar/             生活日历的 5 个站点文件（index + manifest + 3 个图标 + 说明）
lina/                 LINA 的构建产物，base = /Testing-/lina/（Pages 直接发布这份）
sources/lina/         LINA 的完整源码工程（Vite 8 + React 19 + TypeScript + three/R3F）
.github/workflows/    可选的 GitHub Actions 发布流程
```

Camille 与日历没有构建步骤，仓库里的文件就是最终产物。LINA 需要构建，所以源码与产物分开放：
`sources/lina/` 是源码，`lina/` 是用它构建出来的、可以直接被 Pages 发布的产物。

## 开启 Pages

两种方式选一种：

- **从分支发布（不需要 Actions）**：Settings → Pages → Source 选 `Deploy from a branch`，
  分支 `main`，目录 `/ (root)`。仓库里已经提交了 `lina/` 的构建产物，所以不用再构建。
- **用 Actions 发布**：Settings → Pages → Source 选 `GitHub Actions`。
  `.github/workflows/pages.yml` 会从 `sources/lina/` 重新构建 LINA 再发布，
  并检查资源路径是否都跟着基础路径重写了。

## 改了 LINA 以后怎么重新发布

LINA 的资源路径跟着 Vite 的 `base` 走，所以必须重新构建，不能手改 `lina/` 里的文件：

```bash
cd sources/lina
npm ci
npm run build          # 产物在 sources/lina/dist
rm -rf ../../lina && cp -r dist ../../lina
```

`base` 写在 `sources/lina/vite.config.ts` 里，当前是 `/Testing-/lina/`。
**换仓库名、换域名或换子目录时必须同步改它并重新构建**，否则 JS、CSS、图片和贴图会全部 404。

### LINA 的资源路径是怎么适配子目录的

LINA 原本按站点根部署，代码里大量资源写成 `/assets/...` 这样的站内绝对路径。
这些字符串同时是**身份键**：`assetManifest.ts` 的清单、`decal-atlas.json` 的贴花 UV 表、
`editStore` 里的默认图、以及用户导出的编辑 JSON 都靠它互相对账。而 Vite 的 `base`
只重写 `index.html` 和它自己打包出来的引用，**不会动运行时的字符串字面量**。

所以适配方式是：身份键一律保持 `/assets/...` 不变，只在 URL 真正进入 DOM 或发起请求的那一刻，
由 `sources/lina/src/assetUrl.ts` 接上 `import.meta.env.BASE_URL`。这样做的好处是，
换基础路径不会让用户已经存在浏览器里的编辑记录失效，清单对账与图集查表也完全不用改。

## 数据与隐私

三个作品的内容都只存在**打开网页的那台设备的浏览器里**，不会上传到网站，也没有云同步：

- Camille 手帐、LINA 的文字/图片/配色编辑：`localStorage`
- 生活日历的文字、照片、打卡、休息日：`IndexedDB`

因此换浏览器、换设备或换网址都读不到原来的数据，清理浏览器数据会一并清掉。
日历迁到新地址后，旧地址的记录不会自动跟过来，重要内容请用日历自带的导出功能自己留备份。

仓库里只有程序代码，不含任何日记、照片备份、导出文件或密钥。请不要把
`life-calendar-backup-*.json` 这类个人备份提交进来（`.gitignore` 已经挡掉）。

## 作品说明与来源核对

### Camille · 手帐（`camille/`）

解锁后可视化编辑整本：改字、调字号字体、拖动贴纸、旋转缩放、换图、删除，并可导出。锁定后翻页浏览。
单文件 HTML，图片内嵌，只外链 Google Fonts。

`camille/index.html` 与交接包里的「最终可编辑版」逐字节一致：
404296 字节，SHA-256 `0cbbbe7562b724ea337949ff0167480b9926a6cb5a849904c9271dbf54bbb3c0`。

### LINA · 3D 储物柜（`lina/`、`sources/lina/`）

WebGL 真 3D 个人站练习稿。文字、图片、配色可在线编辑，支持导出导入 JSON。
需要 WebGL；检测到不支持、Save-Data 或低性能设备时会自动降级到静态版本，四个内容入口照常可用。

页面里的 **LINA CHEN 是虚拟人设，不是仓库所有者的真实履历**。

构建工具链是 Vite 8 + React 19 + TypeScript，运行时依赖 `three`、`@react-three/fiber`、
`@react-three/drei`、`zustand`、`gsap`。源码保留了上游的 `bun.lock`；
另外补了一份 `package-lock.json`，让 Actions 用 `npm ci` 构建时版本可复现。

上游示例的 Cloudflare 配置 `wrangler.jsonc` 与 `deploy` 脚本没有收进来：
它指向的是上游自己的示例域名，这个仓库用 GitHub Pages 发布，用不到也不该照它部署。

### 生活电子日历 · 功能 Demo（`calendar/`）

本机记录文字、压缩照片、打卡与休息日；按当月真实记录自动整理月度回顾
（统计加按日摘录，**不是 AI 生成**），可预览后再写入；按日自动播放，默认慢速，
可暂停、继续、重播；照片可放大收回。无构建步骤，5 个文件放在同一目录即可。

`calendar/index.html` 与交接包一致：118633 字节，
SHA-256 `27e60a04d8b30cc6927ff1b5234c11370db072c0c6d9b20703aec4eb360c27c3`。
来源官方包 `life-calendar-functional-demo-auto-review-playback-slow-20261110.zip`
（45791 字节，SHA-256 `cee2284979d0386fdfd9672850691831d2f1ed57bd44ef244d437df28e58f247`）未收进仓库，
因为站点只需要解包后的这 5 个文件。`calendar/README.txt` 是原包自带的说明。
