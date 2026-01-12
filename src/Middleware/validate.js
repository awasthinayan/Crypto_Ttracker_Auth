export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    req.validationError = result.error; // ZodError
  }
  
  next();
};
