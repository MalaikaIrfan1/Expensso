const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { signup, login, updateProfile, changePassword, deleteAccount } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;