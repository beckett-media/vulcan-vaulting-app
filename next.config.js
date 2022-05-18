const pageExtensions = ['page.tsx'];

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  pageExtensions,
  images: {
    domains: ['ipfs.io'],
  },
};
