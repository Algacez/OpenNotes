---
slug: triliumsearch
title: Trilium配置搜索
authors: [rock]
tags: [tutorial]
---

在你的 `themeConfig` 中添加一个 `algolia` 字段。**[申请 DocSearch](https://docsearch.algolia.com/apply/)** 以获取你的 Algolia 索引和 API 密钥。

<!-- truncate -->

```
  themeConfig: {
    // Replace with your project's social card
    algolia: {
      // Algolia 提供的应用 ID
      appId: 'YOUR_APP_ID',

      // 公开 API 密钥：可以安全地提交它
      apiKey: 'YOUR_SEARCH_API_KEY',

      indexName: 'YOUR_INDEX_NAME',

      // 可选：请参阅下面的文档部分
      contextualSearch: true,

      // 可选：指定导航应通过 window.location 而不是 history.push 发生的域。当我们的 Algolia 配置抓取多个文档站点并且我们希望使用 window.location.href 导航到它们时很有用。
      externalUrlRegex: 'external\\.com|domain\\.com',

      // 可选：替换来自 Algolia 的项目 URL 的部分内容。当对使用不同 baseUrl 的多个部署使用相同的搜索索引时很有用。你可以在 `from` 参数中使用正则表达式或字符串。例如：localhost:3000 vs myCompany.com/docs
      replaceSearchResultPathname: {
        from: '/docs/', // 或作为正则表达式：/\/docs\//
        to: '/docs/',
      },

      // 可选：Algolia 搜索参数
      searchParameters: {},

      // 可选：默认启用的搜索页面的路径（`false` 可禁用）
      searchPagePath: 'search',

      // 可选：是否在 DocSearch 上启用 insights 功能（默认为 `false`）
      insights: false,

      //... 其他 Algolia 参数
    },
```

`Implementation Code`提供了`indexName`

