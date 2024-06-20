const { Sequelize } = require('sequelize');
const originalQuery = Sequelize.prototype.query;

// Custom logger to suppress stack traces
const customLogger = {
  log: (msg) => console.log(msg),
  warn: (msg) => console.warn(msg),
  error: (msg) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(msg);
    } else {
      console.error('A Sequelize error occurred');
    }
  },
};

// Initialize Sequelize with custom logger
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: customLogger.log,
    benchmark: true, // This is optional, used for logging execution times
  }
);

// Middleware to handle 404 Not Found errors
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware to handle general errors
const errorHandler = (err, req, res, next) => {
  if (res.statusCode === 200) {
    res.status(500);
  }
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Middleware to handle and log Sequelize errors
const sequelizeErrorHandler = (err, req, res, next) => {
  if (err instanceof Sequelize.ValidationError) {
    customLogger.error('Sequelize Validation Error:', err.message);
    res.status(400).json({
      message: 'Validation Error',
      errors: err.errors,
    });
  } else if (err instanceof Sequelize.DatabaseError) {
    customLogger.error('Sequelize Database Error:', err.message);
    res.status(500).json({
      message: 'Database Error',
      error: err.message,
    });
  } else {
    next(err); // Pass to general error handler
  }
};

// Override Sequelize query method to catch and log errors
Sequelize.prototype.query = function () {
  return originalQuery.apply(this, arguments).catch(function (err) {
    customLogger.error('Sequelize Query Error');
    throw err;
  });
};

// Exporting all middleware
const errorMiddlewares = { notFound, errorHandler, sequelizeErrorHandler };
module.exports = errorMiddlewares;
