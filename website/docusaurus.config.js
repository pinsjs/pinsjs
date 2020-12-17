const multilang = require('./plugins/multilang');

module.exports = {
  title: 'pinsjs',
  tagline: 'Pin, Discover and Share Resources',
  url: 'https://pinsjs.github.io',
  baseUrl: '/pinsjs/',
  onBrokenLinks: 'throw',
  favicon: 'images/favicon.ico',
  organizationName: 'pinsjs',
  projectName: 'pinsjs',
  plugins: ['docusaurus-plugin-sass'],
  themeConfig: {
    navbar: {
      title: 'pinsjs',
      logo: {
        alt: 'Pins Logo',
        src: 'images/logo.png',
      },
      items: [
        {
          to: 'docs/starting',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'docs/examples',
          label: 'Examples',
          position: 'left',
        },
        {
          to: 'docs/reference',
          label: 'Reference',
          position: 'left',
        },
        {
          href: 'https://github.com/pinsjs/pinsjs',
          className: 'github-link',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `© ${new Date().getFullYear()}. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: [ 'r' ]
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/pinsjs/pinsjs/edit/master/website/',
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
