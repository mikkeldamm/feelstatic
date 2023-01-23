const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  unstable_flexsearch: true,
  unstable_staticImage: true,
});

module.exports = withNextra({
  redirects: () => [
    {
      source: '/docs',
      destination: '/documentation/introduction',
      statusCode: 302,
    },
    {
      source: '/documentation',
      destination: '/documentation/introduction',
      statusCode: 302,
    },
  ],
});
