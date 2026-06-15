const withNextIntl = require("next-intl/plugin")("./i18n.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist"],
}

module.exports = withNextIntl(nextConfig)
