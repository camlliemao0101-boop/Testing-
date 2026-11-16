/* ============================================================================
 * 站点基础路径解析
 *
 * 全站资源在代码里一律写成站内绝对路径 `/assets/...`。这些字符串同时是
 * **身份键**：assetManifest 的 url、decal-atlas.json 的 UV 键、editStore
 * 里 images[id].src 的默认值、以及用户导出的编辑 JSON 都用它互相对账。
 *
 * 但发布到 GitHub Pages 项目站点时，站点根是 `/Testing-/lina/`，
 * `/assets/...` 会打到域名根上去 404。Vite 的 `base` 只重写 index.html 与
 * 它自己打包出来的引用，**不会动运行时的字符串字面量**。
 *
 * 所以这里只做一件事：在 URL 真正进入 DOM 或发起请求的那一刻，把站内绝对
 * 路径接上 `import.meta.env.BASE_URL`。身份键保持 `/assets/...` 不变 ——
 * 清单对账、图集查表、localStorage 里存过的编辑都不受部署路径影响，
 * 换基础路径或换域名都不会让旧的编辑记录失效。
 * ========================================================================== */

/** Vite 注入，始终以 `/` 结尾；开发模式下就是 `/`。 */
const BASE = import.meta.env.BASE_URL

/**
 * 把站内绝对路径解析成当前部署路径下可请求的 URL。
 *
 * 原样返回的情况：用户换图得到的 `data:` / `blob:`、外链（Google Fonts 等）、
 * 相对路径，以及已经带上基础路径的值（幂等，重复调用安全）。
 */
export function assetUrl(path: string): string {
  if (!path.startsWith('/')) return path
  if (BASE === '/') return path
  if (path.startsWith(BASE)) return path
  return BASE + path.slice(1)
}

/** 解析 `srcset` 里的每个候选 URL，描述符（`600w` 等）原样保留。 */
export function assetSrcSet(srcSet: string): string {
  return srcSet
    .split(',')
    .map((candidate) => {
      const trimmed = candidate.trim()
      if (trimmed === '') return trimmed
      const gap = trimmed.search(/\s/)
      if (gap === -1) return assetUrl(trimmed)
      return assetUrl(trimmed.slice(0, gap)) + trimmed.slice(gap)
    })
    .filter((candidate) => candidate !== '')
    .join(', ')
}
