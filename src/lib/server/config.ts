import "server-only";

const BASE_PATH = "/api/v1/";

function trimSlash(input: string) {
  return input.replace(/\/+$/, "");
}

export type ServerPaperbaseConfig = {
  baseUrl: string;
  publishableKey: string;
};

function assertPublishableKey(key: string) {
  if (!key.startsWith("ak_pk_")) {
    throw new Error("PAPERBASE_PUBLISHABLE_KEY must start with ak_pk_.");
  }
}

/**
 * Server-only Paperbase storefront configuration.
 * Never import this module from client components.
 */
export function getServerPaperbaseConfig(): ServerPaperbaseConfig {
  const origin =
    process.env.PAPERBASE_BACKEND_ORIGIN ??
    (process.env.PAPERBASE_API_URL?.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "") ?? "");

  const publishableKey = process.env.PAPERBASE_PUBLISHABLE_KEY;

  if (!origin) {
    throw new Error("Missing PAPERBASE_BACKEND_ORIGIN (or PAPERBASE_API_URL) environment variable.");
  }
  if (!publishableKey) {
    throw new Error("Missing PAPERBASE_PUBLISHABLE_KEY environment variable.");
  }

  assertPublishableKey(publishableKey);

  return {
    baseUrl: `${trimSlash(origin)}${BASE_PATH}`,
    publishableKey,
  };
}
