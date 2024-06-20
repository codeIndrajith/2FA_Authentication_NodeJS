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
    id,
    secret: temp_secret,
    name: name,
    email: email,
    password: password,
  });
  if (user) {
    res.json({ id: user.id, secret: temp_secret.base32 });
  } else {
    res.json('user not create');
  }
  await sequelize.close(); // close the Sequelize connection
});

// Verify the token and make secret perm
const verifyToken = asyncHandler(async (req, res) => {
  const { token, userId } = req.body;

  const user = await User.findByPk(userId);
  // Extract base32 value using string manipulation
  if (user) {
    let secretCode;
    if (user.secret) {
      const match = user.secret.match(/"base32":"([^"]+)"/);
      if (match) {
        secretCode = match[1];
      }
    }
    console.log(secretCode);

    // Verify the token using speakeasy
    const verified = speakeasy.totp.verify({
      secret: secretCode,
      encoding: 'base32',
      token,
    });
    console.log(verified);
    if (verified) {
      // Update the user
      await User.update({ secret: user.secret }, { where: { id: userId } });
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } else {
    res.status(500);
    throw new Error('Error retrieving user');
  }
});

// Validate the token
const validateToken = asyncHandler(async (req, res) => {
  const { userId, token } = req.body;
  const user = await User.findByPk(userId);
  // Extract base32 value using string manipulation

  if (user) {
    let secretCode;
    if (user.secret) {
      // Remove the outer quotes and unescape the string
      const unescapedSecret = user.secret.slice(1, -1).replace(/\\"/g, '"');

      // Extract the base32 value using a refined regular expression
      const match = unescapedSecret.match(/"base32":"([^"]+)"/);
      if (match) {
        secretCode = match[1];
      } else {
        throw new Error('Base32 value not found in secret');
      }
    }
    console.log(secretCode);
    // validate the token using speakeasy
    const tokenValidates = speakeasy.totp.verify({
      secret: secretCode,
      encoding: 'base32',
      token,
      window: 1,
    });
    if (tokenValidates) {
      res.json({ validated: true });
    } else {
      res.json({ validated: false });
    }
  } else {
    res.status(500);
    throw new Error('Error retrieving user');
  }
});

module.exports = { register, verifyToken, validateToken };
