// src/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // Log do erro no console para depuração
  console.error(`Erro: ${err.message}\nStack: ${err.stack}`);

  // Resposta de erro genérica
  res.status(500).json({ error: 'Algo deu errado!', details: err.message });
};

module.exports = errorHandler;
