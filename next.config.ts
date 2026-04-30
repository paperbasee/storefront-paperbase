import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function parseRemoteOrigin(origin: string) {
  try {
    const parsed = new URL(origin);
    return {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      port: parsed.port || undefined,
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

function buildRemotePatterns() {
  const patterns: Array<{
    protocol: "http" | "https";
    hostname: string;
    port?: string;
    pathname: string;
  }> = [
    {
      protocol: "https",
      hostname: "storage.paperbase.me",
      pathname: "/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "8000",
      pathname: "/**",
    },
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "8000",
      pathname: "/**",
    },
  ];

  const backendPattern = parseRemoteOrigin(process.env.NEXT_PUBLIC_PAPERBASE_BACKEND_ORIGIN ?? "");
  if (backendPattern) patterns.push(backendPattern);

  const extraHosts = (process.env.NEXT_PUBLIC_IMAGE_REMOTE_HOSTS ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  for (const host of extraHosts) {
    patterns.push({
      protocol: "https",
      hostname: host,
      pathname: "/**",
    });
  }

  return patterns;
}

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "radix-ui", "next-intl"],
  },
  images: {
    remotePatterns: buildRemotePatterns(),
  },
};

export default withNextIntl(nextConfig);
