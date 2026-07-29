const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getTransactions, addTransaction, updateTransaction, deleteTransaction, getSummary, getMonthlyComparison, getYearlySummary, exportTransactions,
} = require('../controllers/transactionController');

router.use(protect);
router.get('/', getTransactions);
router.post('/', addTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/export/csv', exportTransactions);
router.get('/summary/all', getSummary);
router.get('/monthly-comparison', getMonthlyComparison);
router.get('/yearly-summary', getYearlySummary);

module.exports = router;