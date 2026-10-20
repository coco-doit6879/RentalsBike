import type { NextConfig } from "next";

const isExport =
  process.env.OUTPUT_EXPORT === "true" || process.env.CF_PAGES === "1";

const config: NextConfig = {
  poweredByHeader: false,
  ...(isExport
    ? {
        output: "export",
        images: { unoptimized: true },
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default config;

