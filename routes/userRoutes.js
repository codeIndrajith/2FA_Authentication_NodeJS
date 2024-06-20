const express = require('express');
const {
  register,
  verifyToken,
  validateToken,
} = require('../controllers/userControllers');
const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyToken);
router.post('/validate', validateToken);

module.exports = router;
