export class PaperbaseApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "PaperbaseApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function formatPaperbaseError(error: unknown): string {
  if (error instanceof PaperbaseApiError) {
    const payload = error.payload;

    if (payload && typeof payload === "object" && "detail" in payload && payload.detail) {
      return String(payload.detail);
    }
    if (payload && typeof payload === "object") {
      const fieldMessages = Object.entries(payload)
        .map(([field, value]) => {
          const text = Array.isArray(value) ? value.join(", ") : String(value);
          return `${field}: ${text}`;
        })
        .join(" | ");
      if (fieldMessages) {
        return fieldMessages;
      }
    }

    return `${error.message} (status ${error.status})`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error.";
}

export function stockValidationErrors(error: unknown): string[] {
  if (
    error instanceof PaperbaseApiError &&
    error.payload &&
    typeof error.payload === "object" &&
    "errors" in error.payload &&
    Array.isArray(error.payload.errors)
  ) {
    return error.payload.errors.map((entry) => String(entry));
  }
  return [];
}
