import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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
  baseUrl: '/OpenNotes/',

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

  themeConfig: {
    // Replace with your project's social card
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
        {to: '/blog', label: 'Blog', position: 'left'},
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
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
        {
          title: 'My',
          items: [
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
          title: 'More',
          items: [
            {
              label: 'OpenAI',
              href: 'https://openai.com',
            },
            {
              label: 'SpaceX',
              href: 'https://www.spacex.com',
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
