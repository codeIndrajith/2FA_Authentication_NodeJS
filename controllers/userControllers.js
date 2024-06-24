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

  const userId = uuid.v4();
  // create a temporary secret until it is verified
  const secret = '';
  const temp_secret = speakeasy.generateSecret();
  const user = await User.create({
    id: userId,
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
      const match = user.secret.match(/"base32":"([^"]+)"/);
      if (match) {
        secretCode = match[1];
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
