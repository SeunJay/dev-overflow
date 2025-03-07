/** @type {import('next').NextConfig} */
const nextConfig = {
  // serverExternalPackages: ["mongoose"],
  experimental: {
    //   serverComponentsExternalPackages: ["mongoose"],
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "*",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
