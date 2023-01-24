/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['feelstatic'],
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
