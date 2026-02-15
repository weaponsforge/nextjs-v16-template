import type { NextConfig } from 'next'

const IS_BUILD_STATIC = process.env.IS_BUILD_STATIC === '1'
const IS_BUILD_DOCKER = process.env.IS_BUILD_DOCKER === '1'

if (IS_BUILD_STATIC && IS_BUILD_DOCKER) {
  throw new Error(
    'Only 1 of IS_BUILD_STATIC or IS_BUILD_DOCKER could exist at a time',
  )
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(IS_BUILD_STATIC && {
    // static export
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true, // Required for static export
    },
  }),
  ...(IS_BUILD_DOCKER && {
    // standalone build for docker production
    output: 'standalone',
  }),
}

export default nextConfig
