const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getRecurring, addRecurring, updateRecurring, deleteRecurring,
} = require('../controllers/recurringController');

router.use(protect);
router.get('/', getRecurring);
router.post('/', addRecurring);
router.put('/:id', updateRecurring);
router.delete('/:id', deleteRecurring);

module.exports = router;