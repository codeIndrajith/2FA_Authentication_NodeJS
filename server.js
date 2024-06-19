const express = require('express');
const sequelize = require('./util/db');
const dotenv = require('dotenv');
const app = express();
const PORT = 5000;
dotenv.config();

app.use('/api', (req, res) => {
  res.json('Welcome to two factor authentication');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
