const express = require('express');
const app = express();
const PORT = 5000;

app.use('/api', (req, res) => {
  res.json('Welcome to two factor authentication');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
