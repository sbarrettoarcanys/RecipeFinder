export function logError(error, context = {}) {
  const timestamp = new Date().toISOString();

  const payload = {
    timestamp,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
  };

  // Structured console logging
  console.error("❌ [Application Error]", JSON.stringify(payload, null, 2));

  // Optional: Send to external monitoring here (e.g., Sentry, Datadog)
}
