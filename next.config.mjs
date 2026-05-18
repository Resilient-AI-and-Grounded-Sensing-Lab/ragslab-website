const isProd = process.env.NODE_ENV === "production";
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = configuredBasePath ?? (isProd ? "/ragslab-website" : "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath,
  assetPrefix: basePath || undefined
};

export default nextConfig;
