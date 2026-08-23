interface ErrorPayload {
  error?: string | { message?: string };
  message?: string;
}

export class RequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "RequestError";
  }
}

export function getErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred"
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error) {
    return error;
  }

  return fallback;
}

export async function getResponseError(
  response: Response,
  fallback: string
): Promise<RequestError> {
  let message = fallback;

  try {
    const payload = (await response.json()) as ErrorPayload;
    const responseMessage =
      typeof payload.error === "string"
        ? payload.error
        : payload.error?.message || payload.message;
    message = responseMessage || fallback;
  } catch {
    // The fallback remains actionable when an upstream returns a non-JSON error.
  }

  return new RequestError(message, response.status);
}
