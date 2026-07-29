const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getBudgets, setBudget, deleteBudget } = require('../controllers/budgetController');

router.use(protect);
router.get('/', getBudgets);
router.post('/', setBudget);
router.delete('/:id', deleteBudget);

module.exports = router;