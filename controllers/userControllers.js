const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/userModel');
const sequelize = require('../util/db');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  await sequelize.sync(); // Sync all defined models with database
  console.log('Database synchronized.');
  userExist = await User.findOne({ where: { email } });
  if (userExist) {
    return res.json('User already exists');
  }

  const user = await User.create({
    name: name,
    email: email,
    password: password,
  });
  if (user) {
    res.json({ name });
  } else {
    res.json('user not create');
  }
  await sequelize.close(); // close the Sequelize connection
});

module.exports = { register };
