const multilang = require('./plugins/multilang');

module.exports = {
  title: 'pins',
  tagline: 'Pin, Discover and Share Resources',
  url: 'https://mlverse.github.io',
  baseUrl: '/pinsjs/',
  onBrokenLinks: 'throw',
  favicon: 'images/favicon.ico',
  organizationName: 'mlverse',
  projectName: 'pins',
  plugins: ['docusaurus-plugin-sass'],
  themeConfig: {
    navbar: {
      title: 'pins',
      logo: {
        alt: 'Pins Logo',
        src: 'images/logo.png',
      },
      items: [
        {
          to: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/mlverse/pins',
          className: 'github-link',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `© ${new Date().getFullYear()}. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/mlverse/pins/edit/master/website/',
          remarkPlugins: [[multilang, {}]],
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/mlverse/pins/edit/master/website/blog/',
          remarkPlugins: [[multilang, {}]],
        },
        pages: {
          remarkPlugins: [[multilang, {}]],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      },
    ],
  ],
};
