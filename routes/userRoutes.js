const express = require('express');
const { register, verifyToken } = require('../controllers/userControllers');
const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyToken);

module.exports = router;
