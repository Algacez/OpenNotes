# Docusaurus设置博客为主界面

你可以运行一个没有专门着陆页的道格龙（Docusaurus）网站，而是将你的博客文章列表页作为索引页。将 `routeBasePath` 设置为 `'/'`，以便通过根路由 `example.com/` 而不是子路由 `example.com/blog/` 来提供博客服务。

<!-- truncate -->

```
export default {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false, // 可选：禁用文档插件
        blog: {
          routeBasePath: '/', // 在网站根目录提供博客服务
          /* 其他博客选项 */
        },
      },
    ],
  ],
};
```

删除

`./src/pages/index.js`及相关文件