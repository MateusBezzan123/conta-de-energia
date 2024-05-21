const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.post('/upload', billController.uploadBill);

module.exports = router;