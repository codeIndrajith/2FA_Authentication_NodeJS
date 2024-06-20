const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/userModel');
const sequelize = require('../util/db');
const speakeasy = require('speakeasy');
const uuid = require('uuid');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  await sequelize.sync(); // Sync all defined models with database
  console.log('Database synchronized.');
  userExist = await User.findOne({ where: { email } });
  if (userExist) {
    return res.json('User already exists');
  }

  const id = uuid.v4();
  // create a temporary secret until it is verified
  const secret = '';
  const temp_secret = speakeasy.generateSecret();
  const user = await User.create({
    id: id,
    secret: temp_secret,
    name: name,
    email: email,
    password: password,
  });
  if (user) {
    res.json({ id, secret: temp_secret.base32 });
  } else {
    res.json('user not create');
  }
  await sequelize.close(); // close the Sequelize connection
});

module.exports = { register };
