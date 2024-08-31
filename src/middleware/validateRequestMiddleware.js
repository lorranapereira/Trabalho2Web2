// src/middleware/validateRequest.js

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: 'Dados inválidos!', details: error.message });
    }

    next();
  };
};

module.exports = validateRequest;
