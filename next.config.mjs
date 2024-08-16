/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongoose"],
  experimental: {
    //   serverComponentsExternalPackages: ["mongoose"],
    mdxRs: true,
  },
};

export default nextConfig;
