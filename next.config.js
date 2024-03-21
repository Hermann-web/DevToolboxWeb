/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },

  rewrites: async () => {
    const fastapiBaseUrl = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? `${fastapiBaseUrl}/api/:path*`
            : "/api/",
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? `${fastapiBaseUrl}/docs`
            : "/api/docs",
      },
      // {
      //   source: "/openapi.json",
      //   destination:
      //     process.env.NODE_ENV === "development"
      //       ? `${fastapiBaseUrl}/openapi.json`
      //       : "/api/openapi.json",
      // },
    ];
  },
};

module.exports = nextConfig;
