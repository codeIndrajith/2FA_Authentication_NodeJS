const express = require('express');
const sequelize = require('./util/db');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
dotenv.config();
app.use(bodyParser.json());
const userRoutes = require('./routes/userRoutes');
const errorMiddlewares = require('./middleware/errorMiddleware');

app.use('/api/user', userRoutes);

app.use(errorMiddlewares.notFound);
app.use(errorMiddlewares.sequelizeErrorHandler);
app.use(errorMiddlewares.errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
