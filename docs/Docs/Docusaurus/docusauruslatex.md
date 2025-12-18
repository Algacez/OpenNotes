# Docusaurus配置数学公式

```
pnpm add remark-math@6 rehype-katex@7
```

在主配置文件中添加

```
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
……
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //  'https://github.com/algacez/opennotes/tree/main/packages/create-docusaurus/templates/shared/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
……
  stylesheets: [
    {
      href: '/katex/katex.min.css',
      type: 'text/css',
    },
  ],

  themeConfig: {
```

Docusaurus官网示例版本为katex@0.13.24，我无法使用，使用katex@0.16.22和对应哈希值后成功显示数学公式。

哈希值获取方法，在 https://www.jsdelivr.com/package/npm/katex?tab=files&path=dist 找到对应版本，点右侧复制'HTML+SRI'包含哈希值和href链接。

## 本地托管

对于流行的库和资源，从 CDN 加载样式表、字体和 JavaScript 库是一个很好的做法，因为它减少了你需要托管的资源数量。如果你更喜欢自托管 `katex.min.css`（以及所需的 KaTeX 字体），你可以从 [KaTeX GitHub 发布页面](https://github.com/KaTeX/KaTeX/releases)下载最新版本，解压并复制 `katex.min.css` 和 `fonts` 目录（仅 `.woff2` 字体类型应该就足够了）到你网站的 `static` 目录中，然后在 `docusaurus.config.js` 中，将样式表的 `href` 从 CDN URL 替换为你的本地路径（例如，`/katex/katex.min.css`）。

```
export default {
  stylesheets: [
    {
      href: '/katex/katex.min.css',
      type: 'text/css',
    },
  ],
};
```

