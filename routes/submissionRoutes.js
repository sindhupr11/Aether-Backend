const express = require('express');
const { submitResponse } = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, submitResponse);

module.exports = router;
