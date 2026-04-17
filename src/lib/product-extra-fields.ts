import type { PaperbaseStorePublic } from "@/types/paperbase";

type ExtraFieldLabels = { yes: string; no: string };

function formatExtraFieldValue(value: unknown, labels?: ExtraFieldLabels): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "boolean") {
    if (labels) {
      return value ? labels.yes : labels.no;
    }
    return value ? "Yes" : "No";
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => formatExtraFieldValue(item, labels))
      .filter((item) => item.trim().length > 0)
      .join(", ");
  }
  return JSON.stringify(value);
}

/** Builds human-readable lines for the product details section from store schema + `extra_data`. */
export function buildProductExtraDetailLines(
  schema: PaperbaseStorePublic["extra_field_schema"] | undefined,
  extraData: Record<string, unknown> | undefined,
  labels?: ExtraFieldLabels,
): string[] {
  const data = extraData ?? {};
  const fields = schema ?? [];
  const productFields = fields
    .filter((field) => !field.entityType || String(field.entityType).toLowerCase() === "product")
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const lines: string[] = [];
  const covered = new Set<string>();

  for (const field of productFields) {
    const text = formatExtraFieldValue(data[field.id], labels).trim();
    if (!text) {
      continue;
    }
    covered.add(field.id);
    lines.push(`${field.name}: ${text}`);
  }

  for (const [key, raw] of Object.entries(data)) {
    if (covered.has(key)) {
      continue;
    }
    const text = formatExtraFieldValue(raw, labels).trim();
    if (!text) {
      continue;
    }
    lines.push(`${key}: ${text}`);
  }

  return lines;
}
