/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_REPOSITORY ? true : false;

let assetPrefix = "";
let basePath = "";

if (isGithubActions) {
  const repoName = process.env.GITHUB_REPOSITORY.split("/")[1];
  assetPrefix = `/${repoName}/`;
  basePath = `/${repoName}`;
}

const nextConfig = {
  output: "export",            // ✅ enables static export
  trailingSlash: true,         // ✅ required for GitHub Pages
  images: { unoptimized: true },
  basePath,
  assetPrefix,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: true,
};

module.exports = nextConfig;
