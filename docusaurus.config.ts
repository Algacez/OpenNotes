import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'My logs',
  tagline: 'i guess AI is cool',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://www.282994.xyz',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Algacez', // Usually your GitHub org/user name.
  projectName: 'OpenNotes', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //  'https://github.com/algacez/opennotes/tree/main/packages/create-docusaurus/templates/shared/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
          //  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    {
      href: '/katex/katex.min.css',
      type: 'text/css',
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    algolia: {
      // Algolia 提供的应用 ID
      appId: 'RKTY5ZIW78',

      // 公开 API 密钥：可以安全地提交它
      apiKey: 'a60e014bd71c7255ef7e6d97ac07a6c4',

      indexName: 'blog',

      // 可选：请参阅下面的文档部分
      contextualSearch: true,

      // 可选：指定导航应通过 window.location 而不是 history.push 发生的域。当我们的 Algolia 配置抓取多个文档站点并且我们希望使用 window.location.href 导航到它们时很有用。
      externalUrlRegex: 'external\\.com|domain\\.com',

      // 可选：替换来自 Algolia 的项目 URL 的部分内容。当对使用不同 baseUrl 的多个部署使用相同的搜索索引时很有用。你可以在 `from` 参数中使用正则表达式或字符串。例如：localhost:3000 vs myCompany.com/docs
      replaceSearchResultPathname: {
        from: '/docs/', // 或作为正则表达式：/\/docs\//
        to: '/',
      },

      // 可选：Algolia 搜索参数
      searchParameters: {},

      // 可选：默认启用的搜索页面的路径（`false` 可禁用）
      searchPagePath: 'search',

      // 可选：是否在 DocSearch 上启用 insights 功能（默认为 `false`）
      insights: false,

      //... 其他 Algolia 参数
    },
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'My logs',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'docSidebar',
          sidebarId: 'csSidebar',
          position: 'left',
          label: 'CS',
        },
        {
          type: 'docSidebar',
          sidebarId: 'mathSidebar',
          position: 'left',
          label: 'Math',
        },
        {
          type: 'docSidebar',
          sidebarId: 'interestsSidebar',
          position: 'left',
          label: 'Interests',
        },
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/algacez/opennotes',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'CS',
              to: '/docs/CS/main',
            },
            {
              label: 'Math',
              to: '/docs/Math/main',
            },
            {
              label: 'Interests',
              to: '/docs/Interests/main',
            },
            {
              label: 'Docs',
              to: '/docs/Docs/main',
            },
          ],
        },
        {
          title: 'My',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'X',
              href: 'https://x.com/user1192892',
            },
            {
              label: 'Email',
              href: 'mailto:opennotes@282994.xyz',
            },
          ],
        },
        {
          title: 'Friends',
          items: [
            {
              label: 'Shepherd',
              href: 'https://www.duskydream.icu/',
            },
            {
              label: 'Fw190',
              href: 'https://blog.fw190.top/',
            },
            {
              label: 'jboyxs',
              href: 'https://jboyxs.775772.xyz/',
            },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'NetUnion',
              href: 'https://netunion.org/',
            },
            {
              label: 'CNSS',
              href: 'https://cnss.studio/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Algacez`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
