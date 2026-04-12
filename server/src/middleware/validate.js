/**
 * Generic Zod validation middleware factory.
 * Pass a Zod schema and it validates req.body against it.
 * Returns 400 with detailed error messages on failure.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Replace body with parsed/coerced data
  req.body = result.data;
  next();
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters',
      errors,
    });
  }

  req.query = result.data;
  next();
};
