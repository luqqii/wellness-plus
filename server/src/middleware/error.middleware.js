/**
 * Central Error Handler mapping to external Sentry/Datadog APM in Production
 */

export const sentryCaptureException = (err, req) => {
  // Stub for: Sentry.captureException(err)
  console.error(`[Sentry Report Stub] Captured Exception at ${req.originalUrl}`);
  console.error(err.stack);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Report critical errors to APM (Sentry)
  if (statusCode >= 500) {
    sentryCaptureException(err, req);
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
