/**
 * Billing controllers and Routes
 * @param  {Function} Billing routes here
 * @module billing/routes user authenticate
 * @see middlewares/protect user authenticate
 */
const express = require('express');
const { protect } = require('../../middlewares/protect');
const { billingCreate, billingSearching, billingUpdate, billingDelete } = require('../controllers/billingControllers');
const router = express.Router()
router.get('/billing-list', protect, billingSearching)
router.post('/add-billing', protect, billingCreate)
router.put('/update-billing/:id', protect, billingUpdate)
router.delete('/delete-billing/:id', protect, billingDelete)
module.exports = router;